# Database Schema & D1 Persistence

The application uses Cloudflare D1 (managed serverless SQLite) for storing performance metadata.

## Table: `performances`

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

### Column Specifications

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique row identifier |
| `performance_date` | TEXT | NOT NULL | Calendar date in `YYYY-MM-DD` format |
| `song` | TEXT | NOT NULL | Title of the piece/song (max 200 chars) |
| `artist` | TEXT | NULLABLE | Original artist/composer (max 200 chars) |
| `youtube_video_id` | TEXT | NOT NULL | Normalized 11-character YouTube ID |
| `instrument` | TEXT | NULLABLE | Instrument played (e.g. Electric Guitar) |
| `performance_type` | TEXT | NULLABLE | Categorization enum |
| `location` | TEXT | NULLABLE | Venue or recording location |
| `notes` | TEXT | NULLABLE | Markdown or text notes (max 5000 chars) |
| `created_at` | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | ISO 8601 creation timestamp |
| `updated_at` | TEXT | NOT NULL DEFAULT CURRENT_TIMESTAMP | ISO 8601 last update timestamp |

### Supported Performance Types
- `Practice`
- `Lesson`
- `Recital`
- `Concert`
- `School Performance`
- `Recording`
- `Other`

## Important Architectural Notes
- **Age is not stored in the database:** The child's age is derived dynamically in memory when records are read, combining `CHILD_BIRTH_DATE` and `performance_date`.
- **Thumbnails are not stored:** Only the 11-character YouTube video ID is retained. The client derives the high-quality generated early-frame URL (`https://img.youtube.com/vi/{VIDEO_ID}/hq1.jpg`) for archive cards and form previews.
- **Query Optimization:** An index on `performance_date DESC` guarantees fast, chronological scans without sorting overhead.
