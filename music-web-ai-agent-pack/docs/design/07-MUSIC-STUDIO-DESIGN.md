# Browser Music Studio Design

## Goal
Provide a real music-making environment in the browser while remaining understandable to beginners.

## Conceptual Layout
```text
┌───────────────────────────────────────────┐
│ Transport: Play / Stop / Record / Tempo  │
├─────────────┬─────────────────────────────┤
│ Instruments │ Timeline / Arrangement      │
│ Samples     │ Track 1                     │
│ AI Tools    │ Track 2                     │
│             │ Track 3                     │
├─────────────┴─────────────────────────────┤
│ Editor / Instrument UI / Piano Roll      │
├───────────────────────────────────────────┤
│ Mixer / Track Controls                    │
└───────────────────────────────────────────┘
```
Exact UI is not fixed here.

## Core Concepts
A project may contain tracks. Tracks may contain note-based or audio content. A bounded timeline region may be modeled as a clip.

Exact persisted types remain TBD.

## Real-Time Rule
Handle low-latency interaction client-side where practical:
- note playback,
- transport,
- volume/pan preview,
- metronome,
- basic effects.

Backend focuses on persistence, security, AI processing, and shared state.

## Beginner UX
Prefer:
- audible preview,
- visual comparison,
- direct actions,
- mood/energy language.

Examples:
- Make it sadder
- Make it happier
- Make it softer
- Make it more energetic
- Continue this melody
- Add rhythm
- Suggest an instrument

## Advanced Controls
**Status:** PROPOSED
- BPM
- key/scale
- velocity
- piano roll
- EQ
- gain/pan
- effects
- automation

## Editing Safety
Proposed:
- Undo/Redo
- Autosave
- recoverable user-created content
