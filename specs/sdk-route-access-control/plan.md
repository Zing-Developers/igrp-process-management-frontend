# SDK Route Access Control Plan

1. Replace the legacy token-only middleware with the shared SDK configuration.
2. Centralize direct-PEM and production-file JWT key resolution for both SDK
   signing and existing Experience API token generation.
3. Preserve login callback compatibility and document the deployment contract.
4. Verify focused behavior, then record any environment-limited checks.
5. Stabilize the header Server Action handlers reference without weakening
   middleware authorization.
