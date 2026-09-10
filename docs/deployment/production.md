# Production Deployment Guide

## Overview

The application deploys to Cloudflare Workers with static assets served via the Cloudflare edge network.

## Pre-Deployment Checklist

Before deploying to production, verify:
- [ ] No real birth dates or family names committed to git (`git grep -i birth`, `git grep -i son`).
- [ ] `.dev.vars` is gitignored and NOT tracked (`git status --ignored`).
- [ ] Production D1 database ID is set in `wrangler.jsonc`.
- [ ] Production secrets configured via `wrangler secret put`.
- [ ] Cloudflare Access protects `/admin*` and `/api/admin/*`.
- [ ] Full test suite passes: `npm run test`.
- [ ] Production build succeeds cleanly: `npm run build`.

## Deployment Commands

### 1. Build and Deploy
```bash
npm run deploy
# Equivalent to: npm run build && wrangler deploy
```

### 2. Verify Edge Functionality
- Visit `https://<your-subdomain>.workers.dev` to verify archive rendering.
- Verify that attempting to access `/admin` redirects to Cloudflare Access login.
- Confirm video playback opens properly in `VideoModal` without console errors.

### YouTube Error 153 Troubleshooting

YouTube error 153 means the player request did not include an HTTP Referer or equivalent client identification. The application prevents this by:

- loading `https://www.youtube.com/embed/{VIDEO_ID}`;
- setting the iframe `referrerPolicy` to `strict-origin-when-cross-origin`; and
- adding `origin=${window.location.origin}` to the embed URL through `URL.searchParams`.

If error 153 returns after a deployment:

1. Hard-refresh or use a private window to rule out a cached JavaScript bundle.
2. Inspect the iframe in browser developer tools and confirm the encoded `origin` matches the current site origin.
3. Confirm the iframe still has `referrerpolicy="strict-origin-when-cross-origin"` and is not sandboxed.
4. Inspect the document response for a global `Referrer-Policy` that suppresses referrers or a CSP `frame-src` rule that excludes `https://www.youtube.com`.
5. Fix only the conflicting directive. Do not remove CSP or other security headers globally.

## Rolling Back
In case of an unexpected issue:
```bash
npx wrangler rollback
```
Lists previous deployments and allows rolling back instantly to a prior version.
