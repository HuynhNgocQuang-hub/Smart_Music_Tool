# Spring Boot Backend Skill

## Scope
Use when modifying the Java Spring Boot backend.

## Architecture
Follow current project conventions first. Typical responsibility:
```text
Controller → Service → Repository → Database
```
Controllers handle HTTP. Services own business rules/orchestration. Repositories own persistence. DTOs define API contracts.

## Before Coding
Inspect neighboring controllers/services, DTOs, exception handling, security context, JPA mappings, enums/statuses, migrations, tests, and callers.

## Controller Rules
- validate requests,
- resolve authenticated context,
- call services,
- return API responses.

Do not access repositories directly or trust request `userId` for identity.

## Service Rules
- enforce business rules,
- check ownership/permission,
- coordinate repositories,
- define transaction boundaries,
- manage state transitions.

Do not return `ResponseEntity` from services.

## Repository Rules
Keep business workflow out of repositories. Prefer DB filtering over loading entire tables into memory.

## DTO Rules
Use intent names such as `CreateProjectRequest`, `ProjectResponse`, `AISuggestionResponse`. Do not expose JPA entities directly.

## Validation
Bean Validation for request shape; service/domain validation for business rules.

## Transactions
Use `@Transactional` deliberately for atomic business actions. Do not annotate everything blindly.

## JPA
Be deliberate with cascade, orphan removal, fetch type, relationship ownership, indexes, and constraints. Never add `CascadeType.ALL` automatically.

## Dependency Injection
Prefer constructor injection.

## Exceptions
Use centralized exception handling. Do not leak stack traces/SQL.

## API Compatibility
Inspect frontend/callers before changing contracts.

## Performance
Check N+1, repository calls in loops, unbounded queries, unnecessary eager fetch.

## Refactoring
Keep changes scoped. No unrelated package/class reorganizations during feature fixes.

## Build
Use repository Maven wrapper/commands when available. Never claim success unless executed.

## Definition of Done
- requirement ID known,
- architecture respected,
- no invented enum/status/role,
- validation and authorization correct,
- transaction behavior correct,
- sensitive data not exposed,
- tests/build run or marked NOT RUN.
