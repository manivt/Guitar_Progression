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
1. Go to **Cloudflare Zero Trust Dashboard** > **Access** > **Applications**.
2. Add an application:
   - **Type:** Self-hosted
   - **Application Name:** Guitar Archive Admin
   - **Path:** `/admin*` and `/api/admin/*`
3. Configure an Access Policy:
   - **Action:** Allow
   - **Rule:** Include Emails > Add your approved family/admin email addresses.
