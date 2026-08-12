# Music Domain Skill

## Purpose
Use for browser studio, tracks, clips, instruments, recording, playback state, timeline, and export.

## Product Rule
Basic creation must remain understandable to users with little/no music theory.

## Preserve User Content
Do not silently replace recordings, melodies, clips, or arrangements. Derived/AI-assisted versions must preserve recoverable source material when applicable.

## Core Concepts
Potential: MusicProject, Track, Clip, Instrument, Note Event, Audio Asset. Use only the approved actual data model.

## Real-Time Interaction
Avoid API calls for every note, volume drag, playhead movement, or metronome tick. Prefer client-side real-time processing where practical.

## Timeline
Explicitly define position, duration, ordering, overlap policy, and time unit. Never guess whether the system uses seconds, beats, ticks, or samples.

## Instruments
Distinguish instrument definition, selected track instrument, and sound preset if architecture needs them. Avoid a huge hardcoded list if instruments should be data-driven.

## Recording
Handle permission denied, no input, cancellation, maximum duration, upload failure, processing failure. Limits come from approved config.

## Beginner UX
Prefer terms like softer, stronger, sadder, happier, more energetic, continue, add rhythm. Technical controls may exist separately.

## Export
Define supported format, render location (browser/server), project snapshot, and failure behavior before implementation.
