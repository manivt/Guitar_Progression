# Cloudflare Setup & Deployment Guide

This guide details the steps required to deploy the application to Cloudflare.

## Prerequisites
- Node.js 20+ and npm
- A Cloudflare account
- Wrangler CLI (`npm install -g wrangler` or via `npx wrangler`)

---

## Step 1: Authentication
```bash
npx wrangler login
```

---

## Step 2: D1 Database Provisioning

1. Create the production D1 database:
   ```bash
   npx wrangler d1 create guitar-archive
   ```

2. Copy the `database_id` output from the terminal and update `wrangler.jsonc`:
   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "guitar-archive",
       "database_id": "<YOUR_ACTUAL_DATABASE_ID>"
     }
   ]
   ```

3. Run migrations on the production database:
   ```bash
   npm run db:migrate:prod
   ```

---

## Step 3: Configure Environment Secrets

Configure the child's birth date and display name via Wrangler secrets:
```bash
npx wrangler secret put CHILD_BIRTH_DATE
# Enter date in format: YYYY-MM-DD (e.g. 2015-06-15)

npx wrangler secret put CHILD_DISPLAY_NAME
# Enter display name (e.g. Musician)
```

---

## Step 4: Build & Deploy

Run the deployment script:
```bash
npm run deploy
```
This command automatically executes:
1. `tsc -b` (Type checking)
2. `vite build` (Compiles both Worker and static assets)
3. `wrangler deploy` (Uploads assets and Worker to Cloudflare edge)

---

## Step 5: Configure Cloudflare Access

To protect the admin area in production:
1. Create a Zero Trust organization using the **Zero Trust Free** plan.
2. Go to **Integrations > Identity providers**, add **One-time PIN**, and save it.
3. Go to **Access controls > Applications > Access applications**.
4. Add one application:
   - **Type:** Self-hosted
   - **Application Name:** Guitar Archive Admin
   - **Subdomain:** `guitar-archive`
   - **Domain:** `guitar-progression.workers.dev`
   - **Path 1:** `/admin*`
   - **Path 2:** `/api/admin/*`
5. Configure an Access Policy inside that application:
   - **Action:** Allow
   - **Rule:** Include Emails > Add only approved family/admin email addresses.
   - **Login method:** One-time PIN
6. Confirm `/` and `/api/performances*` are not included in the protected paths.

### Verify Access

1. In a private browser, confirm `/` opens without authentication.
2. Visit `/admin` and complete the email PIN challenge.
3. Confirm add, edit, and delete work after authentication.
4. Select **Log out** in the admin toolbar. The application requests `/cdn-cgi/access/logout` and returns to `/`.
5. Revisit `/admin` and confirm Access requests authentication again. Cloudflare token revocation may take approximately 20–30 seconds to propagate.
6. Send an unauthenticated request to `/api/admin/performances`; it must receive an Access redirect or denial rather than reaching the Worker mutation handler.
