# Security Design

## Principle
Frontend controls are not a trust boundary.

## Authentication
Use the project-approved mechanism (JWT/session/OAuth/OIDC). Do not replace architecture without approval.

## Authorization
Protected resources must verify:
1. authenticated user,
2. project access,
3. ownership/domain permission,
4. relevant workflow permission.

Prevent IDOR.

## CORS
Use explicit environment-specific allowed origins. CORS is not authorization.

## HTTPS
Production authenticated/private traffic must use HTTPS. TLS may terminate upstream.

## Rate Limiting
Evaluate for:
- authentication endpoints,
- AI generation,
- expensive audio processing,
- upload,
- export.

Numeric limits are TBD; do not invent them.

## Race Conditions
Rate limiting != race-condition protection.

Potential atomic operations include future AI-credit deduction, quotas, payment, or one-time suggestion acceptance. Prefer the simplest correct mechanism: transaction, optimistic locking, atomic update, unique constraint, idempotency key.

## Upload Security
Validate size, type, filename, storage path, and ownership. Prevent path traversal.

## AI Provider Security
- keep provider secrets backend-only,
- send only necessary data,
- never log API keys or tokens.

## Logging
Never log passwords, raw auth tokens, provider keys, or sensitive private audio.

## Errors
Do not expose stack traces, SQL, internal paths, secrets, or infrastructure details.

## Security Tests
- unauthenticated,
- wrong owner,
- modified project ID,
- forged user ID,
- invalid/oversized upload,
- duplicate request,
- excessive AI requests,
- stale project revision,
- IDOR attempts.
