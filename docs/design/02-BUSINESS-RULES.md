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
**Status:** CONFIRMED

Preference comes from observed feedback/context (Accept/Reject, Chat Prompts).

## BR-AI-005 — Similar Does Not Mean Copy
**Status:** CONFIRMED

"Generate similar" targets mood/timbre/rhythm/structure rather than intentionally copying protected melodies from external works.

## BR-PROJECT-001 — Project Ownership
**Status:** CONFIRMED

Only the owner or explicitly authorized collaborator may modify a private project.

## BR-SEC-001 — Backend Authority
**Status:** CONFIRMED

Authentication, authorization, ownership, validation, rate limiting, and critical business rules must be enforced by backend/trusted infrastructure.

## BR-SEC-002 — Trusted Identity
**Status:** CONFIRMED

Client-provided `userId`, `role`, or ownership claims are validated server-side.

## BR-MUSIC-001 — Beginner Accessibility
**Status:** CONFIRMED

A user must be able to begin creating music without first understanding formal music theory.

## BR-MUSIC-002 — Optional Technical Detail
**Status:** CONFIRMED

Beginner mode avoids forcing technical concepts like scale degrees or synthesis parameters when simpler controls are possible. Advanced mode unlocks Master FX, Stereo Panning, and Piano Roll grid editing.
