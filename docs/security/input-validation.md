# Input Validation & Defense-in-Depth

## Architecture

Input validation is enforced using a defense-in-depth model across two separate tiers:
1. **Frontend Validation (`src/components/PerformanceForm.tsx`):** Immediate visual feedback for human users (UX enhancement).
2. **Server-Side Validation (`worker/validation/performance.ts`):** Cryptographic security boundary executed on the Cloudflare Worker prior to any database operation.

Frontend validation can be bypassed by an attacker using `curl` or custom HTTP scripts; the server validation is authoritative.

## Validation Invariants

| Field | Type | Required? | Constraints | Sanitization / Handling |
|---|---|---|---|---|
| `performanceDate` | string | **Yes** | Exactly matches `^\d{4}-\d{2}-\d{2}$` | Trimmed, validated against calendar days |
| `song` | string | **Yes** | Non-empty, 1 to 200 characters | Trimmed |
| `artist` | string | No | Max 200 characters | Trimmed; empty string converts to `null` |
| `youtubeUrl` | string | **Yes** | Valid YouTube URL yielding an 11-char ID | Extracted via `extractYouTubeVideoId` |
| `instrument` | string | No | Max 100 characters | Trimmed; empty string converts to `null` |
| `performanceType` | string | No | Must be one of predefined `PERFORMANCE_TYPES` | Validated via `PERFORMANCE_TYPES.includes()` |
| `location` | string | No | Max 200 characters | Trimmed; empty string converts to `null` |
| `notes` | string | No | Max 5000 characters | Trimmed; empty string converts to `null` |

## Malformed JSON Protection

In `worker/routes/adminPerformances.ts`, `request.json()` is protected with a dedicated `try/catch` handler:
```ts
let body: unknown;
try {
  body = await request.json();
} catch {
  return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
```
If an invalid JSON payload is transmitted, the worker immediately rejects the request with HTTP 400 without leaking stack traces.

## SQL Injection Prevention

All database interactions in `worker/db/performances.ts` execute via parameterized D1 SQLite queries (`?` placeholders). No user-supplied parameters are ever concatenated or interpolated into SQL queries.
