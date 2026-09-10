# Frontend Component Map

The React 19 single-page application is structured as follows:

## Component Hierarchy

```
App (with ToastProvider & BrowserRouter)
├── Routes
│   ├── Route "/" -> HomePage
│   │   ├── Header
│   │   │   ├── ThemeToggle
│   │   │   └── Settings link to="/admin" (full navigation for Cloudflare Access)
│   │   ├── YearSection (grouped by calendar year)
│   │   │   └── PerformanceGrid
│   │   │       └── PerformanceCard (Article with native Button)
│   │   │           └── Thumbnail with play icon
│   │   └── VideoModal (accessible modal with focus trap & Escape key)
│   │
│   ├── Route "/admin" -> AdminPage
│   │   ├── Header (shared layout, with archive link)
│   │   ├── Cloudflare Access logout link
│   │   ├── PerformanceForm (Add / Edit form with instant YouTube preview)
│   │   ├── Existing Performances List
│   │   │   ├── Edit button
│   │   │   └── Delete button
│   │   └── ConfirmDialog (modal dialog for destructive action confirmation)
│   │
│   └── Route "*" -> NotFoundPage (404 display with navigation home)
└── ToastContainer (portal for notifications)
```

## Key Components

### `Header`
- Keeps the title and compact action icons in one row on desktop and mobile.
- Displays the shared “The Journey” title; the archive subtitle identifies Nathaniel's musical performances, while the admin route uses its management subtitle.
- Provides an accessible theme toggle and contextual settings or archive link with labels and native tooltips.
- Uses the same full-width structure, title alignment, and responsive gutters on the archive and admin pages.
- Uses a normal document navigation for `/admin`, ensuring Cloudflare Access can intercept the request before the admin UI loads.

### Admin Access Logout
- The admin toolbar requests the relative Cloudflare Access endpoint `/cdn-cgi/access/logout` without following its default login redirect, then returns the browser to the public homepage.
- If that background request is unavailable, it falls back to direct navigation to Cloudflare's logout endpoint so ending the session takes priority.

### `ThemeToggle`
- Defaults to dark mode for first-time visitors.
- Persists an explicit light or dark choice in `localStorage`.

### `PerformanceCard`
- Uses an `<article>` container wrapping a semantic `<button className="card-button">`.
- Renders responsive `srcset` thumbnails (`maxres`, `hq`, `mq`).
- Formats dates using `formatDisplayDate` in local time to avoid UTC day-shift bugs.

### `VideoModal`
- Traps keyboard focus (`Tab` / `Shift+Tab`) within the modal dialog.
- Dismisses upon `Escape` key press or clicking the background backdrop.
- Restores focus to the previously active element upon closing.
- Loads the YouTube iframe player on demand.
- Uses the standard `https://www.youtube.com/embed/{VIDEO_ID}` player URL and adds the current `window.location.origin` as the encoded `origin` parameter.
- Sets the iframe `referrerPolicy` to `strict-origin-when-cross-origin`, allowing YouTube to identify the embedding site without receiving the full page path.
- Preserves fullscreen playback and the explicit iframe permission allowlist.

### `PerformanceForm`
- Validates YouTube URLs client-side without network calls.
- Shows live thumbnail preview upon entering a valid URL.
- Handles both creation and updates seamlessly.
