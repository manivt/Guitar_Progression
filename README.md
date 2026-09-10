# Guitar Journey — Family Guitar Video Archive

A polished, production-ready web application for maintaining a chronological archive of guitar performances. Built for family use with privacy as a core requirement.

## Features

- **Chronological Archive** — Performances displayed in reverse chronological order, grouped by year
- **YouTube Integration** — Videos hosted on YouTube (Unlisted), only metadata stored in Cloudflare D1
- **Admin Interface** — Add, edit, and delete performances at `/admin` (protected by Cloudflare Access)
- **Video Playback** — Click thumbnails to watch in a polished modal
- **Age Calculation** — Automatically calculates child's age at each performance
- **Responsive Design** — Works beautifully on mobile, tablet, and desktop
- **Dark/Light Themes** — Dark mode by default with a persistent theme toggle
- **Cloudflare Access Logout** — Administrators can end their Access session directly from the settings page
- **Privacy-First** — No personal data in source code; all secrets via environment variables

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Cloudflare Workers (TypeScript) |
| Database | Cloudflare D1 (SQLite) |
| Styling | CSS Variables, CSS Modules, organized CSS architecture |
| Deployment | Cloudflare Workers with static assets |
| Auth | Cloudflare Access |

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- Cloudflare account (for deployment)
- Wrangler CLI (`npm install -g wrangler`)

### Local Development

```bash
# Install dependencies
npm install

# Copy environment example and configure
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your values

# Create local D1 database and run migrations
npm run db:migrate:local

# Start development server
npm run dev
```

Visit `http://localhost:5173` for the archive and `http://localhost:5173/admin` for the admin interface.

### Cloudflare Setup

1. **Login to Wrangler:**
   ```bash
   npx wrangler login
   ```

2. **Create D1 Database:**
   ```bash
   npx wrangler d1 create guitar-archive
   ```

3. **Update `wrangler.jsonc`** with the returned `database_id`

4. **Run production migrations:**
   ```bash
   npm run db:migrate:prod
   ```

5. **Configure secrets in Cloudflare:**
   Use Wrangler or the Cloudflare Dashboard to configure production secrets:
   ```bash
   npx wrangler secret put CHILD_BIRTH_DATE
   # Enter date in format: YYYY-MM-DD (e.g., 2015-01-01)

   npx wrangler secret put CHILD_DISPLAY_NAME
   # Enter display name (e.g., Musician)
   ```

6. **Deploy:**
   ```bash
   npm run deploy
   ```

7. **Protect the admin surface with Cloudflare Access:**
   - Choose the **Zero Trust Free** plan.
   - Enable **One-time PIN** under **Integrations → Identity providers**.
   - Create one **Self-hosted** Access application named `Guitar Archive Admin`.
   - Add these two application paths using the same hostname:
     - `guitar-archive.guitar-progression.workers.dev/admin*`
     - `guitar-archive.guitar-progression.workers.dev/api/admin/*`
   - Add an **Allow** policy whose **Include → Emails** value is the administrator's exact email address.
   - Do not protect the entire Worker: `/` and `/api/performances*` must remain public.

### Cloudflare Access Session Behavior

After completing the email PIN challenge, the administrator remains signed in for the Access application's configured session duration. The settings page includes a **Log out** button that calls Cloudflare's `/cdn-cgi/access/logout` endpoint and returns to the public homepage. A private-browser request to an admin API without an Access cookie should receive an Access redirect or denial, never reach the mutation handler.

## Documentation

Comprehensive technical documentation is available in the [`docs/`](docs/) directory:
- [Architecture Overview](docs/architecture/overview.md)
- [Trust & Architecture Boundaries](docs/architecture/boundaries.md)
- [API Endpoints](docs/backend/api-endpoints.md)
- [Database Schema](docs/backend/database-schema.md)
- [Validation Rules](docs/backend/validation.md)
- [Component Map](docs/frontend/component-map.md)
- [Privacy & Security Model](docs/security/privacy-model.md)
- [Cloudflare Setup & Deployment](docs/deployment/cloudflare-setup.md)
- [Audit Checklist](docs/blindspot-checklist.md)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CHILD_BIRTH_DATE` | Child's birth date for age calculation | `2015-01-01` |
| `CHILD_DISPLAY_NAME` | Display name used in UI | `Musician` |

**Never commit real values.** Use `.dev.vars` locally (gitignored) and Cloudflare secrets in production.

## Project Structure

```
├── src/                    # Frontend (React + Vite)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (Home, Admin, 404)
│   ├── lib/                # Client-side utilities (API, YouTube, dates)
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Organized CSS (variables, reset, typography, layout, components, admin, responsive)
│   ├── App.tsx             # App router
│   └── main.tsx            # Entry point
├── worker/                 # Cloudflare Worker (API)
│   ├── index.ts            # Worker entry + routing
│   ├── routes/             # API route handlers
│   ├── db/                 # Database queries
│   ├── validation/         # Server-side validation
│   └── utils/              # Server utilities (age, YouTube)
├── migrations/             # D1 SQL migrations
├── tests/                  # Vitest unit tests
├── wrangler.jsonc          # Cloudflare configuration
├── .dev.vars.example       # Environment template
└── IMPLEMENTATION_PLAN.md  # Detailed implementation plan
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run oxlint |
| `npm run test` | Run unit tests |
| `npm run db:migrate:local` | Apply migrations to local D1 |
| `npm run db:migrate:prod` | Apply migrations to production D1 |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run cf-typegen` | Generate Cloudflare types |

## Adding a Performance

1. Record a guitar performance
2. Upload to YouTube as **Unlisted**
3. Copy the YouTube URL
4. Open `/admin` in your deployed app
5. Fill in:
   - Performance Date (required)
   - Song Title (required)
   - YouTube URL (required)
   - Artist, Instrument, Type, Location, Notes (optional)
6. Click **Add Performance**
7. Performance appears immediately in the archive

## YouTube URL Formats Supported

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- URLs with extra query parameters

## Privacy & Security

- **No personal data in source code** — all private values via environment variables
- **Secrets excluded from git** — `.dev.vars`, `.env*` in `.gitignore`
- **Server-side validation** — all mutations validated on Worker
- **Parameterized SQL** — no SQL injection risk
- **Cloudflare Access enforced** — `/admin*` and `/api/admin/*` are protected while the public archive remains open
- **Immediate administrator logout** — the settings page clears the Cloudflare Access session without waiting for expiration
- **No logging of sensitive data** — only performance IDs in logs

## Backup

The D1 database contains only metadata. Videos remain on YouTube.

```bash
# Export D1 database (metadata only)
npx wrangler d1 export guitar-archive --output backup.sql
```

**Important:** YouTube should NOT be your only backup. Keep original video files in personal storage.

## Production Checklist

Before deploying:

- [ ] No real birth date committed
- [ ] No real family information committed
- [ ] `.dev.vars` not committed
- [ ] No API tokens in repository
- [ ] No private YouTube URLs in repository
- [ ] D1 production database configured
- [ ] Cloudflare Access protects `/admin*`
- [ ] Cloudflare Access protects `/api/admin/*`
- [ ] One-time PIN is enabled and the Allow policy contains only approved email addresses
- [ ] The public homepage works without authentication
- [ ] The settings-page Log out button returns to the public homepage and `/admin` requires authentication again
- [ ] Production environment variables configured
- [ ] Mobile layout verified
- [ ] Delete operation tested
- [ ] Database backup procedure documented

## License

Private family project. Not for public distribution.
