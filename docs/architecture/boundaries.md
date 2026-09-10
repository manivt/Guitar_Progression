# Trust & Architecture Boundaries

This document defines the system boundaries, trust zones, and security responsibilities across the Guitar Journey application.

## System Boundaries Diagram

```
[ Public Internet ]
        │
        ▼
┌────────────────────────────────────────────────────────┐
│ Cloudflare Network Edge                                │
│                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │ Cloudflare Access       │  │ Public Pass-Through │  │
│  │ (Auth Gate)             │  │ (No Auth Required)  │  │
│  │ Protects:               │  │ Serves:             │  │
│  │  - /admin               │  │  - / (Homepage)     │  │
│  │  - /api/admin/*         │  │  - /api/performances│  │
│  │                         │  │  - Static Assets    │  │
│  └───────────┬─────────────┘  └──────────┬──────────┘  │
│              │                           │             │
│              ▼                           ▼             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cloudflare Worker                                │  │
│  │  - Server-side input validation                  │  │
│  │  - Age calculation (using CHILD_BIRTH_DATE)      │  │
│  │  - Parameterized D1 SQL queries                  │  │
│  │  - Static asset fallback via env.ASSETS          │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│                             ▼                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cloudflare D1 (SQLite)                           │  │
│  │  - Private metadata store                        │  │
│  │  - Accessible ONLY by the Worker                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
        │                                  │
        │ Direct Thumbnail Fetch           │ Embedded Player
        ▼                                  ▼
┌───────────────────────┐          ┌───────────────────────┐
│ YouTube Image CDN     │          │ YouTube Player CDN    │
│ (img.youtube.com)     │          │ (youtube.com/embed)   │
└───────────────────────┘          └───────────────────────┘
```

## Boundary Descriptions

### 1. External Public Boundary
- **Public Archive (`/`):** Viewable by family or public (can optionally be protected with full-site Access later).
- **Public API (`/api/performances`, `/api/performances/:id`):** Read-only endpoints returning performance metadata. No authentication required.
- **Static Assets (`/dist/client`):** Compiled JS, CSS, HTML served via Cloudflare edge cache.

### 2. Admin Authentication Boundary (Cloudflare Access)
- **Protected Paths:** `/admin*` and `/api/admin/*`.
- **Enforcement:** Cloudflare Access blocks unauthenticated traffic at the Cloudflare edge before it ever reaches the application.
- **Local Development:** Local environment does not require Access credentials, allowing rapid testing with `.dev.vars`.

### 3. Application / Worker Boundary
- **Validation:** Never trusts client input. All fields are sanitized, trimmed, and validated server-side.
- **Secrets Isolation:** `CHILD_BIRTH_DATE` and `CHILD_DISPLAY_NAME` exist only inside Worker memory during request execution and are never passed back to client-side scripts.
- **Age Derivation:** The child's birth date is never transmitted to the browser; only derived age (`{ years, months }`) is returned in responses.

### 4. Database Boundary (Cloudflare D1)
- D1 is private to the Cloudflare account and accessible only through the `env.DB` binding inside the Worker.
- All operations use parameterized queries (`.prepare().bind()`) with zero SQL string concatenation.

### 5. Third-Party Media Boundary (YouTube)
- **Zero Video Ingestion:** No video files or raw binaries touch Cloudflare Workers or D1.
- **Metadata Only:** The database stores only the sanitized 11-character YouTube video ID.
- **No Embedded HTML:** The database never stores iframe or embed code.
- **Player Isolation:** YouTube player is loaded on-demand only when a user clicks a performance card thumbnail.
- **Embed Identification:** The iframe uses `strict-origin-when-cross-origin`, so cross-origin requests disclose only the site origin required by YouTube, not the archive page path or query string.
- **Runtime Origin:** The YouTube `origin` parameter comes from `window.location.origin`; no deployment hostname is trusted from stored data or hardcoded in the bundle.
- **Scoped Policy:** The iframe policy is configured on `VideoModal` itself. Global Referrer-Policy, CSP, iframe sandbox, and other security headers must not be weakened to support playback.
