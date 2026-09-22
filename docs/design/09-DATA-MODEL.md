# Confirmed Database Data Model

This document outlines the confirmed JPA entity & database table schema implemented in PostgreSQL / H2.

## Implemented Entities & Tables

### 1. MusicProject (`music_projects`)
- `id`: Long (Primary Key, Identity)
- `name`: String (Not Null)
- `description`: String
- `bpm`: Integer (Default: 120, 40-240)
- `musicKey`: String (Default: "C Major")
- `ownerId`: String (Default: "user_default")
- `tracks`: `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` -> `List<Track>`
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime
- `version`: Long (`@Version` optimistic locking)

### 2. Track (`tracks`)
- `id`: Long (Primary Key, Identity)
- `project`: `@ManyToOne` -> `MusicProject` (`project_id`)
- `name`: String (Not Null)
- `instrument`: String (PIANO, SYNTH, BASS, DRUMS, STRINGS, GUITAR)
- `volume`: Integer (0 to 100)
- `pan`: Integer (-50 to +50)
- `muted`: Boolean
- `solo`: Boolean
- `trackOrder`: Integer
- `clips`: `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` -> `List<Clip>`

### 3. Clip (`clips`)
- `id`: Long (Primary Key, Identity)
- `track`: `@ManyToOne` -> `Track` (`track_id`)
- `name`: String
- `startTime`: Double (Beats offset)
- `duration`: Double (Beats duration)
- `clipType`: String ("NOTE" or "AUDIO")
- `audioAssetUrl`: String
- `noteEvents`: `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` -> `List<NoteEvent>`

### 4. NoteEvent (`note_events`)
- `id`: Long (Primary Key, Identity)
- `clip`: `@ManyToOne` -> `Clip` (`clip_id`)
- `pitch`: String (e.g. "C4", "G4", "F#3")
- `startTime`: Double (Beats offset inside clip)
- `duration`: Double (Beats duration)
- `velocity`: Integer (0 to 127)

### 5. AiSuggestion (`ai_suggestions`)
- `id`: Long (Primary Key, Identity)
- `projectId`: Long
- `suggestionType`: String (NATURAL_LANGUAGE_PROMPT, LYRICS_TO_MELODY, GENERATE_HARMONY, SONG_ARRANGEMENT, CONTINUE_MELODY, BUILD_AROUND_MELODY, INSTRUMENT_RECOMMENDATION, MOOD_VARIATION)
- `targetInstrument`: String
- `payloadJson`: String (`TEXT` - Serialized JSON of suggested notes or tracks)
- `status`: String (PREVIEWED, ACCEPTED, REJECTED)
- `createdAt`: LocalDateTime

## Schema Relationship Graph
```text
MusicProject (1) ───< (N) Track (1) ───< (N) Clip (1) ───< (N) NoteEvent
    │
    └───────────< (N) AiSuggestion
```
