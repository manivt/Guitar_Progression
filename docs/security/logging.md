# Privacy-Preserving Logging Practices

## Objectives

Logs generated in Cloudflare Workers and client telemetry must never capture sensitive personal information, family details, or private URLs.

## Logging Guidelines

### 1. Zero Personal Identifying Information (PII)
- Do NOT log performer names or family notes.
- Do NOT log unlisted YouTube video titles or raw URLs.
- Do NOT log `CHILD_BIRTH_DATE` or calculated birthdays.

### 2. Identifier-Only Logging
When tracing errors during performance mutations, log only the integer database ID:
```ts
// Permitted:
console.error('Error updating performance:', error);

// Prohibited:
console.log(`Saved song ${body.song} for child ${env.CHILD_DISPLAY_NAME}`);
```

### 3. Masked Error Responses
Client error responses must return user-friendly, generalized messages:
```json
{ "error": "Unable to fetch performances" }
```
Internal stack traces or database driver diagnostics are never transmitted to the browser.
