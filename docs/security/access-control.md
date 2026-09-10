# Access Control & Cloudflare Access Integration

## Overview

Administrative functions (creating, updating, and deleting performances) are isolated from public readers. Instead of maintaining custom authentication logic (passwords, JWTs, cookie sessions), the application delegates authentication entirely to **Cloudflare Access** (Zero Trust).

## Protected vs Public Surface

```
Public Internet
  │
  ├── GET / (Home page archive)
  ├── GET /assets/* (Client JavaScript & CSS)
  ├── GET /api/performances (Public JSON performance list)
  └── GET /api/performances/:id (Single performance details)

Cloudflare Access Protected (Login Required)
  │
  ├── GET /admin (Admin SPA page)
  ├── POST /api/admin/performances (Create new performance)
  ├── PUT /api/admin/performances/:id (Update performance)
  └── DELETE /api/admin/performances/:id (Delete performance)
```

## Cloudflare Zero Trust Policy Configuration

1. In the Cloudflare Zero Trust dashboard, navigate to **Access > Applications**.
2. Add an application of type **Self-hosted**:
   - **Application Name:** `Guitar Journey Admin`
   - **Domain:** `your-domain.com/admin*` and `your-domain.com/api/admin/*`
3. Configure an Access Policy:
   - **Policy Action:** `Allow`
   - **Rule Type:** `Emails` or `Email domain` (e.g. parent family email addresses).
4. Select identity providers (One-time PIN via email, Google Workspace, GitHub, etc.).

## Administrator Logout

The admin page provides a **Log out** button that requests `/cdn-cgi/access/logout` without following Cloudflare's default redirect back to the protected application, then navigates to the public homepage. If the background request fails, the browser falls back to direct navigation to the logout endpoint. The URL is relative so it continues to work if the Worker hostname changes or a custom domain is added.

## Security Benefits
- **Zero Credentials in Code:** No authentication passwords or secret signing keys exist within the Worker codebase.
- **DDoS and Brute-Force Defense:** Unauthenticated requests never reach the Worker CPU; Cloudflare edge blocks them with an Access login challenge.
- **Audit Logging:** Every administrative action is logged in Cloudflare Zero Trust access audit logs.
- **Full Settings Navigation:** The public header uses a native link rather than client-side SPA navigation for `/admin`, ensuring a click produces a request that Cloudflare Access can challenge.
