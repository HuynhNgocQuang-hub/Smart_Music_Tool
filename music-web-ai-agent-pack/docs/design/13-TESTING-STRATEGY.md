# Testing Strategy

## Principle
Every feature should be evaluated for:
- happy case,
- unhappy case,
- boundary,
- negative/security,
- concurrency when relevant.

## Backend Unit Tests
Focus on service business rules, authorization policies, mapping when meaningful, AI acceptance lifecycle, and state validation.

## Backend Integration Tests
Focus on controller/service/repository flow, authentication, ownership, persistence, transactions, and upload validation.

## Frontend Tests
Focus on studio state, timeline actions, AI preview/accept/reject, permission/error states, and recording permission behavior.

## Music-Specific Cases
- multiple instruments,
- deleting selected track,
- empty project playback,
- overlapping content,
- unavailable instrument,
- reload preserves arrangement.

## Hum/Sing Cases
**Status:** PROPOSED
- microphone allowed/denied,
- silence,
- short/noisy input,
- unstable pitch,
- processing timeout,
- reject result,
- retry recording.

## AI Cases
- valid suggestion,
- timeout,
- malformed response,
- reject/accept/regenerate,
- duplicate generate click,
- project changes while AI processes,
- stale suggestion not blindly applied,
- unauthorized project AI request.

## Security Cases
- no token,
- wrong owner,
- forged user ID,
- invalid file,
- oversized request,
- excessive AI requests,
- secret leakage.

## Definition of Done
- requirement ID identified,
- business rules checked,
- code compiles,
- tests run when available,
- error/security cases considered,
- no unrelated changes,
- verification status reported.
