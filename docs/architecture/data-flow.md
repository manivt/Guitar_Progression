# Data Flow Details

## Request/Response Flows

### 1. Initial Page Load (Archive)

```
GET / → Worker.fetch()
  → ASSETS.fetch() → index.html
  → Browser parses HTML, loads /assets/index-*.js
  → React hydrates, HomePage mounts
  → useEffect → fetch('/api/performances')
    → Worker.fetch() matches /api/performances
    → handleGetPerformances(request, env)
      → getAllPerformances(db, env.CHILD_BIRTH_DATE)
        → db.prepare('SELECT * FROM performances ORDER BY performance_date DESC').all()
        → Map each row → Performance with calculateAge(birthDate, performance_date)
      → Return Response(JSON.stringify({ performances }))
  → HomePage receives Performance[]
  → Group by year (getYear(performanceDate))
  → Render YearSection → PerformanceGrid → PerformanceCard
    → Derive https://img.youtube.com/vi/{VIDEO_ID}/hq1.jpg
    → Render YouTube's generated early-frame thumbnail
```

### 2. Video Playback

```
User clicks PerformanceCard
  → onClick → setSelectedPerformance(performance)
  → VideoModal renders (portal to body)
  → Modal iframe src = `https://www.youtube.com/embed/${videoId}?origin=${encodeURIComponent(window.location.origin)}&rel=0&modestbranding=1`
  → iframe referrer policy = `strict-origin-when-cross-origin` (sends site origin required by YouTube without exposing the full page URL)
  → YouTube player loads on-demand (not at page load)
```

### 3. Add Performance (Admin)

```
AdminPage: User fills form, clicks "Add Performance"
  → PerformanceForm.handleSubmit()
    → validateForm() — client-side check
    → fetch('/api/admin/performances', { method: 'POST', body: JSON })
      → Worker.fetch() matches /api/admin/performances
      → handleCreatePerformance(request, env)
        → await request.json()
        → validatePerformanceInput(body)
          → validateRequiredString(performanceDate) + isValidDateOnly()
          → validateRequiredString(song) + length check
          → extractYouTubeVideoId(youtubeUrl) + isValidYouTubeVideoId()
          → ... other fields
        → If invalid: return 400 { error: "message" }
        → createPerformance(db, validatedData, env.CHILD_BIRTH_DATE)
          → db.prepare(INSERT ... RETURNING *).bind(...).all()
          → Map row → Performance with age
        → Return 201 JSON(performance)
    → On success: toast.success(), setEditingId(null), loadPerformances()
    → On error: toast.error()
```

### 4. Edit Performance

```
AdminPage: User clicks "Edit" on list item
  → setEditingId(performance.id)
  → PerformanceForm receives initialData=performance
  → Form pre-populates, youtubePreview shows the generated early-frame thumbnail
  → User modifies, clicks "Save Changes"
  → PUT /api/admin/performances/:id
    → handleUpdatePerformance()
      → validatePerformanceInput()
      → updatePerformance(db, id, data, birthDate)
        → Dynamic UPDATE with only changed fields + updated_at
        → RETURNING *
      → Return 200 JSON(performance)
  → On success: toast.success(), loadPerformances()
```

### 5. Delete Performance

```
AdminPage: User clicks "Delete"
  → setDeletingId(id), setDeleteConfirmOpen(true)
  → ConfirmDialog opens
  → User clicks "Delete Performance"
    → DELETE /api/admin/performances/:id
      → handleDeletePerformance()
        → deletePerformance(db, id)
          → db.prepare('DELETE FROM performances WHERE id = ?').bind(id).run()
          → Check result.changes > 0
        → Return 200 { success: true }
    → On success: toast.success(), loadPerformances()
```

## Data Transformations

### D1 Row → Performance (with Age)

```typescript
// worker/db/performances.ts: rowToPerformance()
function rowToPerformance(row: PerformanceRow, birthDate: string): Performance {
  const age = calculateAge(birthDate, row.performance_date);
  return {
    id: row.id,
    performanceDate: row.performance_date,      // "YYYY-MM-DD"
    song: row.song,
    artist: row.artist,
    youtubeVideoId: row.youtube_video_id,       // "abc123XYZ01"
    instrument: row.instrument,
    performanceType: row.performance_type,
    location: row.location,
    notes: row.notes,
    createdAt: row.created_at,                  // ISO timestamp
    updatedAt: row.updated_at,                  // ISO timestamp
    age                                          // { years, months }
  };
}
```

### Frontend Input → Worker Validation Input

```typescript
// Admin form submits:
{
  performanceDate: "2026-09-04",
  song: "Hotel California",
  artist: "Eagles",
  youtubeUrl: "https://www.youtube.com/watch?v=abc123XYZ01",
  instrument: "Electric Guitar",
  performanceType: "Practice",
  location: "Home",
  notes: "Great session"
}

// Worker validates and extracts:
{
  performanceDate: "2026-09-04",
  song: "Hotel California",
  artist: "Eagles",
  youtubeVideoId: "abc123XYZ01",  // extracted from youtubeUrl
  instrument: "Electric Guitar",
  performanceType: "Practice",
  location: "Home",
  notes: "Great session"
}
```

## Error Flow

```
Any Worker error → console.error() with performanceId only
  → Return 500 { error: "Unable to [action] performance" }
  → Frontend catches → toast.error(message)
  → No stack traces, no PII, no SQL in response
```

## Cache Behavior

- **Static assets**: Cached by Cloudflare CDN (immutable hashes in filenames)
- **API responses**: No caching headers (dynamic data)
- **YouTube generated-frame thumbnails**: `hq1.jpg` images are derived from video IDs and cached by the browser using standard image caching
- **YouTube iframes**: Loaded from youtube.com on demand
