# Input Validation Rules

All performance data submitted via the API is validated strictly server-side inside `worker/validation/performance.ts`.

## Validation Rules

| Field | Required | Type | Constraints |
|---|---|---|---|
| `performanceDate` | Yes | String | Must match `^\d{4}-\d{2}-\d{2}$` and represent a valid calendar date |
| `song` | Yes | String | Non-empty after trimming, maximum 200 characters |
| `youtubeUrl` | Yes | String | Must contain an 11-character YouTube video ID matching supported patterns |
| `artist` | No | String | Maximum 200 characters when provided |
| `instrument` | No | String | Maximum 100 characters when provided |
| `performanceType` | No | Enum | Must be one of `PERFORMANCE_TYPES` when provided |
| `location` | No | String | Maximum 200 characters when provided |
| `notes` | No | String | Maximum 5000 characters when provided |

## Supported YouTube Formats

The parser in `worker/utils/youtube.ts` supports:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- URLs with query parameters in arbitrary order (e.g. `?feature=shared&v=VIDEO_ID` or `?v=VIDEO_ID&t=30s`)
- Raw 11-character video IDs

## Sanitization
- All string values are automatically trimmed of leading and trailing whitespace.
- Empty optional strings are normalized to `null` before saving into the database.
- HTML tags, scripts, and iframe snippets are rejected or stripped.
