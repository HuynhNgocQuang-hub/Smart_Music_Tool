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
 ├─ Record Idea (Mic PitchTracker)
 └─ Ask AI for Help
 ↓
Edit / Arrange / Piano Roll Grid
 ↓
Preview AI Suggestions
 ↓
Accept / Reject
 ↓
Save to Backend (PostgreSQL/H2)
 ↓
Export WAV
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
AI Processing (AiCopilotService)
 ↓
Preview Result
 ↓
User Decision
 ├─ Accept → Apply to Project & DB
 ├─ Reject → Keep Current Project
 └─ Regenerate → New Suggestion
```

## FLOW-003 — Hum/Sing to Melody
**Status:** CONFIRMED
```text
Hum/Sing
 ↓
Microphone Permission
 ↓
Record Audio
 ↓
Pitch/Timing Analysis (Autocorrelation)
 ↓
Extract Melody Notes
 ↓
Preview with Instrument
 ↓
Accept / Retry / Discard
```
