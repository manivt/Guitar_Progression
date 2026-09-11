# Architecture Overview

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────────────────────────────┐  │
│  │  Static      │    │           Worker (API)               │  │
│  │  Assets      │    │  ┌────────────────────────────────┐  │  │
│  │  (React SPA) │◄───│  │ Routes:                        │  │  │
│  │              │    │  │  GET  /api/performances        │  │  │
│  │  index.html  │    │  │  GET  /api/performances/:id    │  │  │
│  │  /assets/*   │    │  │  POST /api/admin/performances  │  │  │
│  └──────────────┘    │  │  PUT  /api/admin/performances/:id│ │  │
│         ▲            │  │  DELETE /api/admin/performances/:id│ │  │
│         │            │  └────────────────────────────────┘  │  │
│         │            │                  │                    │  │
│         │            │                  ▼                    │  │
│         │            │  ┌────────────────────────────────┐  │  │
│         │            │  │         D1 Database            │  │  │
│         │            │  │  Table: performances           │  │  │
│         │            │  │  Index: idx_performances_date  │  │  │
│         │            │  └────────────────────────────────┘  │  │
│         │            └──────────────────────────────────────┘  │
│         │                                                         │
└─────────│─────────────────────────────────────────────────────────┘
          │ HTTPS
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React App (SPA)                                        │   │
│  │  - HomePage: Archive view with year sections            │   │
│  │  - AdminPage: CRUD form + list                          │   │
│  │  - VideoModal: YouTube iframe player                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Single Worker with Asset Binding
- Uses `@cloudflare/vite-plugin` for unified build
- Worker serves both API routes and static assets via `ASSETS` binding
- Eliminates separate Workers for frontend/backend

### 2. Route Separation for Access Control
```
Public (no auth required):
  GET /api/performances
  GET /api/performances/:id
  GET / (archive)
  GET /* (static assets)

Admin (Cloudflare Access protected):
  GET /admin
  POST /api/admin/performances
  PUT /api/admin/performances/:id
  DELETE /api/admin/performances/:id
```
This allows a single Access policy: `/admin*` and `/api/admin/*`

### 3. YouTube as Video CDN
- Videos uploaded manually to YouTube as Unlisted
- Only 11-character video ID stored in D1
- Cards and form previews derive YouTube's generated early-frame image (`hq1.jpg`) on demand from the video ID; they do not depend on custom-thumbnail or max-resolution availability
- No video storage costs, no transcoding, no bandwidth concerns

### 4. Date-Only Semantics
- `performance_date` stored as `YYYY-MM-DD` string
- All date parsing uses local date construction (`new Date(year, month, day)`)
- No `new Date("YYYY-MM-DD")` which parses as UTC
- Age calculated at read time from `CHILD_BIRTH_DATE` env var

### 5. Privacy by Design
- Zero personal data in repository
- `CHILD_BIRTH_DATE` and `CHILD_DISPLAY_NAME` only in env vars
- `.dev.vars.example` with placeholders only
- `.dev.vars` gitignored
- No logging of PII (only performance IDs)

## Data Flow

### Read Path (Public Archive)
```
Browser → GET /api/performances
  → Worker (performances.ts)
    → D1: SELECT * FROM performances ORDER BY performance_date DESC
    → Map rows → Performance[] with calculated age
  → JSON response
  → React: HomePage → YearSection → PerformanceGrid → PerformanceCard
  → Click thumbnail → VideoModal with YouTube iframe
```

### Write Path (Admin)
```
Browser (AdminPage) → POST /api/admin/performances
  → Worker (adminPerformances.ts)
    → validatePerformanceInput() — server-side validation
    → extractYouTubeVideoId() — normalize URL to 11-char ID
    → D1: INSERT ... RETURNING *
    → Map row → Performance with calculated age
  → JSON response (201)
  → React: toast success, refresh list
```

## Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend Framework | React 19 | Mature, good Cloudflare Workers support |
| Build Tool | Vite + @cloudflare/vite-plugin | Native Workers integration, fast HMR |
| Router | React Router v7 | Standard, works with SSR/SPA |
| Language | TypeScript (strict) | Type safety across boundary |
| Database | Cloudflare D1 (SQLite) | Native to Workers, SQL, ACID |
| Styling | CSS Variables + Modules | No runtime, maintainable, portable |
| Testing | Vitest | Fast, Vite-native, good TS support |
| Linting | oxlint | Fast, Rust-based |
| Auth | Cloudflare Access | Zero-code auth, integrates with Workers |

## Scalability Considerations

- **D1 Limits**: 10GB per database, 25M rows — sufficient for decades of performances
- **Read Performance**: Single indexed query (`idx_performances_date`), no pagination needed for hundreds of records
- **Static Assets**: Served from Cloudflare CDN globally
- **Worker CPU**: Minimal — simple queries, no heavy computation
- **YouTube**: Handles all video delivery bandwidth

## Future Extension Points

| Feature | Impact on Current Architecture |
|---------|-------------------------------|
| Song history (`/songs/:song`) | Add index on `song`, new API endpoint |
| Multiple children | Add `child_id` column, filter by child |
| Favorites | Add `is_favorite` boolean column |
| Search | Add FTS5 virtual table or external search |
| Photos | Add `photo_url` column or separate table |
| Comments | New `comments` table with `performance_id` FK |

All extensions are additive — no breaking changes to current schema or API.
