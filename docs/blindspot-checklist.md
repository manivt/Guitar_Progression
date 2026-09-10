# Codebase Audit & Blindspot Checklist

Use this checklist during maintenance or before major releases.

## 1. Privacy & Secrets
- [ ] No real child names, birth dates, or private YouTube URLs in commits or code.
- [ ] `.dev.vars` is ignored and not staged.
- [ ] `wrangler.jsonc` does not contain committed `"vars"`.
- [ ] Logs contain only technical identifiers (e.g. `performanceId`), never raw PII or request bodies.

## 2. Date & Timezone Integrity
- [ ] Dates in database are formatted strictly as `YYYY-MM-DD`.
- [ ] Frontend uses `formatDisplayDate()` to avoid UTC midnight date shifts in Western timezones.
- [ ] Age calculation tests pass for leap years (Feb 29) and month rollovers.

## 3. Build & Bundler
- [ ] `vite.config.ts` path aliases match `tsconfig.app.json` paths.
- [ ] Relative imports in `worker/` include explicit `.js` extensions for NodeNext compliance.
- [ ] `npm run build` (`tsc -b && vite build`) executes cleanly with code 0.
- [ ] `npm run test` passes all unit tests with code 0.

## 4. API & Cloudflare Access Boundaries
- [ ] Public reads are strictly under `/api/performances`.
- [ ] Admin mutations are strictly under `/api/admin/performances`.
- [ ] Unhandled `/api/*` paths return 404 JSON, never falling through to static asset serving.
- [ ] Cloudflare Access protects `/admin*` and `/api/admin/*` in production.

## 5. YouTube Embed Boundary
- [ ] `VideoModal` uses the standard `https://www.youtube.com/embed/{VIDEO_ID}` URL.
- [ ] The iframe uses `referrerPolicy="strict-origin-when-cross-origin"`; it must not use `no-referrer`.
- [ ] The `origin` player parameter is derived from `window.location.origin`, not a hardcoded deployment hostname.
- [ ] `allowFullScreen` and the iframe permission allowlist remain present.
- [ ] No global Referrer-Policy, CSP, or iframe sandbox suppresses YouTube's required embedding-site identification.
