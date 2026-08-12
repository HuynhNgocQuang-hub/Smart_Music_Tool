# AI Music Skill

## Scope
Use for instrument recommendation, melody suggestion/continuation/variation, hum/sing analysis, preference learning, natural-language assistance, arrangement, and mixing suggestions.

## AI Is a Copilot
Material AI modifications follow:
```text
Generate → Preview → Accept/Reject → Apply
```
Never auto-apply destructive changes.

## Preserve Source
Keep original recording/melody/region when creating variants unless the user explicitly deletes it.

## Context Minimization
Use only necessary project context. Do not send unrelated private user data to providers.

## Hum/Sing
Conceptual pipeline:
```text
recording → pitch/timing analysis → melody representation → preview
```
Handle imperfect singing; do not assume perfect pitch/timing.

## Recommendation
Explain suggestions in beginner-friendly language when shown to beginners.

## Preference Learning
Do not infer permanent preference from one action. Prefer repeated/contextual signals.

## Stale Results
If project state changes while AI is processing, verify target revision before apply. Never blindly apply stale suggestions.

## Duplicate Requests
Use appropriate UX and backend protections for expensive operations. Frontend debounce alone is not security.

## Failure
Handle timeout, provider unavailable, malformed/empty result, and unusable output without corrupting project state.

## Copyright-Aware Similarity
Prefer high-level mood/timbre/energy/instrumentation/rhythm similarity instead of intentional copying of identifiable external melodies. Do not claim copyright guarantees.
