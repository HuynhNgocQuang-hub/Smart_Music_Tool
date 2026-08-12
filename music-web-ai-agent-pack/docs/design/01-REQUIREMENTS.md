# Functional Requirements

## Status Legend
- `CONFIRMED`: approved intent.
- `PROPOSED`: suggested; requires approval.
- `FUTURE`: deferred.
- `TBD`: unresolved.

# A. Music Project

## REQ-PROJECT-001 — Create Music Project
**Status:** CONFIRMED

The system shall allow a user to create a music project containing tracks, instruments, recordings, and AI-assisted content.

## REQ-PROJECT-002 — Reopen Project
**Status:** CONFIRMED

The user shall be able to reopen an existing project and continue working.

## REQ-PROJECT-003 — Save Project
**Status:** CONFIRMED

The system shall persist project state.

## REQ-PROJECT-004 — Autosave
**Status:** PROPOSED

The system should automatically save project changes.

# B. Browser Music Studio

## REQ-STUDIO-001 — Browser-Based Creation
**Status:** CONFIRMED

The system shall provide a music-creation environment directly in the browser.

## REQ-STUDIO-002 — Multiple Tracks
**Status:** CONFIRMED

A project shall support multiple tracks.

## REQ-STUDIO-003 — Playback
**Status:** CONFIRMED

The user shall be able to play, pause, and stop project playback.

## REQ-STUDIO-004 — Timeline
**Status:** CONFIRMED

The studio shall provide a timeline/arrangement area for musical content.

## REQ-STUDIO-005 — Track Volume
**Status:** CONFIRMED

The user shall be able to adjust track volume.

## REQ-STUDIO-006 — Loop Region
**Status:** PROPOSED

The user should be able to loop a selected region.

## REQ-STUDIO-007 — Undo/Redo
**Status:** PROPOSED

The user should be able to undo/redo reversible editing actions.

## REQ-STUDIO-008 — Metronome
**Status:** PROPOSED

The studio should provide a metronome.

## REQ-STUDIO-009 — Solo/Mute
**Status:** PROPOSED

Tracks should support solo and mute controls.

## REQ-STUDIO-010 — Piano Roll
**Status:** PROPOSED

The system should provide a note editor for note-based tracks.

## REQ-STUDIO-011 — Basic Mixer
**Status:** PROPOSED

The system should provide basic track-level mixing controls.

# C. Virtual Instruments

## REQ-INST-001 — Add Instrument
**Status:** CONFIRMED

The user shall be able to add virtual instruments to a project.

## REQ-INST-002 — Multiple Instrument Types
**Status:** CONFIRMED

The system shall support multiple virtual-instrument types.

## REQ-INST-003 — Play in Browser
**Status:** CONFIRMED

The user shall be able to play supported instruments directly through the browser.

## REQ-INST-004 — Record Instrument Performance
**Status:** PROPOSED

The user should be able to record a virtual-instrument performance into a track.

## REQ-INST-005 — Initial Instrument Set
**Status:** PROPOSED

Suggested MVP set:
- Piano
- Drums
- Bass
- Guitar
- Strings
- Synth

Final set is TBD.

# D. AI Music Copilot

## REQ-AI-001 — AI Music Assistance
**Status:** CONFIRMED

The system shall integrate AI to assist users during music creation.

## REQ-AI-002 — Instrument Recommendation
**Status:** CONFIRMED

AI shall recommend instruments that may fit the current project/context.

## REQ-AI-003 — Preview AI Suggestion
**Status:** CONFIRMED

AI-generated or AI-modified musical suggestions shall be previewable before modifying user-created content.

## REQ-AI-004 — Accept/Reject
**Status:** CONFIRMED

The user shall be able to accept or reject an AI suggestion.

## REQ-AI-005 — Melody Assistance
**Status:** CONFIRMED

AI shall be able to assist with melody creation or melody suggestions.

## REQ-AI-006 — Continue Melody
**Status:** PROPOSED

The user should be able to request multiple continuations for an existing melody.

## REQ-AI-007 — Melody Variation
**Status:** PROPOSED

AI should generate alternative melodies while preserving selected characteristics of a user-created melody.

## REQ-AI-008 — Build Around My Melody
**Status:** PROPOSED

AI should propose rhythm, harmony, supporting instruments, and arrangement around a user-created melody.

## REQ-AI-009 — Natural-Language Editing
**Status:** PROPOSED

The user should be able to request changes in simple language, such as:
- make it sadder,
- drums are too strong,
- make this more energetic,
- this part feels empty.

AI should convert intent into previewable suggestions.

## REQ-AI-010 — Arrangement Assistance
**Status:** PROPOSED

AI should suggest musical structure/arrangement for an existing idea.

## REQ-AI-011 — Mixing Assistance
**Status:** PROPOSED

AI should identify basic mix-balance issues and offer understandable, previewable suggestions.

# E. Hum / Sing to Melody

## REQ-VOICE-001 — Record Hummed/Sung Idea
**Status:** PROPOSED

The user should be able to record a melody idea through the browser microphone.

## REQ-VOICE-002 — Playback Original Recording
**Status:** PROPOSED

The user should be able to listen to the original recording.

## REQ-VOICE-003 — Melody Extraction
**Status:** PROPOSED

The system should estimate melodic contour, pitch sequence, and timing from the recording.

## REQ-VOICE-004 — Tolerate Imperfect Singing
**Status:** PROPOSED

Minor pitch instability, breath sounds, and timing inaccuracies should not automatically invalidate the input.

## REQ-VOICE-005 — Instrument Preview
**Status:** PROPOSED

The user should be able to preview an extracted melody through different virtual instruments.

## REQ-VOICE-006 — Preserve Original
**Status:** PROPOSED

Processing/AI must not delete or overwrite the original recording.

# F. Preference & Recommendation

## REQ-PREF-001 — Capture Feedback
**Status:** PROPOSED

Support feedback such as Like, Dislike, Accept, Reject, A/B choice, and natural-language feedback.

## REQ-PREF-002 — Learn Preference
**Status:** PROPOSED

Use feedback to improve future recommendations.

## REQ-PREF-003 — Context-Aware Preference
**Status:** PROPOSED

Preference should consider current project context instead of assuming one permanent taste profile.

## REQ-PREF-004 — Similar Sound Recommendation
**Status:** PROPOSED

Recommend sounds/instruments similar to positively rated sounds.

## REQ-PREF-005 — A/B Music Choice
**Status:** PROPOSED

Allow beginners to choose between audible alternatives without music-theory terminology.

# G. Beginner Experience

## REQ-BEGINNER-001 — Beginner-Friendly Start
**Status:** CONFIRMED

The primary experience shall not require music-theory knowledge to begin creating.

## REQ-BEGINNER-002 — Non-Technical Controls
**Status:** PROPOSED

Prefer understandable terms such as sadder, happier, softer, stronger, calmer, continue, add rhythm.

## REQ-BEGINNER-003 — I Don't Know Assistance
**Status:** PROPOSED

When the user cannot answer a technical question, offer audible alternatives instead.

## REQ-BEGINNER-004 — Advanced Mode
**Status:** PROPOSED

Experienced users may optionally access technical controls such as BPM, key, MIDI, velocity, EQ, and automation.

# H. Recording

## REQ-REC-001 — Microphone Permission
**Status:** PROPOSED

Request microphone permission only when recording functionality is invoked.

## REQ-REC-002 — Basic Audio Editing
**Status:** PROPOSED

Recorded clips should support trim, move, volume, and delete operations.

# I. Export

## REQ-EXPORT-001 — Export Music
**Status:** CONFIRMED

The system shall allow exporting a created musical result.

## REQ-EXPORT-002 — Export Formats
**Status:** PROPOSED

Possible formats: WAV, MP3, MIDI. Final MVP formats are TBD.

# J. Collaboration

## REQ-COLLAB-001 — Collaboration
**Status:** FUTURE

Users may eventually invite collaborators to a project.

## REQ-COLLAB-002 — Comments
**Status:** FUTURE

Collaborators may comment on project/timeline content.

## REQ-COLLAB-003 — Version History
**Status:** FUTURE

The system may retain project versions.

# K. Sample Library

## REQ-SAMPLE-001 — Sample Library
**Status:** PROPOSED

Provide reusable drums, loops, effects, ambience, and other audio assets.

## REQ-SAMPLE-002 — Add Sample to Timeline
**Status:** PROPOSED

Allow a sample to be added to a project timeline.

# Open Questions
- Frontend framework
- Database engine
- Audio/object storage
- AI providers/models
- Exact instrument library
- Export formats
- Project/recording size limits
- AI quotas
- Collaboration scope
- Community/public publishing
- Licensing rules for bundled samples
