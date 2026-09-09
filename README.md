# Guitar Journey — Family Guitar Video Archive

A polished, production-ready web application for maintaining a chronological archive of guitar performances. Built for family use with privacy as a core requirement.

## Features

- **Chronological Archive** — Performances displayed in reverse chronological order, grouped by year
- **YouTube Integration** — Videos hosted on YouTube (Unlisted), only metadata stored in Cloudflare D1
- **Admin Interface** — Add, edit, and delete performances at `/admin` (protected by Cloudflare Access)
- **Video Playback** — Click thumbnails to watch in a polished modal
- **Age Calculation** — Automatically calculates child's age at each performance
- **Responsive Design** — Works beautifully on mobile, tablet, and desktop
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

5. **Configure secrets in Cloudflare Dashboard:**
   - `CHILD_BIRTH_DATE` (format: YYYY-MM-DD)
   - `CHILD_DISPLAY_NAME` (e.g., "Musician")

6. **Deploy:**
   ```bash
   npm run deploy
   ```

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
- **Cloudflare Access compatible** — protect `/admin*` and `/api/admin/*` routes
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
- [ ] Production environment variables configured
- [ ] Mobile layout verified
- [ ] Delete operation tested
- [ ] Database backup procedure documented

## License

Private family project. Not for public distribution.