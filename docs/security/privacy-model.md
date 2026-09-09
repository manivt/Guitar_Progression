# Privacy & Security Model

Privacy is a core design requirement of the Guitar Journey application.

## Core Privacy Principles

1. **Zero Personal Data in Repository:**
   - No real names, dates of birth, private YouTube URLs, family emails, or phone numbers in source code, commits, or documentation.
   - Generic placeholder values (e.g. `CHILD_DISPLAY_NAME="Musician"`, `CHILD_BIRTH_DATE="2015-01-01"`) are used exclusively in examples and tests.

2. **Secret Management:**
   - `.dev.vars` is gitignored and used solely for local development.
   - `.dev.vars.example` provides the template for required variables.
   - In production, runtime secrets (`CHILD_BIRTH_DATE`, `CHILD_DISPLAY_NAME`) are managed via Cloudflare Secrets or the Cloudflare Dashboard.
   - No `"vars"` block is committed inside `wrangler.jsonc` to avoid deploying test values to production.

3. **Client Isolation:**
   - The child's date of birth is **never sent to the client browser**.
   - Age is calculated server-side inside the Worker and returned only as `{ years, months }`.

4. **Access Control:**
   - Cloudflare Access protects `/admin*` and `/api/admin/*` at the network edge.
   - Only approved family/admin email addresses can authenticate to add, edit, or delete performances.

5. **Sanitized Logging:**
   - The application does not log request bodies, authorization headers, cookies, or dates of birth.
   - Server logs reference only technical status and database IDs (e.g. `performanceId=15`).
