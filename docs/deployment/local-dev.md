# Local Development Setup

## Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- Wrangler CLI (`npm install -g wrangler` or via `npx wrangler`)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Local Environment Variables
Copy the example environment file:
```bash
cp .dev.vars.example .dev.vars
```
Edit `.dev.vars` with non-sensitive test values:
```ini
CHILD_BIRTH_DATE=2015-01-01
CHILD_DISPLAY_NAME=Musician
```
*(Note: `.dev.vars` is gitignored to protect sensitive information).*

### 3. Initialize Local D1 Database & Migrations
Run the initial SQLite migrations against your local Miniflare environment:
```bash
npm run db:migrate:local
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
- Main Archive: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin`

## Development Scripts

- `npm run dev`: Starts Vite dev server with Cloudflare Worker emulation.
- `npm run lint`: Runs `oxlint` linter.
- `npm run test`: Runs the Vitest test suite.
- `npm run build`: Type-checks (`tsc -b`) and produces production bundles.
