# AI Agent Entry Point

## Purpose
This file is the mandatory entry point for AI coding agents working on this project.

The product is a browser-based music creation platform where users can create music, play virtual instruments, arrange tracks, record musical ideas, and receive AI-assisted suggestions. The system must remain usable for people with little or no music-theory knowledge.

## Mandatory Reading Order
Before changing code, read:
1. `docs/design/00-PROJECT-VISION.md`
2. `docs/design/01-REQUIREMENTS.md`
3. `docs/design/02-BUSINESS-RULES.md`
4. Relevant workflow in `docs/design/05-WORKFLOWS.md`
5. Relevant design document
6. Relevant skill under `.agents/skills/`
7. Existing source code involved in the task

Do not jump directly from a prompt to generated code.

## Requirement Status
- `CONFIRMED`: approved project intent; may be implemented.
- `PROPOSED`: suggested feature; requires explicit approval before implementation.
- `FUTURE`: intentionally deferred.
- `TBD`: unresolved; clarify before depending on it.

An agent MUST NOT silently convert `PROPOSED`, `FUTURE`, or `TBD` items into confirmed requirements.

## Source of Truth Priority
1. Current explicit instruction from project owner
2. `CONFIRMED` requirements
3. Approved business rules
4. Accepted architecture decisions
5. Existing source/domain model
6. AI assumptions

Report unresolved conflicts instead of guessing.

## Core Principles
- This is a real browser music studio, not only a prompt-to-song generator.
- AI is a Music Copilot, not the sole creative actor.
- AI must not silently overwrite user-created music.
- Beginner users must be able to create without learning music theory first.
- Backend/trusted infrastructure owns authentication, authorization, validation, rate limiting, and critical business rules.
- Frontend validation is UX only, not security.
- Existing project structure is the implementation source of truth.

## Forbidden Behavior
Do not:
- invent roles, statuses, enum values, quotas, pricing, lock periods, or business policies;
- invent endpoints or DB fields merely for convenience;
- hardcode configurable policy values;
- trust frontend `userId`, `role`, or ownership claims;
- bypass backend authorization;
- auto-apply destructive AI changes to user-created content;
- replace original recordings/melodies when generating derived versions;
- implement `PROPOSED` features without approval;
- do unrelated large refactors;
- claim build/tests passed unless actually executed.

## Implementation Workflow
1. Identify requirement IDs.
2. Identify applicable business rules.
3. Trace current code path.
4. Identify roles/ownership/security impact.
5. Identify API/data changes.
6. Check concurrency and AI stale-result risks.
7. Design the smallest correct change.
8. Implement.
9. Build/test if execution is available.
10. Report changed files, verification, and remaining risks.

## Final Report Format
```text
## Requirements
- REQ-...

## Changed
- path/file — what changed

## Behavior
- resulting behavior

## Verification
- Build: PASS / FAIL / NOT RUN
- Tests: PASS / FAIL / NOT RUN

## Risks / Open Questions
- only real unresolved items
```
