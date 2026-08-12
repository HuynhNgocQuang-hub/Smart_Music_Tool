# API Security Skill

## Trust Boundary
Frontend is not trusted for security decisions. Backend/trusted infrastructure enforces authentication, authorization, ownership, validation, rate limits, and critical workflow rules.

## Identity
Never trust client-provided `userId`, `role`, `ownerId`, or `isAdmin` as proof of identity.

## Authorization
Check role/permission where relevant AND resource ownership/domain permission. Prevent IDOR.

## CORS
Use explicit environment-specific origins. CORS is not authorization.

## HTTPS
Authenticated/private production traffic must use HTTPS. Do not duplicate TLS config if terminated upstream.

## Rate Limiting
Evaluate auth, AI generation, upload, export, expensive processing. Do not invent numeric limits. Return 429 when appropriate.

## Concurrency
Race-condition protection is different from rate limiting. Consider transactions, optimistic locking, atomic updates, unique constraints, idempotency. Distributed locks only when justified.

## CSRF
Do not disable blindly. Threat model depends on cookie vs bearer-token authentication.

## Upload
Validate size/type/filename/storage/ownership. Prevent path traversal.

## Secrets
Never log tokens or commit provider keys. Keep AI provider credentials backend-only.

## Errors
Do not leak stack traces, SQL, server paths, secrets, or provider internals.

## Tests
Test unauthenticated, wrong owner, invalid token, changed resource ID, duplicate request, invalid/oversized upload, and rate abuse where applicable.
