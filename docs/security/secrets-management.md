# Secrets Management & Zero-Leakage Policy

## Principles

The Guitar Journey archive is a private family application. Under no circumstances should real personal identifying information (PII), child names, birth dates, or internal credentials be committed to git, logged in build outputs, or stored in static bundles.

## Environment Secrets

The application requires only two runtime configuration secrets:
1. `CHILD_BIRTH_DATE`: Required for calculating the performer's age dynamically on each performance. Format: `YYYY-MM-DD`.
2. `CHILD_DISPLAY_NAME`: Performer display name used in titles and UI greetings.

## Local Development Lifecycle

1. A template file, `.dev.vars.example`, is committed with generic placeholders:
   ```ini
   CHILD_BIRTH_DATE=2015-01-01
   CHILD_DISPLAY_NAME=Musician
   ```
2. The developer copies this template to `.dev.vars`:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
3. `.dev.vars` is strictly excluded in `.gitignore`:
   ```gitignore
   .dev.vars
   .env
   .env.local
   .env.*.local
   ```
4. Wrangler automatically injects variables from `.dev.vars` into the Worker's `env` parameter during local development (`npm run dev`).

## Production Secrets Lifecycle

In production Cloudflare Workers environments:
- Secrets are encrypted at rest and injected directly into Worker memory at runtime.
- Secrets are provisioned via Cloudflare CLI or Dashboard:
  ```bash
  npx wrangler secret put CHILD_BIRTH_DATE
  npx wrangler secret put CHILD_DISPLAY_NAME
  ```
- **Invariant:** `wrangler.jsonc` does NOT define a `vars` block containing sensitive keys.

## Build-Time vs Runtime Boundary

- Frontend Vite bundles (`dist/client/`) contain **zero** references to `CHILD_BIRTH_DATE`.
- The client receives the calculated age (`{ years, months }`) as a public response attribute from the Worker API; it never learns the actual birth date of the child.
