# Guitar Journey — LLM Knowledge Base

This directory contains a structured knowledge base for the Guitar Journey application, designed to enable efficient review by LLMs and engineers for blindspot detection, security auditing, and architectural validation.

## Structure

```
docs/
├── index.md                     # Knowledge base entry point
├── architecture/
│   ├── overview.md              # High-level architecture & design choices
│   ├── data-flow.md             # Request / response lifecycle diagrams
│   └── boundaries.md            # System, trust & security perimeters
├── frontend/
│   ├── component-map.md         # React component hierarchy & UI patterns
│   ├── state-management.md      # State patterns and reactive flows
│   ├── routing.md               # React Router configuration & navigation
│   └── styling.md               # CSS design tokens, touch targets & motion
├── backend/
│   ├── worker-structure.md      # Worker entry, bindings & 404 handling
│   ├── api-endpoints.md         # API route specifications & responses
│   ├── database-schema.md       # Cloudflare D1 schema & queries
│   ├── validation.md            # Server-side input validation rules
│   └── utils.md                 # Age calculations & YouTube normalization
├── security/
│   ├── privacy-model.md         # Privacy guarantees & child protection
│   ├── secrets-management.md    # Secret lifecycle & zero-leakage policy
│   ├── access-control.md        # Cloudflare Access integration
│   ├── input-validation.md      # Defense-in-depth sanitization
│   └── logging.md               # Privacy-preserving logging practices
├── testing/
│   ├── test-strategy.md         # Quality assurance & testing pyramid
│   ├── unit-tests.md            # Vitest unit test breakdown (71 tests)
│   └── integration-tests.md     # Miniflare D1 & API integration tests
├── deployment/
│   ├── local-dev.md             # Local development setup & scripts
│   ├── cloudflare-setup.md      # Cloudflare resource provisioning
│   ├── migrations.md            # D1 SQLite schema migrations
│   └── production.md            # Production checklist & deployment
└── blindspot-checklist.md       # Audit checklist for release verification
```

## Quick Navigation

### Architecture & System Design
- [Architecture Overview](architecture/overview.md) — High-level architecture, technology choices, and data flow.
- [Data Flow](architecture/data-flow.md) — Detailed read/write lifecycle diagrams.
- [Trust & Architecture Boundaries](architecture/boundaries.md) — Security perimeters, Cloudflare Access gates, and media isolation.

### Frontend
- [Component Map](frontend/component-map.md) — Component hierarchy, accessibility, and modal focus traps.
- [State Management](frontend/state-management.md) — React state patterns, derived states, and toast context.
- [Routing](frontend/routing.md) — React Router v7 configuration, SPA navigation, and 404 fallback.
- [Styling](frontend/styling.md) — CSS custom properties, responsive breakpoints, touch targets, and reduced motion.

### Backend & Storage
- [Worker Structure](backend/worker-structure.md) — Cloudflare Worker entry point, environment bindings, and 404 fallback.
- [API Endpoints](backend/api-endpoints.md) — Public and protected endpoints, schemas, and status codes.
- [Database Schema](backend/database-schema.md) — D1 SQLite table structure, indexes, and queries.
- [Validation Rules](backend/validation.md) — Server-side input validation and constraints.
- [Backend Utilities](backend/utils.md) — Deterministic age calculation and YouTube URL normalization.

### Security & Privacy
- [Privacy Model](security/privacy-model.md) — Core privacy invariants and child protection guarantees.
- [Secrets Management](security/secrets-management.md) — Runtime secrets, `.dev.vars` isolation, and zero-leakage rules.
- [Access Control](security/access-control.md) — Cloudflare Access integration and route protection.
- [Input Validation](security/input-validation.md) — Defense-in-depth sanitization and SQL injection prevention.
- [Logging Practices](security/logging.md) — Privacy-preserving logging and PII suppression.

### Testing & Quality Assurance
- [Test Strategy](testing/test-strategy.md) — Testing approach, test pyramid, and coverage goals.
- [Unit Tests](testing/unit-tests.md) — Breakdown of the 71 unit tests across age math, YouTube parsing, and validation.
- [Integration Tests](testing/integration-tests.md) — Miniflare D1 testing and manual API endpoint verification.

### Operations & Deployment
- [Local Development](deployment/local-dev.md) — Local setup, environment configuration, and dev scripts.
- [Cloudflare Setup](deployment/cloudflare-setup.md) — D1 provisioning, secret setting (`wrangler secret put`), and deployment.
- [Database Migrations](deployment/migrations.md) — Applying local and remote D1 migrations.
- [Production Deployment](deployment/production.md) — Release checklist, deployment commands, and rollback procedures.
- [Audit Checklist](blindspot-checklist.md) — Verification checklist before production releases.

## Core Architectural Invariants

1. **Zero Personal Data in Repository:** No birth dates, names, or private links in source control.
2. **Strict Server-Side Validation:** All mutations are validated in Worker runtime.
3. **Parameterized SQL Queries:** No string interpolation in SQLite queries.
4. **Isolated Secrets:** `CHILD_BIRTH_DATE` and `CHILD_DISPLAY_NAME` are configured via Cloudflare secrets and `.dev.vars` (never committed).
5. **Separation of Concerns:** Public read routes (`/api/performances`) are cleanly separated from protected mutation routes (`/api/admin/*`).
6. **Dynamic Age Derivation:** Child's age is calculated at runtime from `CHILD_BIRTH_DATE` and `performance_date`.
7. **Date-Only Semantics:** All dates are stored as `YYYY-MM-DD` and rendered in local time to avoid UTC day shifts.
8. **YouTube Normalization:** Only 11-character video IDs are stored; no external iframes or arbitrary HTML.