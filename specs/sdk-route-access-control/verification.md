# SDK Route Access Control Verification

Status: BLOCKED — production-build verification requires a compatible Node runtime

| Acceptance criterion | Status | Evidence |
| --- | --- | --- |
| AC-01 | PASS | `src/middleware.ts` unconditionally creates and invokes SDK middleware; preview mode is not consulted. |
| AC-02 | PASS | Revocation, route mappings, user permissions, and `denyByDefault: true` are configured. |
| AC-03 | PASS | Root/public handling and API matcher exclusion prevent middleware self-interception. |
| AC-04 | PASS | Login accepts legacy `callbackUrl` and SDK `returnUrl`. |
| AC-05 | PASS | Local and Kubernetes service endpoint selection is implemented and documented. |
| AC-06 | PASS | Focused assertions verified direct PEM precedence, pathname key resolution, newline normalization, and SDK-key hydration. |
| AC-07 | PASS | Static search found no route-mapping bypass. |
| AC-08 | BLOCKED | Type check, Biome check, resolver assertions, and diff validation pass. `next build` cannot run on Node 18.10.0; Next requires at least Node 18.18. |
| AC-09 | PASS | `StableIRNHeader` stores the initial `handlers` in `useRef`; `Header` renders that wrapper rather than `IRNHeader` directly. Focused TypeScript and Biome checks pass. |

## Checks and Evidence

- PASS: `./node_modules/.bin/tsc --noEmit --tsBuildInfoFile /tmp/igrp-process-management-tsconfig.tsbuildinfo`
- PASS: Biome check of middleware, resolver, legacy token handler, and login page
- PASS: compiled resolver assertions for direct PEM and production pathname inputs
- PASS: static no-bypass search and whitespace validation
- PASS: header loop safeguard: focused TypeScript and Biome checks confirm the stable `useRef` wrapper is used
- BLOCKED: `./node_modules/.bin/next build` due to local Node 18.10.0
- NOT VERIFIED: controlled authorization-service scenarios; no target service harness is available in this workspace

## Convergence

The implementation, specification, plan, and task list agree. The header Server Action re-render loop is fixed without changing middleware authorization. Use a supported Node runtime for the production build, then run controlled authenticated, revoked, unmapped, permitted, and forbidden route scenarios against System Administration.
