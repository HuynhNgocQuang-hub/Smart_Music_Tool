# API Contract Guidelines

Exact endpoints must follow the actual backend structure and approved requirements.

## Principles
- Backend is authoritative.
- Use request/response DTOs.
- Do not expose JPA entities directly.
- Validate untrusted input.
- Enforce ownership server-side.
- Use consistent errors.

## Candidate Resource Groups
```text
/auth
/projects
/projects/{projectId}/tracks
/projects/{projectId}/clips
/projects/{projectId}/ai
/instruments
/recordings
/exports
```
These are candidates, not approved endpoint paths.

## AI Pattern
Preferred concept:
```text
Frontend
→ Backend validates identity/project access
→ AI request created
→ AI processing
→ Preview result
→ Explicit user accept action
→ Apply accepted result
```
The AI provider must not directly mutate authoritative project data.

## Recording Upload Concerns
- authentication/project access,
- file size/type,
- safe filename handling,
- private storage,
- processing failure.

## Error Response
Use project-wide format. Concept example:
```json
{
  "code": "PROJECT_NOT_FOUND",
  "message": "Project was not found."
}
```
Exact fields follow existing code.

## HTTP Semantics
Typical:
- 200/201 success
- 400 invalid input
- 401 unauthenticated
- 403 forbidden
- 404 not found
- 409 state/concurrency conflict
- 413 too large
- 429 rate limited
- 5xx server/provider failure
