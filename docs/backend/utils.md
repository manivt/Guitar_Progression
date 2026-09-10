# Backend Utilities

## Overview

The backend utilities provide deterministic, pure helper functions for age calculation and YouTube URL normalization. They are shared or mirrored across the client and worker layers to ensure identical validation and formatting.

## 1. Age Calculation (`worker/utils/age.ts`)

Calculates the exact elapsed age in years and months between `CHILD_BIRTH_DATE` and the performance date:

```ts
export interface Age {
  years: number;
  months: number;
}

export function calculateAge(birthDateString: string, performanceDateString: string): Age;
export function formatAge(age: Age): string;
```

### Calculation Rules & Edge Cases
- **Calendar Boundaries:** Takes day of the month into account. If the performance day is earlier in the month than the birthday, the month count decrements and borrows 12 months/1 year.
- **Leap Years:** Safely parses February 29 dates using `parseDateOnly` without throwing or rolling into March unexpectedly.
- **Date-Only Semantics:** Constructs local dates (`new Date(year, month, day)`) instead of UTC timestamps to avoid off-by-one errors caused by client/server timezone differences.
- **Invalid Fallback:** If either input date fails regex validation or is invalid, the function returns `{ years: 0, months: 0 }`.

## 2. YouTube Normalization (`worker/utils/youtube.ts` & `src/lib/youtube.ts`)

Normalizes diverse YouTube link formats into an 11-character video ID:

```ts
export function extractYouTubeVideoId(url: string): string | null;
export function isValidYouTubeVideoId(videoId: string): boolean;
export function getEmbedUrl(videoId: string, origin?: string): string;
```

### Supported Formats
- Standard watch: `https://www.youtube.com/watch?v=abc123XYZ01`
- Without www: `https://youtube.com/watch?v=abc123XYZ01`
- Shortened link: `https://youtu.be/abc123XYZ01`
- Shorts: `https://www.youtube.com/shorts/abc123XYZ01`
- Embed: `https://www.youtube.com/embed/abc123XYZ01`
- Out-of-order query parameters: `https://www.youtube.com/watch?feature=shared&v=abc123XYZ01&t=30s`

### Parsing Strategy
1. **URL Constructor:** Attempts standard URL parsing, checking `hostname` and `searchParams.get('v')` or pathname.
2. **Regex Fallback:** If URL parsing throws on non-standard input, runs matching against `YOUTUBE_URL_PATTERNS`.
3. **Validation Guard:** All extracted strings are verified against `^[a-zA-Z0-9_-]{11}$` before being returned.

### Embed URL Construction
- `getEmbedUrl()` always starts with the standard `https://www.youtube.com/embed/{VIDEO_ID}` URL.
- The optional `origin` value is added with `URL.searchParams`, which safely encodes the scheme and host.
- `VideoModal` supplies `window.location.origin` at runtime so Workers preview, `workers.dev`, and future custom-domain deployments identify themselves without hardcoded hostnames.
