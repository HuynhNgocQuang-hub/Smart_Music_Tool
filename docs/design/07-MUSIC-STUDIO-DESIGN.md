# Browser Music Studio Design

## Goal
Provide a real music-making environment in the browser while remaining understandable to beginners and powerful for producers.

## Conceptual Layout
```text
┌───────────────────────────────────────────┐
│ Transport: Play / Stop / Record / Tempo   │
├─────────────┬─────────────────────────────┤
│ Instruments │ Timeline / Arrangement      │
│ Samples     │ Track 1                     │
│ AI Tools    │ Track 2                     │
│ Voice Mic   │ Track 3                     │
├─────────────┴─────────────────────────────┤
│ Virtual Piano / Piano Roll Grid Editor    │
├───────────────────────────────────────────┤
│ Master FX (Lowpass, Reverb) / Mixer       │
└───────────────────────────────────────────┘
```

## Real-Time Rule
Handle low-latency interaction client-side:
- note playback (Web Audio API synthesizers),
- transport (16th-note resolution clock),
- volume/pan preview,
- metronome,
- Master FX (BiquadFilter, Convolver, Delay).

Backend handles persistence, security, AI processing, and shared state.
