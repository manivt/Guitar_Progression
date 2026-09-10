# Implementation Plan: Family Guitar Video Archive

## Architecture Overview

**Frontend:** React + TypeScript + Vite + React Router
**Backend:** Cloudflare Workers (TypeScript)
**Database:** Cloudflare D1 (SQLite)
**Deployment:** Cloudflare Workers with static assets via Vite plugin
**Authentication:** Cloudflare Access (protects `/admin*` and `/api/admin/*`)
**Video Hosting:** YouTube Unlisted (metadata only stored in D1)

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── PerformanceCard.tsx
│   │   ├── PerformanceGrid.tsx
│   │   ├── YearSection.tsx
│   │   ├── VideoModal.tsx
│   │   ├── PerformanceForm.tsx
│   │   └── ConfirmDialog.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── youtube.ts
│   │   └── dates.ts
│   ├── types/
│   │   └── performance.ts
│   ├── styles/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── admin.css
│   │   └── responsive.css
│   ├── App.tsx
│   └── main.tsx
├── worker/
│   ├── index.ts
│   ├── routes/
│   │   ├── performances.ts
│   │   └── adminPerformances.ts
│   ├── db/
│   │   └── performances.ts
│   ├── validation/
│   │   └── performance.ts
│   └── utils/
│       ├── age.ts
│       └── youtube.ts
├── migrations/
│   └── 0001_initial.sql
├── tests/
│   ├── youtube.test.ts
│   ├── age.test.ts
│   └── validation.test.ts
├── .dev.vars.example
├── .gitignore
├── wrangler.jsonc
├── package.json
├── tsconfig.json
├── vite.config.ts
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## Database Design

### Table: performances
```sql
CREATE TABLE performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    performance_date TEXT NOT NULL,
    song TEXT NOT NULL,
    artist TEXT,
    youtube_video_id TEXT NOT NULL,
    instrument TEXT,
    performance_type TEXT,
    location TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performances_date ON performances(performance_date DESC);
```

### Performance Types (enum)
- Practice
- Lesson
- Recital
- Concert
- School Performance
- Recording
- Other

## API Design

### Public Read Endpoints
- `GET /api/performances` - List all performances with age calculation
- `GET /api/performances/:id` - Get single performance

### Admin Mutation Endpoints (protected by Cloudflare Access)
- `POST /api/admin/performances` - Create performance
- `PUT /api/admin/performances/:id` - Update performance
- `DELETE /api/admin/performances/:id` - Delete performance

## Security & Privacy Considerations

1. **No hardcoded personal data** - Use environment variables:
   - `CHILD_BIRTH_DATE`
   - `CHILD_DISPLAY_NAME`

2. **Secret Management**
   - `.dev.vars.example` with placeholders only
   - `.dev.vars`, `.env*`, `*.local` in `.gitignore`
   - Production secrets via Cloudflare dashboard

3. **Server-side Validation**
   - All mutations validated on Worker
   - Parameterized SQL queries
   - No user input in SQL strings

4. **Logging Privacy**
   - No private URLs, tokens, birth dates in logs
   - Use performance IDs for debugging

5. **Cloudflare Access**
   - Protect `/admin*` and `/api/admin/*`
   - Allow only approved email addresses through One-time PIN
   - Provide an administrator logout control that returns to the public archive
   - Local development works without Access

## Visual Design Approach

**Theme:** Dark mode by default with warm charcoal surfaces and a restrained gold accent; a persistent toggle provides an optional light theme.

**Typography:** System font stack, clear hierarchy for titles, song names, metadata

**Layout:** Centered max-width 1200-1400px, responsive grid (3/2/1 columns)

**Components:** Minimal borders, subtle shadows, 16:9 thumbnails with play indicator, year headings with subtle rules

**Accessibility:** Semantic HTML, keyboard navigation, focus states, reduced motion support

## Testing Approach

### Unit Tests
- YouTube URL parsing (valid/invalid formats)
- Age calculation (birthday edge cases, leap years, month/year rollovers)
- Input validation (required fields, length limits, enum values)

### Integration Tests
- API endpoints with D1
- Form submission flows

## Deployment Approach

1. `npm run dev` - Local development with Wrangler
2. `npm run db:migrate:local` - Apply migrations to local D1
3. `npm run db:migrate:prod` - Apply migrations to production D1
4. `npm run deploy` - Build and deploy to Cloudflare Workers

## Stages

### Stage 1: Repository & Architecture
- Initialize React + Vite + TypeScript
- Add Cloudflare Worker integration (@cloudflare/vite-plugin)
- Configure React Router
- Configure Wrangler
- Verify dev server runs

### Stage 2: Privacy Foundation
- Create `.gitignore`
- Create `.dev.vars.example`
- Document privacy rules

### Stage 3: D1 Database
- Create migration (0001_initial.sql)
- Configure D1 binding in wrangler.jsonc
- Create database query functions
- Verify local D1 works

### Stage 4: Utilities
- YouTube ID parser with tests
- YouTube thumbnail helper
- Date-only parser/formatter
- Age calculation with tests
- Input validation

### Stage 5: Public API
- GET /api/performances
- GET /api/performances/:id
- Verify responses

### Stage 6: Archive UI
- Header with site title
- Intro section
- Year sections
- Performance cards with thumbnails
- Video modal
- Age/date metadata display

### Stage 7: Admin Create
- Performance form
- YouTube URL validation & preview
- Thumbnail preview
- Server-side validation
- D1 insert
- Success/error handling

### Stage 8: Edit & Delete
- Edit functionality
- Delete with confirmation
- UI updates without reload

### Stage 9: Visual Polish
- Dedicated design review pass
- Spacing, typography, thumbnails, cards, modals, forms
- Focus states, empty states, error states
- Mobile layout

### Stage 10: Privacy/Security Audit
- Check for hardcoded private info
- Secrets in code/logs
- Unparameterized SQL
- Exposed admin routes
- Missing validation

### Stage 11: Testing
- Unit tests
- TypeScript checks
- Build
- Local D1 migrations
- Local application

### Stage 12: Documentation & Deployment Readiness
- Complete README
- Cloudflare setup docs
- D1 creation
- Environment variables
- Cloudflare Access config
- Deployment steps
- Backup procedure
- Adding future performances
