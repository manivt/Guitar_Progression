# Guitar Journey — Technical Knowledge Base

This directory contains the structured documentation and knowledge base for the Guitar Journey application.

## Structure

```
docs/
├── index.md                     # Knowledge base entry point
├── architecture/
│   ├── overview.md              # High-level system architecture & data flow
│   ├── data-flow.md             # Request / response lifecycle diagrams
│   └── boundaries.md            # System & security boundaries
├── frontend/
│   └── component-map.md         # React component hierarchy & UI patterns
├── backend/
│   ├── api-endpoints.md         # API route specifications & responses
│   ├── database-schema.md       # Cloudflare D1 schema & queries
│   └── validation.md            # Server-side input validation rules
├── security/
│   └── privacy-model.md         # Privacy guarantees & secret handling
├── deployment/
│   └── cloudflare-setup.md      # Provisioning, migration, and deployment guide
└── blindspot-checklist.md       # Audit checklist for maintenance
```

## Quick Navigation

### Architecture & System Design
- [Architecture Overview](architecture/overview.md) — Tech stack, high-level decisions, and data flow.
- [Data Flow](architecture/data-flow.md) — Detailed request and mutation flows.
- [Trust & Architecture Boundaries](architecture/boundaries.md) — Security perimeters, Access gates, and media isolation.

### Frontend
- [Frontend Component Map](frontend/component-map.md) — Component tree, accessible video modal, and state patterns.

### Backend & Storage
- [API Endpoints](backend/api-endpoints.md) — Public and protected endpoints, schemas, and status codes.
- [Database Schema](backend/database-schema.md) — D1 SQLite table structure, indexes, and persistence.
- [Validation Rules](backend/validation.md) — Input validation, constraints, and YouTube URL normalization.

### Security & Privacy
- [Privacy & Security Model](security/privacy-model.md) — Core privacy invariants, secrets management, and access control.

### Operations & Deployment
- [Cloudflare Setup & Deployment](deployment/cloudflare-setup.md) — Step-by-step instructions for D1, secrets, and deploying.
- [Audit & Blindspot Checklist](blindspot-checklist.md) — Verification checklist before production releases.

## Core Architectural Invariants

1. **Zero Personal Data in Repository:** No birth dates, names, or private links in source control.
2. **Strict Server-Side Validation:** All mutations are validated in Worker runtime.
3. **Parameterized SQL Queries:** No string interpolation in SQLite queries.
4. **Isolated Secrets:** `CHILD_BIRTH_DATE` and `CHILD_DISPLAY_NAME` are configured via Cloudflare secrets and `.dev.vars` (never committed).
5. **Separation of Concerns:** Public read routes (`/api/performances`) are cleanly separated from protected mutation routes (`/api/admin/*`).
6. **Dynamic Age Derivation:** Child's age is calculated at runtime from `CHILD_BIRTH_DATE` and `performance_date`.
7. **Date-Only Semantics:** All dates are stored as `YYYY-MM-DD` and rendered in local time to avoid UTC day shifts.
8. **YouTube Normalization:** Only 11-character video IDs are stored; no external iframes or arbitrary HTML.