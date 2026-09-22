# Security Design

## Principle
Frontend controls are not a trust boundary. Backend is authoritative.

## Authentication & Authorization
Default header `X-User-Id` verified for project resource access and track ownership.

## CORS Configuration
`CorsConfig.java` defines explicit origin patterns, allowed methods (`GET`, `POST`, `PUT`, `DELETE`), and exposed headers (`*`).

## Security Validation
Server-side bean validation (`@Valid`, `@NotBlank`, `@Min`, `@Max`) enforces data integrity on all endpoints.
