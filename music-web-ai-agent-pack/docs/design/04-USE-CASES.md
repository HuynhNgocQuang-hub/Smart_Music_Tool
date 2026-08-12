# Use Cases

## UC-001 — Create a Music Project
**Status:** CONFIRMED

**Actor:** User  
**Goal:** Start creating music.

1. User creates a project.
2. System initializes an editable workspace.
3. User opens the studio.
4. User adds musical content.
5. Project can be saved.

## UC-002 — Add and Play a Virtual Instrument
**Status:** CONFIRMED

1. User opens instrument list.
2. User chooses an instrument.
3. System associates it with a track/context.
4. User plays it using supported controls.
5. User hears the result.

## UC-003 — Ask AI for Instrument Suggestion
**Status:** CONFIRMED

1. User requests a suggestion.
2. Backend validates access.
3. AI receives permitted project context.
4. AI returns recommendations.
5. User previews.
6. User accepts/rejects.

## UC-004 — Ask AI for Melody Help
**Status:** CONFIRMED

1. User selects relevant context/region.
2. User asks for melody help.
3. AI generates alternatives.
4. User previews them.
5. User accepts one, asks for more, or rejects all.

## UC-005 — Hum an Idea and Turn It Into a Melody
**Status:** PROPOSED

1. User chooses Hum/Sing.
2. Browser requests microphone permission.
3. User records an idea.
4. User previews original recording.
5. System analyzes pitch/timing.
6. System creates estimated melody.
7. User previews through an instrument.
8. User accepts, retries, or edits.

Alternative cases: permission denied, silence/no melody, noisy input, processing failure.

## UC-006 — Continue My Melody
**Status:** PROPOSED

1. User selects melody.
2. User requests continuation.
3. AI generates A/B/C.
4. User previews.
5. User accepts/retries/cancels.
6. Accepted continuation is added without deleting original content.

## UC-007 — Beginner A/B Choice
**Status:** PROPOSED

1. System presents two audible alternatives.
2. User listens to both.
3. User selects preferred option.
4. System stores contextual preference feedback.
