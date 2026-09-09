# Unit Test Suites

## Overview

The repository includes 71 unit tests distributed across three test files under `tests/`. All tests run using Vitest.

## Test Suites

### 1. Age Calculation (`tests/age.test.ts` — 20 Tests)
Tests `calculateAge()` and `formatAge()` across critical calendar boundaries:
- Passed birthdays vs upcoming birthdays in current calendar year.
- Exact birthday tests (0 months).
- Day-before and day-after birthday edge cases.
- Year-end and month-end rollovers (e.g., Dec 31 to Jan 1).
- Leap year birthdays (`2016-02-29`) evaluated on Feb 28, Feb 29 (in leap year), and Mar 1 (in non-leap year).
- Invalid string date fallbacks (`{ years: 0, months: 0 }`).
- Singular vs plural formatting (`1 year`, `2 years`, `1 month`, `6 months`).

### 2. YouTube Parsing (`tests/youtube.test.ts` — 22 Tests)
Tests `extractYouTubeVideoId()`, `isValidYouTubeVideoId()`, `getThumbnailUrl()`, `getEmbedUrl()`, and `getWatchUrl()`:
- Standard `youtube.com/watch?v=ID` with and without `www`.
- Shortened `youtu.be/ID`.
- Shorts `youtube.com/shorts/ID`.
- Embeds `youtube.com/embed/ID`.
- Arbitrary query parameter permutations (e.g. `?feature=shared&v=ID&t=30s`).
- Rejection of invalid links, empty strings, malformed IDs (< 11 or > 11 chars), and foreign domains.
- Thumbnail quality selectors (`maxres`, `hq`, `mq`, `default`).

### 3. Server-Side Validation (`tests/validation.test.ts` — 29 Tests)
Tests `validatePerformanceInput()` and `validatePerformanceUpdateInput()`:
- Valid payload parsing and return types.
- Required field enforcement (`performanceDate`, `song`, `youtubeUrl`).
- Date format enforcement (`YYYY-MM-DD`) and rejection of non-existent calendar dates (e.g. `2026-02-30`, `2026-13-01`).
- Length limits (`song` max 200, `artist` max 200, `instrument` max 100, `location` max 200, `notes` max 5000).
- Whitelisted enum validation (`performanceType`).
- Automatic whitespace trimming on string inputs.
- Partial-update semantics (single-field and empty updates accepted, absent optional fields left unchanged, provided fields still validated).

