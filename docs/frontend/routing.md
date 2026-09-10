# Frontend Routing & SPA Navigation

## Overview

The client-side routing is handled by **React Router v7** (`react-router-dom`), configured in `src/App.tsx`. All routes are hosted under a single-page application (SPA) architecture served via Cloudflare Workers and static assets.

## Route Map

| Path | Component | Description | Access Protection |
|------|-----------|-------------|-------------------|
| `/` | `HomePage` | Public archive view displaying chronological performances grouped by year | Public |
| `/admin` | `AdminPage` | Administrative dashboard for creating, editing, and deleting records | Protected (Cloudflare Access) |
| `*` | `NotFoundPage` | 404 page for unmatched URLs with navigation link back to archive | Public |

## Application Structure (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@pages/HomePage';
import { AdminPage } from '@pages/AdminPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ToastProvider } from '@components/Toast';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
```

## Client-Side Navigation Rules

1. **SPA Links (`Link`):**
   Ordinary public navigation, such as the `NotFoundPage` link back to `/`, may use React Router's `<Link to="...">` component.
2. **Security-boundary navigation (`<a>`):**
   The settings link uses a native `<a href="/admin">` so every visit makes a document request that Cloudflare Access can challenge. Cloudflare logout is also a full Access request before the browser returns to `/`.
3. **External Links (`<a>`):**
   External navigation (such as "Open on YouTube" links in `VideoModal`) uses standard `<a target="_blank" rel="noopener noreferrer">` tags.

## Cloudflare Worker Route Integration

When a user requests any client route directly (e.g., refreshing `/admin`), Cloudflare Worker handles the request in `worker/index.ts`:
- Unmatched non-API paths fall through to `env.ASSETS.fetch(request)`.
- Cloudflare static assets configuration maps unknown routes back to `/index.html` (SPA fallback), allowing React Router to mount and render the corresponding route.
- Cloudflare Access intercepts `/admin*` before the request reaches the client, ensuring unauthorized users cannot access the administration interface.
