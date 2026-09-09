# Backend API Specification

This document details all API routes served by the Cloudflare Worker.

## Overview

The API follows REST conventions and is divided cleanly into public read endpoints and protected admin mutation endpoints. All responses use JSON and standard HTTP status codes.

| Method | Path | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/performances` | Public | Returns all performances in reverse chronological order |
| `GET` | `/api/performances/:id` | Public | Returns a single performance by ID |
| `POST` | `/api/admin/performances` | Protected | Creates a new performance record |
| `PUT` | `/api/admin/performances/:id` | Protected | Updates an existing performance record |
| `DELETE` | `/api/admin/performances/:id` | Protected | Deletes a performance record |

---

## Public Endpoints

### 1. `GET /api/performances`

Returns the full list of performances ordered by `performance_date DESC`.

**Response (200 OK):**
```json
{
  "performances": [
    {
      "id": 1,
      "performanceDate": "2026-09-04",
      "song": "Hotel California",
      "artist": "Eagles",
      "youtubeVideoId": "abc123XYZ01",
      "instrument": "Electric Guitar",
      "performanceType": "Practice",
      "location": "Home Studio",
      "notes": "First take with guitar solo",
      "createdAt": "2026-09-04T12:00:00Z",
      "updatedAt": "2026-09-04T12:00:00Z",
      "age": {
        "years": 11,
        "months": 8
      }
    }
  ]
}
```

---

### 2. `GET /api/performances/:id`

Returns a single performance by numeric ID.

**Responses:**
- `200 OK`: Returns the performance object.
- `400 Bad Request`: `{"error": "Invalid performance ID"}` (when ID is not numeric).
- `404 Not Found`: `{"error": "Performance not found"}`.

---

## Admin Endpoints (Protected by Cloudflare Access)

### 3. `POST /api/admin/performances`

Creates a new performance. The YouTube URL is parsed and normalized server-side to an 11-character video ID before persistence.

**Request Body:**
```json
{
  "performanceDate": "2026-09-04",
  "song": "Hotel California",
  "artist": "Eagles",
  "youtubeUrl": "https://www.youtube.com/watch?v=abc123XYZ01",
  "instrument": "Electric Guitar",
  "performanceType": "Practice",
  "location": "Home",
  "notes": "Great practice session"
}
```

**Responses:**
- `201 Created`: Returns the newly created performance object with derived age.
- `400 Bad Request`: Validation failure or invalid JSON (e.g. `{"error": "Invalid YouTube URL"}`).
- `500 Internal Server Error`: `{"error": "Unable to create performance"}`.

---

### 4. `PUT /api/admin/performances/:id`

Updates an existing performance. Preserves `created_at` and automatically updates `updated_at`.

**Request Body (Partial or Full):**
```json
{
  "song": "Hotel California (Acoustic)",
  "notes": "Updated notes"
}
```

**Responses:**
- `200 OK`: Returns the updated performance object.
- `400 Bad Request`: Invalid ID or invalid field values.
- `404 Not Found`: `{"error": "Performance not found"}`.
- `500 Internal Server Error`: `{"error": "Unable to update performance"}`.

---

### 5. `DELETE /api/admin/performances/:id`

Permanently deletes a performance from D1.

**Responses:**
- `200 OK`: `{"success": true}`.
- `400 Bad Request`: `{"error": "Invalid performance ID"}`.
- `404 Not Found`: `{"error": "Performance not found"}`.
- `500 Internal Server Error`: `{"error": "Unable to delete performance"}`.

---

## Error Handling & Fallback Behavior

- Any request to `/api/*` that does not match a valid route or method returns `404 Not Found` with:
  ```json
  {
    "error": "Endpoint or method not found"
  }
  ```
- Non-API requests (e.g. `/`, `/admin`, `/favicon.svg`) fall through to `env.ASSETS.fetch(request)` to serve static client assets.
