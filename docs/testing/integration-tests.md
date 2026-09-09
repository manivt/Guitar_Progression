# Integration & Boundary Testing

## Overview

Integration testing verifies that the Cloudflare Worker, D1 SQLite database, and React frontend collaborate correctly across runtime boundaries.

## Testing Against Miniflare (Local D1)

Wrangler uses Miniflare under the hood to simulate Cloudflare Workers and D1 locally:

```bash
# 1. Apply schema to local D1 SQLite store
npm run db:migrate:local

# 2. Launch Vite + Worker dev server
npm run dev
```

During local execution:
- Local D1 stores state in `.wrangler/state/v3/d1`.
- Requests to `/api/performances` query this local SQLite database.
- Dynamic age calculations run inside the Worker execution context against `CHILD_BIRTH_DATE` defined in `.dev.vars`.

## Manual Verification Checklist for API Endpoints

1. **Create Performance:**
   ```bash
   curl -X POST http://localhost:5173/api/admin/performances \
     -H "Content-Type: application/json" \
     -d '{"performanceDate":"2026-09-01","song":"Classical Gas","youtubeUrl":"https://youtu.be/abc123XYZ01"}'
   ```
   - Expect: HTTP 201 Created with JSON representation and calculated `age`.

2. **Retrieve List:**
   ```bash
   curl http://localhost:5173/api/performances
   ```
   - Expect: HTTP 200 OK with `{ performances: [...] }` sorted reverse-chronologically.

3. **Delete Performance:**
   ```bash
   curl -X DELETE http://localhost:5173/api/admin/performances/1
   ```
   - Expect: HTTP 200 OK with `{ success: true }`.
