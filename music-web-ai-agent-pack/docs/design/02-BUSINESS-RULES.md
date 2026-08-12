# Business Rules

## BR-AI-001 — Approval Before Destructive AI Change
**Status:** CONFIRMED

Material AI changes to user-created content follow:
```text
Generate → Preview → User Accept/Reject → Apply only after acceptance
```

## BR-AI-002 — Preserve Original Work
**Status:** CONFIRMED

When AI creates a derived version of a recording, melody, or musical section, the original remains recoverable unless the user explicitly deletes it.

## BR-AI-003 — AI Is Assistive
**Status:** CONFIRMED

AI is a Music Copilot, not the sole creative actor.

## BR-AI-004 — Do Not Invent Preference
**Status:** PROPOSED

Preference should come from observed feedback/context, not arbitrary permanent labels.

## BR-AI-005 — Similar Does Not Mean Copy
**Status:** PROPOSED

"Generate similar" should target mood/timbre/rhythm/structure rather than intentionally copying protected melodies from external works.

## BR-PROJECT-001 — Project Ownership
**Status:** PROPOSED

Only the owner or explicitly authorized collaborator may modify a private project.

## BR-SEC-001 — Backend Authority
**Status:** CONFIRMED

Authentication, authorization, ownership, validation, rate limiting, and critical business rules must be enforced by backend/trusted infrastructure.

## BR-SEC-002 — Trusted Identity
**Status:** CONFIRMED

Client-provided `userId`, `role`, or ownership claims are not proof of identity.

## BR-MUSIC-001 — Beginner Accessibility
**Status:** CONFIRMED

A user must be able to begin creating music without first understanding formal music theory.

## BR-MUSIC-002 — Optional Technical Detail
**Status:** PROPOSED

Beginner mode should avoid forcing concepts such as chord notation, scale degrees, quantization, or synthesis parameters when simpler controls are possible.

## BR-CONCURRENCY-001 — One-Time Side Effects
**Status:** PROPOSED

If AI credits, quotas, payment, or other one-time side effects are introduced, duplicate/concurrent requests must be handled atomically.

## BR-RECORD-001 — Recording Permission
**Status:** PROPOSED

Recording must not begin before browser permission is granted.

## BR-RECORD-002 — Private Recording Access
**Status:** PROPOSED

Private recordings must not be accessible to unauthorized users through predictable URLs or IDs.

## BR-DATA-001 — Content Provenance
**Status:** PROPOSED

The domain may track provenance such as USER_CREATED, AI_GENERATED, AI_ASSISTED. Do not add persisted enums until the data model is explicitly approved.
