# Implemented Spring Boot API Contract

This document lists all active REST API endpoints supported by the Spring Boot backend (`http://localhost:8080/api`).

## Principles
- Backend is authoritative.
- Data transfer uses request/response DTOs (`CreateProjectRequest`, `ProjectResponse`, `TrackDTO`, `ClipDTO`, `NoteEventDTO`, `AiMelodyRequest`, `AiSuggestionResponse`).
- Server-side validation with `@Valid`, `@NotBlank`, `@Min`, `@Max`.
- Headers: `X-User-Id` defaults to `"user_default"`.

## Confirmed Endpoint Specification

### 1. Projects API (`/api/projects`)
- `POST /api/projects`: Create a new project. Accepts `CreateProjectRequest` (`name`, `description`, `bpm`, `musicKey`, optional `tracks`). Returns `ProjectResponse` (201 Created).
- `GET /api/projects`: Fetch projects owned by `X-User-Id`. Returns `List<ProjectResponse>` (200 OK).
- `GET /api/projects/{id}`: Fetch project details by ID. Returns `ProjectResponse` (200 OK).
- `PUT /api/projects/{id}`: Update project metadata and full track hierarchy. Returns `ProjectResponse` (200 OK).
- `DELETE /api/projects/{id}`: Delete a project by ID (240 No Content).

### 2. Track & Clip API (`/api/projects/{projectId}/tracks`)
- `POST /api/projects/{projectId}/tracks`: Add a new track to a project. Accepts `TrackDTO`, returns `TrackDTO` (201 Created).
- `PUT /api/projects/{projectId}/tracks/{trackId}`: Update track settings. Accepts `TrackDTO`, returns `TrackDTO` (200 OK).
- `DELETE /api/projects/{projectId}/tracks/{trackId}`: Delete track by ID (204 No Content).
- `POST /api/projects/{projectId}/tracks/{trackId}/clips`: Add a new clip with note events to a track. Accepts `ClipDTO`, returns updated `TrackDTO` (201 Created).

### 3. AI Music Copilot API (`/api/projects/{projectId}/ai`)
- `POST /api/projects/{projectId}/ai/natural-language`: Generates melody from natural language prompt. Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/lyrics-to-melody`: Generates melody from lyrics using Vietnamese tone analysis. Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/harmony`: Generates 3rd interval diatonic harmony notes. Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/arrangement`: Generates chord progression & multi-instrument song structure. Returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/continue-melody`: Continues existing melodic phrase. Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/build-around-melody`: Generates supporting Bassline & Drum beat tracks. Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `GET /api/projects/{projectId}/ai/recommend-instruments`: Recommends an instrument track for the project. Returns `AiSuggestionResponse`.
- `POST /api/projects/{projectId}/ai/mood-variation`: Transforms melody mood (e.g. "sadder", "happier", "energetic"). Accepts `AiMelodyRequest`, returns `AiSuggestionResponse`.
- `PUT /api/projects/{projectId}/ai/suggestions/{suggestionId}/status?status=ACCEPTED`: Updates suggestion status (`ACCEPTED` / `REJECTED` / `PREVIEWED`) and automatically applies accepted suggestion to project entities in DB.

## Standard Error Response Format
```json
{
  "timestamp": "2026-09-22T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Project not found with id: 99",
  "path": "/api/projects/99"
}
```
