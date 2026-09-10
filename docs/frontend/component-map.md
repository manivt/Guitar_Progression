# Frontend Component Map

The React 19 single-page application is structured as follows:

## Component Hierarchy

```
App (with ToastProvider & BrowserRouter)
├── Routes
│   ├── Route "/" -> HomePage
│   │   ├── Header
│   │   │   └── Link to="/admin"
│   │   ├── Hero Section
│   │   ├── YearSection (grouped by calendar year)
│   │   │   └── PerformanceGrid
│   │   │       └── PerformanceCard (Article with native Button)
│   │   │           └── Thumbnail with play icon
│   │   └── VideoModal (accessible modal with focus trap & Escape key)
│   │
│   ├── Route "/admin" -> AdminPage
│   │   ├── Header (with Link to="/")
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
