# Worker Architecture & Request Routing

## Overview

The backend is built as a single Cloudflare Worker using native ES Modules (`export default { async fetch(...) }`) and strict TypeScript compilation under `module: nodenext`.

## Worker Entry Point (`worker/index.ts`)

### Environment Binding Interface (`Env`)

```ts
export interface Env {
  DB: D1Database;
  CHILD_BIRTH_DATE: string;
  CHILD_DISPLAY_NAME: string;
  ASSETS: Fetcher;
}
```

- **`DB`:** Cloudflare D1 SQLite database binding.
- **`CHILD_BIRTH_DATE`:** Cloudflare secret representing the musician's birth date (format: `YYYY-MM-DD`).
- **`CHILD_DISPLAY_NAME`:** Cloudflare secret for display label in greetings/headers.
- **`ASSETS`:** Cloudflare static asset fetcher binding used to serve the React SPA and static client files.

## Routing Tree & Fallbacks

```
Incoming Request
 │
 ├── Starts with `/api/admin/performances`
 │    ├── POST /api/admin/performances ──────► handleCreatePerformance()
 │    ├── PUT  /api/admin/performances/:id ──► handleUpdatePerformance()
 │    └── DELETE /api/admin/performances/:id ─► handleDeletePerformance()
 │
 ├── Matches `/api/performances`
 │    └── GET  /api/performances ────────────► handleGetPerformances()
 │
 ├── Matches `/api/performances/:id`
 │    └── GET  /api/performances/:id ────────► handleGetPerformance()
 │
 ├── Starts with `/api/*` (unmatched)
 │    └── Returns 404 JSON: `{ error: 'Endpoint or method not found' }`
 │
 └── All Other Requests
      └── Falls through to `env.ASSETS.fetch(request)` (SPA / static assets)
```

## Architectural Safeguards

1. **404 JSON Fallback:**
   Any request directed to `/api/*` that does not match a registered handler immediately returns a JSON response with status 404. This prevents non-existent API endpoints from falling through to the static asset handler and serving `index.html` as a false 200 OK.
2. **Safe ID Extraction:**
   Route handlers capture numeric identifiers from URL path regexes with safe string-null guards (`idMatch[1]!`) and check for `NaN` after `parseInt`.
3. **Module Resolution Invariants:**
   Because the worker compiles under TypeScript `nodenext` with `verbatimModuleSyntax: true`, all internal relative imports use `.js` extensions (e.g. `import { ... } from './routes/performances.js'`).
