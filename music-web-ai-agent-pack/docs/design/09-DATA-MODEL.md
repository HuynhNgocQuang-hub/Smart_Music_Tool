# Data Model Draft

This is conceptual, not an approved DB schema. Do not create tables/entities solely because they appear here.

## Candidate Concepts

### User
Authenticated platform user.

### MusicProject
Potential: id, ownerId, name, createdAt, updatedAt.

### Track
Potential: id, projectId, name, ordering, volume, muted, solo.

### Instrument
Could represent library definition, selected track instrument, preset, or a combination. TBD.

### Clip
Potential bounded timeline content: note-based clip or audio clip.

### NoteEvent
Potential: pitch, start, duration, velocity. Do not assume MIDI persistence until approved.

### AudioAsset
Potential: recording, sample, generated audio, rendered preview. Prefer appropriate audio/object storage rather than large DB blobs unless intentionally designed otherwise.

### AISuggestion
Potential: project/region target, request type, result reference, acceptance outcome, created time.

### UserMusicPreference
**Status:** PROPOSED
Contextual preference signal storage.

## Conceptual Relationship
```text
User
 └─ MusicProject
     ├─ Track
     │   └─ Clip
     │       ├─ NoteEvent
     │       └─ AudioAsset reference
     └─ AI Suggestion
```

## Concurrency Questions
Define later:
- project revision/versioning,
- stale update behavior,
- AI suggestion target revision.

## Open Questions
- normalized tables vs project serialization,
- timeline units,
- note representation,
- audio storage,
- project history,
- preference storage,
- AI suggestion persistence,
- collaboration model.
