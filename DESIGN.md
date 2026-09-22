# DESIGN.md — System Design Entry Point

## 1. Purpose

This file is the high-level design entry point for the project.

Any AI coding agent working on architecture, frontend/backend integration, music-studio behavior, AI-assisted music creation, persistence, API design, security, or performance should read this file before making structural changes.

This file summarizes the approved direction of the system and links to deeper design documents.

---

# 2. Product Design Summary

The product is a **browser-based music creation environment** that allows users to:

- create music projects,
- compose and arrange music,
- play virtual instruments,
- work with multiple tracks,
- record musical ideas,
- receive AI-assisted music suggestions,
- receive instrument recommendations,
- preview AI suggestions,
- accept or reject AI changes,
- save and export created music.

The product is intended for both:

- users who understand music,
- users with little or no music-theory knowledge.

## Core Product Principle

> Users should be able to create music without needing to understand music theory before they start.

## AI Product Principle

> AI is a Music Copilot, not the owner of the creative process.

AI may:

- suggest,
- recommend,
- continue,
- transform,
- explain,
- assist.

AI must not silently replace user-created music.

---

# 3. Design Status Model

All design and requirement documents may contain these statuses:

```text
CONFIRMED
PROPOSED
FUTURE
TBD
```

Meaning:

### CONFIRMED

Approved project intent.

AI agents may implement it when assigned.

### PROPOSED

Suggested design.

AI agents must not implement it as a required feature unless explicitly approved.

### FUTURE

Known future scope.

Do not include it in the current MVP unless the project owner moves it into scope.

### TBD

Decision has not been made yet.

Do not invent the answer.

---

# 4. Design Document Map

Detailed design is split across:

```text
docs/design/
│
├── 00-PROJECT-VISION.md
├── 01-REQUIREMENTS.md
├── 02-BUSINESS-RULES.md
├── 03-USER-ROLES.md
├── 04-USE-CASES.md
├── 05-WORKFLOWS.md
├── 06-SYSTEM-ARCHITECTURE.md
├── 07-MUSIC-STUDIO-DESIGN.md
├── 08-AI-MUSIC-DESIGN.md
├── 09-DATA-MODEL.md
├── 10-API-CONTRACT.md
├── 11-SECURITY-DESIGN.md
├── 12-NON-FUNCTIONAL-REQUIREMENTS.md
├── 13-TESTING-STRATEGY.md
└── 14-DECISIONS.md
```

Use this file only as the high-level map.

For implementation details, read the relevant document.

---

# 5. High-Level System Architecture

The system should be separated into three major technical areas:

```text
┌────────────────────────────────────────────┐
│                 FRONTEND                   │
│                                            │
│ Browser Music Studio                       │
│ Virtual Instruments                        │
│ Timeline / Track Editing                   │
│ Local Playback                             │
│ Recording                                  │
│ AI Suggestion UI                           │
└──────────────────────┬─────────────────────┘
                       │
                       │ HTTPS / API
                       ▼
┌────────────────────────────────────────────┐
│              SPRING BOOT BACKEND           │
│                                            │
│ Authentication                             │
│ Authorization                              │
│ Project Management                         │
│ Music Metadata                             │
│ Business Rules                             │
│ AI Orchestration                           │
│ File Metadata                              │
│ Security / Audit                           │
└───────────────┬────────────────┬───────────┘
                │                │
                ▼                ▼
        ┌───────────────┐  ┌──────────────────┐
        │   DATABASE    │  │ AI / AUDIO       │
        │               │  │ PROCESSING       │
        └───────────────┘  └──────────────────┘
```

## Confirmed Backend & Database Technology

```text
Java (Spring Boot 3)
PostgreSQL 15 (Docker Containerized)
DBeaver (Database GUI / Management Tool)
H2 Database (In-Memory for tests/fallback)
```

See [DOCKER_DBEAVER_GUIDE.md](file:///d:/music/DOCKER_DBEAVER_GUIDE.md) and [docker-compose.yml](file:///d:/music/docker-compose.yml) for setup instructions.

## Frontend Technology

```text
CONFIRMED:
HTML5 & Vanilla CSS3 (Custom Glassmorphism Design System)
JavaScript (ES6+ OOP Application Architecture)
Web Audio API (Synthesizers, Master Filter FX, Delay, Reverb)
Autocorrelation Pitch Tracking (Microphone Hum-to-Melody)
OfflineAudioContext (Offline WAV Exporter)
Node.js Light HTTP Server (server.js on port 3000)
```

---

# 6. Frontend Design Responsibilities

The frontend is the primary music interaction environment.

It should handle low-latency interactions where practical.

Examples:

```text
Instrument note playback
Track volume preview
Play / Stop
Playhead movement
Metronome
Timeline interaction
Local editing state
Basic audio effects
```

These operations should not require a backend request for every interaction.

## Important

The frontend is NOT a security authority.

Frontend validation is for user experience only.

The backend must independently enforce:

- authentication,
- authorization,
- ownership,
- validation,
- business rules,
- rate limits where required.

---

# 7. Backend Design Responsibilities

Spring Boot is responsible for trusted application behavior.

Core responsibilities include:

```text
Authentication
Authorization
Project ownership
Music project persistence
Track / clip metadata
AI request orchestration
AI suggestion lifecycle
Recording metadata
File access control
Export coordination
Validation
Security
Audit
```

Typical backend architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Controllers should remain thin.

Business decisions belong in services/domain logic.

---

# 8. Browser Music Studio Design

The browser studio is the core product experience.

Conceptually:

```text
┌──────────────────────────────────────────────────┐
│ PLAY | STOP | RECORD | TEMPO | PROJECT           │
├───────────────┬──────────────────────────────────┤
│               │                                  │
│ Instruments   │        TIMELINE                  │
│               │                                  │
│ Piano         │ Track 1 ████████                 │
│ Drums         │ Track 2   ███████████            │
│ Bass          │ Track 3 █████████████            │
│ Guitar        │                                  │
│ Strings       │                                  │
│ Synth         │                                  │
│               │                                  │
├───────────────┴──────────────────────────────────┤
│              TRACK / NOTE EDITOR                 │
├──────────────────────────────────────────────────┤
│                  MIXER                           │
└──────────────────────────────────────────────────┘
```

Exact UI layout is not fixed by this diagram.

## Confirmed Capabilities

The product direction includes:

- music project creation,
- browser music creation,
- multiple tracks,
- playback,
- timeline/arrangement,
- virtual instruments,
- instrument selection,
- AI assistance,
- AI instrument recommendation,
- AI melody assistance,
- save,
- export.

---

# 9. Virtual Instrument Design

The system should support multiple virtual instrument types.

Potential examples include:

```text
Piano
Drums
Bass
Guitar
Strings
Synth
```

Additional instruments may be added later.

## Important Design Rule

Do not tightly hardcode instrument behavior across frontend/backend if the project intends instruments to be expandable.

Prefer a reusable instrument definition/configuration model when implementation requirements justify it.

## Browser Interaction

Users should be able to play supported instruments using suitable browser controls.

Possible input methods:

```text
Mouse
Computer keyboard
Touch
MIDI controller (PROPOSED)
```

---

# 10. AI Music Copilot Design

AI must integrate into the creation workflow, not exist as an isolated "generate song" button.

AI may assist with:

```text
Instrument Recommendation
Melody Suggestion
Melody Continuation
Melody Variation
Arrangement Suggestions
Sound Recommendation
Mixing Suggestions
Natural-Language Editing
Preference-Based Suggestions
```

Only the already confirmed requirements are mandatory.

Other capabilities remain `PROPOSED` until approved.

---

# 11. AI Suggestion Safety Model

For any AI suggestion that materially changes user-created content:

```text
User Music
    ↓
AI Analyzes Context
    ↓
AI Generates Suggestion
    ↓
Preview
    ↓
User Decision
 ┌───────┴────────┐
 ↓                ↓
Accept           Reject
 ↓                ↓
Apply          No Change
```

## Mandatory Rule

AI must not directly overwrite authoritative project content before user acceptance.

---

# 12. Preserve Original Work

User-created material should remain recoverable when AI creates derived versions.

Examples:

```text
Original Recording
+
Extracted Melody
+
AI Variation
```

not:

```text
Original Recording
→ overwritten by AI result
```

The exact persistence/versioning strategy is still TBD.

---

# 13. Hum / Sing to Melody

**Status: PROPOSED**

A differentiating feature may allow a user to hum or sing a melody idea.

Concept:

```text
User Voice
    ↓
Recording
    ↓
Pitch Detection
    ↓
Timing Detection
    ↓
Melody Extraction
    ↓
Editable Musical Representation
    ↓
Instrument Preview
```

The user should not need to sing perfectly.

Minor:

```text
Pitch instability
Timing instability
Breathing
Background noise
```

should be handled gracefully where technically practical.

---

# 14. Beginner Experience Design

The system should not force beginner users to understand advanced terminology.

Avoid making basic workflows depend on knowledge of:

```text
Chord progression
Scale degree
Quantization
Velocity
Oscillator
EQ frequency bands
```

Prefer user-facing actions such as:

```text
Make it sadder

Make it happier

Make it softer

Make it more energetic

Continue this melody

Add rhythm

Suggest an instrument

Try another version
```

Advanced controls may exist separately.

---

# 15. Beginner vs Advanced Experience

## Beginner Mode
**Status: PROPOSED**

Optimized for:

- audible choices,
- AI assistance,
- natural-language feedback,
- simplified controls.

## Advanced Mode
**Status: PROPOSED**

May expose:

```text
BPM
Key
Scale
Piano Roll
Velocity
Pan
EQ
Effects
Automation
MIDI controls
```

These are not required until approved.

---

# 16. Preference and Recommendation Design

**Status: PROPOSED**

The system may learn from user feedback.

Possible signals:

```text
Like

Dislike

Accept

Reject

A/B Choice

Natural-language feedback
```

Example:

```text
User likes Soft Piano
        ↓
Recommendation Engine
        ↓
Suggest similar sounds
```

Preference must be contextual where possible.

A person liking a sound in one project does not necessarily imply the same preference in all music contexts.

---

# 17. A/B Music Choice

**Status: PROPOSED**

For users who do not understand technical music language:

```text
Option A ▶

     VS

Option B ▶
```

The user chooses what sounds better.

This feedback may later help recommendation systems.

---

# 18. Natural-Language Music Interaction

**Status: PROPOSED**

Users may express musical intent naturally.

Examples:

```text
"The drums are too strong."

"This part feels empty."

"Make it more emotional."

"Continue this melody."

"Make it calmer."
```

AI should convert the request into previewable musical suggestions rather than immediately modifying project state.

---

# 19. Data Model Direction

Conceptual core objects include:

```text
User
MusicProject
Track
Clip
Instrument
AudioAsset
NoteEvent
AISuggestion
```

These are conceptual design objects.

They are NOT automatically approved database tables.

Read:

```text
docs/design/09-DATA-MODEL.md
```

before implementing persistence.

---

# 20. Project / Track / Clip Model

A likely hierarchy:

```text
User
 └── MusicProject
      ├── Track
      │    └── Clip
      │         ├── Notes
      │         └── AudioAsset
      │
      └── AI Suggestions
```

Exact relationships remain implementation-dependent.

---

# 21. Audio Storage Design

Avoid storing large audio binaries directly in relational database columns unless explicitly chosen.

Likely architecture:

```text
Database
    ↓
stores metadata/reference

Object/File Storage
    ↓
stores audio
```

Exact storage technology is TBD.

Do not automatically add:

```text
S3
MinIO
Cloudinary
Azure Blob
Google Cloud Storage
```

without an approved architecture decision.

---

# 22. API Design

Frontend communicates with the Spring Boot backend through APIs.

Candidate resources:

```text
/auth
/projects
/projects/{id}/tracks
/projects/{id}/clips
/instruments
/recordings
/ai
/exports
```

These paths are conceptual.

Do not implement them blindly if current source uses a different convention.

Detailed API guidance:

```text
docs/design/10-API-CONTRACT.md
```

---

# 23. AI API Pattern

Preferred conceptual flow:

```text
Frontend
    ↓
Request AI Suggestion
    ↓
Spring Boot
    ↓
Validate Authentication
Validate Ownership
Validate Project Context
    ↓
AI Processing
    ↓
Suggestion
    ↓
Frontend Preview
    ↓
Accept / Reject
```

The AI service should not directly modify the authoritative project database.

---

# 24. Long-Running AI Jobs

Some AI/audio processing may take longer than a normal synchronous request.

Potential design:

```text
POST AI request
    ↓
202 / job created
    ↓
Processing
    ↓
Result available
```

Exact asynchronous job design is TBD.

Do not introduce queues or brokers without need.

Potential technologies such as:

```text
Redis
RabbitMQ
Kafka
SQS
```

are not automatically approved.

---

# 25. Security Design

Security is backend-enforced.

Required concerns include:

```text
Authentication
Authorization
Project ownership
Input validation
Secure file access
Rate limiting
Race-condition protection
Secure error responses
Secret management
HTTPS
```

Read:

```text
docs/design/11-SECURITY-DESIGN.md
```

and:

```text
.agents/skills/api-security/SKILL.md
```

before changing security-sensitive code.

---

# 26. Rate Limiting

Rate limiting should be considered for expensive or abuse-sensitive operations such as:

```text
Login
Registration
AI generation
Audio processing
Upload
Export
```

Exact limits are TBD.

Never invent:

```text
10 requests/minute
100 requests/day
5 AI generations
```

without project approval.

---

# 27. Race Condition Protection

Rate limiting does not prevent concurrency bugs.

Example:

```text
Request A
Request B
     ↓
Both read same project state
     ↓
Both modify
     ↓
Lost update
```

Or future paid/credit operations:

```text
Balance = 1

Request A → consume
Request B → consume

Both succeed ❌
```

Use appropriate mechanisms such as:

```text
Transactions
Optimistic locking
Atomic database update
Unique constraints
Idempotency
```

Only when the use case requires them.

---

# 28. Stale AI Suggestions

AI requests may finish after the user has already edited the project.

Example:

```text
Project Revision 12
       ↓
AI request starts
       ↓
User edits
       ↓
Project Revision 13
       ↓
AI returns result for Revision 12
```

The system must not blindly apply stale AI suggestions.

Possible solution:

```text
Suggestion stores base revision
        ↓
Before apply
        ↓
Check current revision
        ↓
Apply / reject / require preview refresh
```

Exact strategy is TBD.

---

# 29. Performance Design

The music studio must feel interactive.

Therefore:

```text
Play note
Adjust volume
Move playhead
Preview instrument
```

should avoid unnecessary backend round trips.

Use client-side audio processing where practical.

Backend should focus on:

```text
Persistence
Security
AI orchestration
Shared state
File metadata
Long-running processing
```

---

# 30. Reliability Design

AI failure must not corrupt the music project.

If AI:

```text
times out
returns invalid data
is unavailable
fails processing
```

the current user project should remain intact.

---

# 31. Export Design

**CONFIRMED capability, format TBD**

The user can export created music.

Potential formats:

```text
WAV
MP3
MIDI
```

Do not assume all formats are supported until confirmed.

Export architecture may be:

```text
Client-side rendering
```

or:

```text
Server-side rendering
```

depending on final implementation.

---

# 32. Collaboration Design

**Status: FUTURE**

Possible future capabilities:

```text
Invite collaborators
Comments
Shared project editing
Version history
Real-time collaboration
```

These should not enter MVP implementation unless explicitly promoted.

---

# 33. Non-Functional Design Priorities

Priority order:

```text
1. Correctness
2. User creative safety
3. Responsive music interaction
4. Security
5. Reliability
6. Maintainability
7. Scalability
8. Advanced features
```

Do not sacrifice correctness or user data to add visual/AI complexity.

---

# 34. AI Agent Design Rules

Before making a structural change, the agent must:

```text
1. Read AGENTS.md
2. Read DESIGN.md
3. Find requirement IDs
4. Read business rules
5. Read relevant detailed design
6. Read relevant SKILL.md
7. Inspect current source
8. Design smallest correct change
9. Implement
10. Test / report
```

---

# 35. Relevant Skills

## Spring Backend

```text
.agents/skills/spring-backend/SKILL.md
```

Use for:

- Controller
- Service
- Repository
- JPA
- DTO
- validation
- transaction
- Spring architecture

## API Security

```text
.agents/skills/api-security/SKILL.md
```

Use for:

- authentication,
- authorization,
- ownership,
- rate limiting,
- API security,
- file security,
- concurrency.

## Music Domain

```text
.agents/skills/music-domain/SKILL.md
```

Use for:

- studio,
- timeline,
- instruments,
- tracks,
- clips,
- playback,
- recording.

## AI Music

```text
.agents/skills/ai-music/SKILL.md
```

Use for:

- melody AI,
- instrument recommendation,
- humming,
- preferences,
- natural-language music assistance.

---

# 36. Open Architecture Decisions

Do not invent these decisions.

Current unresolved items include:

```text
Frontend framework
Database
Audio file storage
AI provider/model
Audio-processing technology
Exact instrument library
Exact export formats
Project state serialization strategy
Music note/time representation
AI job processing architecture
Preference storage
Collaboration scope
MVP performance targets
AI usage limits
```

Record approved decisions in:

```text
docs/design/14-DECISIONS.md
```

---

# 37. Definition of Design Compliance

A feature is design-compliant when:

- it maps to an approved requirement,
- it follows relevant business rules,
- it preserves user-created work,
- AI changes require appropriate user approval,
- backend authorization is enforced,
- real-time music interaction is not unnecessarily server-dependent,
- no unapproved technology or workflow is invented,
- errors do not corrupt project data,
- concurrent/stale state behavior is considered where relevant,
- the implementation follows the relevant skill document.

---

# 38. Final Principle

The technical architecture should support this user journey:

```text
"I have a musical idea"
          ↓
"I can express it"
          ↓
"The system helps me understand it"
          ↓
"AI gives me options"
          ↓
"I choose what sounds right"
          ↓
"I continue creating"
          ↓
"I finish something that still feels like mine"
```

That principle should guide product and engineering decisions.
