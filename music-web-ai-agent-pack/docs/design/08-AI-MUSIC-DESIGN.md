# AI Music Design

## AI Role
AI is a **Music Copilot**. It may suggest, explain, continue, transform, recommend, and assist.

It must not silently take ownership of the creative process.

## Context
AI requests may use relevant context such as:
- selected region,
- current instruments,
- tempo/key if available,
- project structure,
- user instruction,
- relevant preference signals.

Do not send unrelated private data.

## Suggestion Lifecycle
Conceptual only:
```text
Request → Processing → Preview → Accept / Reject
```
Do not create persisted enum values solely from this diagram.

## Instrument Recommendation
Potential inputs:
- current instrumentation,
- selected section,
- mood/intent,
- preference signals.

Outputs should be understandable and previewable.

## Melody Assistance
Potential abilities:
- continue melody,
- generate variations,
- simplify/smooth,
- adjust energy/mood,
- suggest supporting musical material.

## Hum/Sing → Melody
**Status:** PROPOSED
```text
Voice Recording
→ Cleanup
→ Pitch Tracking
→ Timing/Onset Analysis
→ Note Estimation
→ Melody Representation
→ Instrument Preview
```
Distinguish raw recording, extracted melody, and AI-modified result.

## Preference Learning
**Status:** PROPOSED
Signals may include Like/Dislike, Accept/Reject, A/B choice, repeated choices, and natural-language feedback.

Do not infer permanent preference from one action.

## Stale AI Results
If the user edits the project while AI is processing, do not blindly apply the old result. Verify target project/region revision compatibility.

## Duplicate AI Requests
Protect expensive operations using appropriate UX + backend controls. Frontend disable/debounce may help, but backend security/rate limits remain authoritative.

## Failure Handling
Handle provider timeout, unavailable service, malformed response, empty/unusable result, and duplicate/stale request without corrupting project state.

## Copyright-Aware Design
"Similar" should mean high-level characteristics such as mood, timbre, energy, instrumentation, or rhythmic character—not intentional copying of identifiable external melodies.
