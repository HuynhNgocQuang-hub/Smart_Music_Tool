# Workflows

## FLOW-001 — Main Music Creation
**Status:** CONFIRMED
```text
User
 ↓
Create Project
 ↓
Open Music Studio
 ↓
Start Creating
 ├─ Play Virtual Instrument
 ├─ Create/Arrange Track
 ├─ Record Idea (PROPOSED)
 └─ Ask AI for Help
 ↓
Edit / Arrange
 ↓
Preview AI Suggestions
 ↓
Accept / Reject
 ↓
Save
 ↓
Export
```

## FLOW-002 — AI Suggestion
**Status:** CONFIRMED
```text
Project Context
 ↓
User Requests AI Help
 ↓
Backend Validates User + Project Access
 ↓
AI Processing
 ↓
Preview Result
 ↓
User Decision
 ├─ Accept → Apply
 ├─ Reject → Keep Current Project
 └─ Regenerate → New Suggestion
```

## FLOW-003 — Hum/Sing to Melody
**Status:** PROPOSED
```text
Hum/Sing
 ↓
Microphone Permission
 ↓
Record
 ↓
Preview Raw Audio
 ↓
Process Audio
 ↓
Pitch/Timing Analysis
 ↓
Extract Melody
 ↓
Preview with Instrument
 ↓
Accept / Retry / Discard
```

## FLOW-004 — Continue Melody
**Status:** PROPOSED
```text
Select Melody Region
 ↓
Request Continue
 ↓
Generate A/B/C
 ↓
Preview
 ↓
Accept / Retry / Cancel
 ↓
Add Accepted Continuation
```

## FLOW-005 — Instrument Recommendation
**Status:** CONFIRMED
```text
Project Context
 ↓
Analyze Current Music/User Intent
 ↓
Recommend Instruments
 ↓
Preview
 ↓
User Accepts
 ↓
Add Instrument
```

## FLOW-006 — Preference Feedback
**Status:** PROPOSED
```text
Suggestion
 ↓
Feedback: Like / Dislike / Accept / Reject / A-B
 ↓
Store Contextual Feedback
 ↓
Update Recommendation Signals
 ↓
Use in Future Suggestions
```
