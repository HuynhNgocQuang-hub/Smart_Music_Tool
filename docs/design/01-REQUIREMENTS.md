# Functional Requirements

## Status Legend
- `CONFIRMED`: approved intent / implemented.
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
**Status:** CONFIRMED

The studio provides a metronome.

## REQ-STUDIO-009 — Solo/Mute
**Status:** CONFIRMED

Tracks support solo and mute controls.

## REQ-STUDIO-010 — Piano Roll
**Status:** CONFIRMED

The system provides a note editor for note-based tracks.

## REQ-STUDIO-011 — Basic Mixer
**Status:** CONFIRMED

The system provides basic track-level mixing controls (Volume, Stereo Panning, Mute, Solo).

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
**Status:** CONFIRMED

The user can record virtual-instrument performances into a track via keyboard.

## REQ-INST-005 — Initial Instrument Set
**Status:** CONFIRMED

Confirmed MVP set:
- Piano
- Drums
- Bass
- Guitar
- Strings
- Synth

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
**Status:** CONFIRMED

The user can request continuations for an existing melody.

## REQ-AI-007 — Melody Variation
**Status:** CONFIRMED

AI generates alternative melodies while preserving selected characteristics of a user-created melody.

## REQ-AI-008 — Build Around My Melody
**Status:** CONFIRMED

AI proposes rhythm, harmony, supporting instruments (Bass + Drums), and arrangement around a user-created melody.

## REQ-AI-009 — Natural-Language Editing
**Status:** CONFIRMED

The user can request changes in simple natural language. AI converts intent into previewable suggestions.

## REQ-AI-010 — Arrangement Assistance
**Status:** CONFIRMED

AI suggests musical structure/arrangement for an existing idea.

## REQ-AI-011 — Mixing Assistance
**Status:** CONFIRMED

AI identifies basic mix-balance issues and offers previewable suggestions.

# E. Hum / Sing to Melody

## REQ-VOICE-001 — Record Hummed/Sung Idea
**Status:** CONFIRMED

The user can record a melody idea through the browser microphone.

## REQ-VOICE-002 — Playback Original Recording
**Status:** CONFIRMED

The user can listen to the original recording.

## REQ-VOICE-003 — Melody Extraction
**Status:** CONFIRMED

The system estimates pitch sequence, contour, and timing from the recording using autocorrelation DSP.

## REQ-VOICE-004 — Tolerate Imperfect Singing
**Status:** CONFIRMED

Minor pitch instability and timing inaccuracies are quantized smoothly to scale.

## REQ-VOICE-005 — Instrument Preview
**Status:** CONFIRMED

The user can preview an extracted melody through different virtual instruments.

## REQ-VOICE-006 — Preserve Original
**Status:** CONFIRMED

Processing/AI does not delete or overwrite the original recording.

# F. Preference & Recommendation

## REQ-PREF-001 — Capture Feedback
**Status:** CONFIRMED

Support feedback such as Accept, Reject, and natural-language feedback.

# G. Beginner Experience

## REQ-BEGINNER-001 — Beginner-Friendly Start
**Status:** CONFIRMED

The primary experience shall not require music-theory knowledge to begin creating.

## REQ-BEGINNER-002 — Non-Technical Controls
**Status:** CONFIRMED

Prefer understandable terms such as sadder, happier, softer, stronger, calmer, continue, add rhythm.

## REQ-BEGINNER-003 — I Don't Know Assistance
**Status:** CONFIRMED

When the user cannot answer a technical question, offer audible alternatives instead.

## REQ-BEGINNER-004 — Advanced Mode
**Status:** CONFIRMED

Experienced users may optionally access technical controls such as BPM, key, MIDI, velocity, EQ, and automation.

# H. Recording

## REQ-REC-001 — Microphone Permission
**Status:** CONFIRMED

Request microphone permission only when recording functionality is invoked.

## REQ-REC-002 — Basic Audio Editing
**Status:** CONFIRMED

Recorded clips support trim, move, volume, and delete operations.

# I. Export

## REQ-EXPORT-001 — Export Music
**Status:** CONFIRMED

The system shall allow exporting a created musical result.

## REQ-EXPORT-002 — Export Formats
**Status:** CONFIRMED

Confirmed format: WAV (OfflineAudioContext 44.1kHz PCM rendering).

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
**Status:** CONFIRMED

Provide reusable drums, loops, effects, ambience, and other audio assets (Pop Chord Loop, Lo-Fi Drum Beat).

## REQ-SAMPLE-002 — Add Sample to Timeline
**Status:** CONFIRMED

Allow a sample to be added to a project timeline.

# Confirmed Stack Summary
- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+ OOP), Web Audio API, PitchTracker, WavExporter.
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Jackson, CorsConfig.
- **Database**: PostgreSQL 15 (Docker) + H2 (In-Memory profile).
