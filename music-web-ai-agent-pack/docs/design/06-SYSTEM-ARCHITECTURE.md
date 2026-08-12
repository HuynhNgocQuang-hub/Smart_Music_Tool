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
- Java
- Spring Boot

## Frontend Stack
TBD. Do not assume React/Vue/Angular until confirmed.

## Proposed Browser Audio Technologies
- Web Audio API
- AudioWorklet
- Web MIDI API
- WebAssembly
- maintained audio abstraction library

Do not call Spring Boot for every note, volume drag, playhead update, or metronome tick.

## Backend Responsibilities
- authentication/authorization/ownership,
- project metadata and persistence,
- AI request orchestration,
- file metadata,
- security controls,
- export coordination when server rendering is required.

## Proposed AI/Audio Service
Potential responsibilities:
- pitch tracking,
- onset/timing detection,
- melody extraction,
- embeddings,
- melody continuation,
- recommendation,
- arrangement analysis.

Implementation language is TBD. Python is an option, not a requirement.

## Storage
TBD:
- relational database,
- audio/object storage,
- cache,
- vector search only if recommendation design needs it.

Do not add Redis/vector DB/object storage without a concrete requirement.
