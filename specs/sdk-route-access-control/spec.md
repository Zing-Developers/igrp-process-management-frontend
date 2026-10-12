# SDK Route Access Control

Status: Approved

## Objective

Use `@irn/irn-auth-sdk` middleware to enforce session validity and mapped-route
permissions for Process Management pages consistently across local, Kubernetes,
and production deployments.

## Scope

In scope: Next.js middleware, login return handling, middleware signing-key
resolution, environment documentation, and local implementation records.

Out of scope: changing System Administration APIs, route mappings, Keycloak
configuration, or generated application routes.

## Requirements

### FR-01 — Mandatory route control

Every matched page request must use `createAuthMiddleware` unconditionally.
Preview mode must not bypass authentication or authorization.

### FR-02 — Authorization behavior

The SDK must perform session-revocation checks, fetch route mappings, enforce
the matched permission using per-session permissions, and fail closed when a
protected page has no mapping or lacks permission.

### FR-03 — Public and landing routes

`/login`, `/logout`, `/forbidden`, `/auth/error`, auth/health infrastructure,
static assets, and the root landing redirect are exempt. The login flow accepts
both legacy `callbackUrl` and SDK `returnUrl` query parameters.

### FR-04 — Service endpoint selection

Use `SYSTEM_ADMIN_API_URL`, then `IRN_API_BACKOFFICE_BASE_URL`, then
`NEXT_PUBLIC_API_URL` resolved against `NEXTAUTH_URL_INTERNAL` or
`NEXTAUTH_URL`. In Kubernetes prefer `API_URL`. Append `/api/v1` only when it
is absent from an explicit service URL. The SDK endpoints are `/sessions`,
`/modules/route-mappings`, and `/auth/permissions`.

### FR-05 — JWT key contract

`JWT_PRIVATE_KEY` contains direct PEM content in local and Kubernetes
deployments. Production uses `Authentication__JwtPrivateKey` as the pathname
to the PEM file. Direct PEM takes precedence. The SDK receives key content;
legacy server token signing uses the same resolved content.

### FR-06 — Operational safety

Middleware runs in Node.js, excludes all API paths to prevent its internal
authorization calls from re-entering page authorization, and has opt-in,
redacted SDK logging only.

### FR-07 — Stable header Server Actions

The application header must keep the first `IRNHeader` handlers reference for
its mounted lifetime. It must not provide a new Server Action handlers object
after every server re-render, because `IRNHeader` responds by reloading user
data and menu actions repeatedly.

## Acceptance Criteria

- AC-01: Matched pages always invoke SDK middleware; preview mode is not a bypass.
- AC-02: Revocation, route mappings, permissions, and `denyByDefault` are configured.
- AC-03: Public, root, static, and API request behavior follows FR-03 and FR-06.
- AC-04: Both `callbackUrl` and `returnUrl` preserve post-login navigation.
- AC-05: Local and Kubernetes endpoint selection follows FR-04.
- AC-06: Direct PEM and production pathname key resolution follow FR-05.
- AC-07: No `IRN_BYPASS_ROUTE_MAPPINGS` or equivalent application bypass exists.
- AC-08: Focused checks pass; production build and controlled service scenarios have recorded evidence.
- AC-09: A server re-render does not change the header handlers reference or retrigger header Server Actions solely due to that render.
