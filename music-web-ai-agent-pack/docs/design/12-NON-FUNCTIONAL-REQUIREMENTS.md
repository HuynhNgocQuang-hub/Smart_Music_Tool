# Non-Functional Requirements

Numeric thresholds are TBD unless explicitly confirmed.

## NFR-001 — Responsiveness
**Status:** CONFIRMED intent

Common editing/playback interactions should feel responsive. Avoid unnecessary server round trips for real-time controls.

## NFR-002 — Low-Latency Playback
**Status:** PROPOSED

Virtual-instrument interaction should run client-side where practical.

## NFR-003 — Reliability
**Status:** CONFIRMED intent

AI failures must not corrupt or erase a user's music project.

## NFR-004 — Recoverability
**Status:** PROPOSED

User-created work should be recoverable from accidental AI replacement/common editing mistakes where practical.

## NFR-005 — Security
**Status:** CONFIRMED intent

Private projects, recordings, and account data require authentication/authorization.

## NFR-006 — Scalability
**Status:** PROPOSED

Long-running AI/audio processing should be separable from the main synchronous request path.

## NFR-007 — Maintainability
**Status:** CONFIRMED

Backend follows agreed Spring Boot architecture and conventions.

## NFR-008 — Browser Compatibility
**Status:** PROPOSED

Define supported desktop browsers for Web Audio, microphone, and optional Web MIDI.

## NFR-009 — Accessibility
**Status:** PROPOSED

Primary controls should be keyboard-navigable where practical and not rely only on icons.

## NFR-010 — Performance Budgets
**Status:** TBD

Do not invent numeric SLAs until deployment/usage expectations are known.
