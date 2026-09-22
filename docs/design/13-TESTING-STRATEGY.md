# Testing Strategy

## Backend Integration & Unit Tests
- `mvn test` in `backend/` directory.
- Tests Controller, Service, and Repository layers using H2 in-memory database.

## End-to-End Verification
- Full REST API CRUD tests (`/api/projects`, `/api/projects/{id}/tracks`, `/api/projects/{id}/ai`).
- Browser DAW timeline playback, pitch recording, WAV exporter rendering, and AI suggestion accept/reject lifecycle.
