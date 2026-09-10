# Frontend State Management

## Overview

The application adopts a lightweight, resilient state architecture utilizing React 19 primitives (`useState`, `useEffect`, `useCallback`, `useContext`, and `useRef`). By avoiding heavy external state libraries (Redux, Zustand), the client bundle remains minimal (~250 kB uncompressed, ~79 kB gzipped) while maintaining full reactivity and accessibility.

## Component State Breakdown

### 1. HomePage (`src/pages/HomePage.tsx`)
- **`performances` (`Performance[]`):** Stored list of performances fetched on mount.
- **`loading` (`boolean`):** Indicates pending network requests during initial load.
- **`selectedPerformance` (`Performance | null`):** Currently active performance displayed in `VideoModal`.
- **`error` (`string | null`):** Holds network or parsing failure messages, styled via `.empty-state-error`.
- **Derived State (`performancesByYear`):**
  Uses `getYear(performance.performanceDate)` to group records chronologically by year without mutating raw state:
  ```ts
  const performancesByYear = performances.reduce((acc, performance) => {
    const year = getYear(performance.performanceDate);
    if (!acc[year]) acc[year] = [];
    acc[year].push(performance);
    return acc;
  }, {} as Record<number, Performance[]>);
  ```

### 2. AdminPage (`src/pages/AdminPage.tsx`)
- **`performances` (`Performance[]`):** List of all records retrieved from `/api/performances`.
- **`editingId` (`number | null`):** Tracks the ID of the performance currently being edited in `PerformanceForm`.
- **`deletingId` (`number | null`):** Tracks the ID slated for deletion in `ConfirmDialog`.
- **`deleteConfirmOpen` (`boolean`):** Modal state for confirmation before executing `deletePerformance()`.

### 3. PerformanceForm (`src/components/PerformanceForm.tsx`)
- **`formData` (`PerformanceFormData`):**
  Local form fields (`performanceDate`, `song`, `artist`, `youtubeUrl`, `instrument`, `performanceType`, `location`, `notes`).
- **`youtubePreview` (`string | null`):** Validated 11-character YouTube video ID extracted on change.
- **`youtubeError` (`string | null`):** Real-time feedback for invalid YouTube URLs.
- **`errors` (`Record<string, string>`):** Field-level validation errors displayed beneath inputs.
- **`saving` (`boolean`):** Disables inputs and action buttons during asynchronous submission.

### 4. VideoModal (`src/components/VideoModal.tsx`)
- **Focus Restoration (`previousActiveElement`):**
  A `useRef<HTMLElement | null>` captures the element that triggered modal open. Upon close, focus is returned to that element to preserve screen-reader position.
- **Focus Trapping:**
  A `keydown` listener intercepts `Tab` and `Shift+Tab` cycles, locking focus within modal elements (`close` button, iframe, external watch link).
- **Body Scroll Locking:**
  Toggles `document.body.style.overflow = 'hidden'` when open and cleans up on unmount.
- **YouTube Embed Identity:**
  Builds the embed URL at render time with `window.location.origin` and uses `strict-origin-when-cross-origin` on the iframe. This supplies the HTTP Referer/origin identification required by YouTube while keeping deployment hostnames out of source code.

### 5. Toast Notification System (`src/components/Toast.tsx`)
- **`ToastContext`:**
  Provides global `success(message)` and `error(message)` triggers throughout the tree.
- **Auto-dismiss:**
  Each toast receives a timestamp ID and is automatically purged after 3000ms.

## Key Invariants & Safeguards
1. **No Stale Closures in Effects:** Functions passed to effects (`validateYouTubeUrl`) are memoized via `useCallback`.
2. **Error Boundary Compatibility:** All async operations are wrapped in `try/catch` with fallback error messages.
3. **Optimistic Rendering Avoidance:** State mutations (create, edit, delete) re-fetch from the database to guarantee consistency with server-computed ages.
