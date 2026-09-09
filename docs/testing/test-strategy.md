# Testing Strategy & Quality Assurance

## Overview

The test architecture focuses on high-speed, deterministic verification of core business logic, validation boundaries, and edge cases. Testing is powered by **Vitest**, leveraging native ESM execution and parallel test running.

## Test Pyramid

```
       / \
      /   \
     / E2E \       Manual Verification (Cloudflare staging)
    /-------\
   / Integr. \     API Route / D1 integration testing
  /-----------\
 /  Unit Tests \   Vitest unit suites (YouTube parsing, Age math, Input validation)
/---------------\
```

## Running Tests

```bash
# Run entire test suite once (CI / pre-commit)
npm run test

# Run tests in watch mode during development
npm run test:watch
```

## Coverage Goals & Scope
- **Date & Age Arithmetic:** 100% test coverage of edge cases (leap years, month rollovers, same month different days, leap day birthdays).
- **YouTube URL Parsing:** Full coverage of all known valid and malformed link permutations.
- **Server Input Validation:** Complete validation tests for required fields, max length bounds, and sanitization.
