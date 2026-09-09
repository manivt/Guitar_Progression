# Database Migrations

## Overview

Database migrations manage schema versioning for Cloudflare D1. Migrations reside in the `migrations/` directory and execute sequentially using Wrangler's native migration system.

## Migration Structure

```
migrations/
└── 0001_initial.sql
```

### Initial Schema (`0001_initial.sql`)
Creates the `performances` table and primary reverse-chronological index:

```sql
CREATE TABLE performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    performance_date TEXT NOT NULL,
    song TEXT NOT NULL,
    artist TEXT,
    youtube_video_id TEXT NOT NULL,
    instrument TEXT,
    performance_type TEXT,
    location TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performances_date ON performances(performance_date DESC);
```

## Running Migrations

### Local Environment
```bash
npm run db:migrate:local
# Equivalent to: npx wrangler d1 migrations apply guitar-archive --local
```

### Production Environment
```bash
npm run db:migrate:prod
# Equivalent to: npx wrangler d1 migrations apply guitar-archive
```

## Creating New Migrations
When adding new fields or indexes:
```bash
npx wrangler d1 migrations create guitar-archive add_new_field
```
This generates a timestamped SQL file in `migrations/`. Always commit migration files to version control.
