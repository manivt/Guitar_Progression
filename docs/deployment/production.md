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

## Rolling Back
In case of an unexpected issue:
```bash
npx wrangler rollback
```
Lists previous deployments and allows rolling back instantly to a prior version.
