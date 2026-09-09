# Guitar Journey — LLM Knowledge Base

This directory contains a structured knowledge base for the Guitar Journey application, designed to enable efficient review by LLMs for blindspot detection, security auditing, and architectural validation.

## Structure

```
docs/
├── index.md                 # This file - entry point
├── architecture/
│   ├── overview.md          # High-level architecture
│   ├── data-flow.md         # Request/response flows
│   └── boundaries.md        # Security/trust boundaries
├── frontend/
│   ├── component-map.md     # Component hierarchy and responsibilities
│   ├── state-management.md  # State patterns used
│   ├── routing.md           # Route structure
│   └── styling.md           # CSS architecture
├── backend/
│   ├── worker-structure.md  # Worker entry and routing
│   ├── api-endpoints.md     # All API routes with schemas
│   ├── database-schema.md   # D1 schema and queries
│   ├── validation.md        # Server-side validation rules
│   └── utils.md             # Shared utilities
├── security/
│   ├── privacy-model.md     # Privacy requirements and implementation
│   ├── secrets-management.md # How secrets are handled
│   ├── access-control.md    # Cloudflare Access integration
│   ├── input-validation.md  # Validation at each layer
│   └── logging.md           # Logging practices
├── testing/
│   ├── test-strategy.md     # Testing approach
│   ├── unit-tests.md        # Unit test coverage
│   └── integration-tests.md # Integration test coverage
├── deployment/
│   ├── local-dev.md         # Local development setup
│   ├── cloudflare-setup.md  # Cloudflare resources
│   ├── migrations.md        # Migration process
│   └── production.md        # Production deployment
└── blindspot-checklist.md   # Known areas for reviewer attention
```

## Quick Navigation for Reviewers

### Start Here
1. [Architecture Overview](architecture/overview.md) — Understand the big picture
2. [Security: Privacy Model](security/privacy-model.md) — Core privacy requirements
3. [Blindspot Checklist](blindspot-checklist.md) — Known areas needing review

### Deep Dives
- [Frontend Components](frontend/component-map.md) — React component tree
- [API Endpoints](backend/api-endpoints.md) — Complete API surface
- [Database Schema](backend/database-schema.md) — D1 tables and queries
- [Validation Rules](backend/validation.md) — Server-side validation
- [Access Control](security/access-control.md) — Cloudflare Access integration

## Project Summary

**Purpose:** Private family archive for guitar performance videos
**Hosting:** Cloudflare Workers + D1 + Static Assets
**Video Storage:** YouTube Unlisted (metadata only in D1)
**Auth:** Cloudflare Access (protects `/admin*` and `/api/admin/*`)
**Privacy:** Zero personal data in source; all secrets via env vars

## Key Invariants (Must Hold)

1. **No real personal data in source** — verified by grepping for birth dates, names, etc.
2. **All mutations validated server-side** — frontend validation is UX only
3. **Parameterized SQL only** — no string concatenation in queries
4. **Secrets only in Cloudflare dashboard** — never in code, logs, or `.dev.vars` (committed)
5. **Admin routes under `/api/admin`** — separable for Access policy
6. **Age calculated, not stored** — derived from `CHILD_BIRTH_DATE` + `performance_date`
7. **Dates are date-only** — no timezone shifting bugs
8. **YouTube IDs normalized** — stored as 11-char ID, never full URLs/embeds

## Reviewer Instructions

When reviewing this codebase:

1. **Read the blindspot checklist first** — it identifies known risk areas
2. **Trace data flow** from admin form → Worker → D1 → public API → UI
3. **Verify privacy boundaries** — no env vars leak to client, no personal data in logs
4. **Check validation parity** — frontend and backend validation should match
5. **Confirm Access compatibility** — `/admin*` and `/api/admin*` are cleanly separable
6. **Test date handling** — especially around birthdays and year boundaries
7. **Verify YouTube parsing** — all supported formats, rejection of invalid
8. **Check for hardcoded values** — especially in example/test data

## Version

This knowledge base reflects the implementation as of the initial build (Stages 1-8 complete).