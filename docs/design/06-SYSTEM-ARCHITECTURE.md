# System Architecture

## Goal
Separate low-latency browser audio interactions from backend persistence, security, AI orchestration, and heavy processing.

## High-Level Architecture
```text
┌──────────────────────────────────┐
│ Browser Music Studio             │
│ UI / Timeline / Instruments      │
│ Local Playback / Recording       │
│ Web Audio / optional MIDI        │
└───────────────┬──────────────────┘
                │ HTTPS/API
                ▼
┌──────────────────────────────────┐
│ Spring Boot Backend              │
│ Auth / Authorization             │
│ Project Management               │
│ Music Metadata                   │
│ AI Orchestration                 │
│ Validation / Security            │
└─────────────┬───────────┬────────┘
              │           │
              ▼           ▼
       ┌────────────┐  ┌──────────────┐
       │ Database   │  │ AI/Audio     │
       │            │  │ Processing   │
       └────────────┘  └──────┬───────┘
                              ▼
                         AI Model/Provider
```

## Confirmed Backend Stack
- Java 17
- Spring Boot 3
- PostgreSQL 15 (Docker) & H2 (In-Memory profile)
- Spring Data JPA + Jackson JSON Serialization

## Confirmed Frontend Stack
- HTML5 & Vanilla CSS3 (Custom Glassmorphism Design System)
- JavaScript (ES6+ OOP Architecture)
- Web Audio API (Synthesizers, Master FX BiquadFilter, Delay, Reverb Convolver)
- PitchTracker (Microphone Autocorrelation Pitch Extraction)
- WavExporter (OfflineAudioContext WAV Renderer)
- Node.js Light HTTP Server (`server.js` on port 3000)

## Browser Audio Technologies
- Web Audio API (Native Oscillators & Gains)
- Autocorrelation DSP Pitch Extraction
- OfflineAudioContext rendering for client-side WAV export

Do not call Spring Boot for every note, volume drag, playhead update, or metronome tick.

## Backend Responsibilities
- authentication/authorization/ownership validation,
- project metadata and full track/clip/note entity hierarchy persistence,
- AI request orchestration (`AiCopilotService`),
- file metadata & CORS security controls,
- AI suggestion lifecycle status updates (`ACCEPTED`, `REJECTED`, `PREVIEWED`).

## AI / Audio Copilot Service
Implemented in Spring Boot `AiCopilotService`:
- natural language prompt processing & music scale selection,
- lyrics-to-melody pitch extraction with Vietnamese tone analysis,
- 3rd interval diatonic harmony generation,
- song arrangement structure generator,
- melody continuation,
- instrument recommendation,
- mood/emotional variation transformation.

## Storage
Confirmed:
- PostgreSQL 15 (Docker containerized) + H2 Database (In-Memory)
- Spring Data JPA Relational Persistence (`music_projects`, `tracks`, `clips`, `note_events`, `ai_suggestions`)
