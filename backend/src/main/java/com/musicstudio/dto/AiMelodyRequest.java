package com.musicstudio.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiMelodyRequest {
    private String prompt;
    private String mood; // "sadder", "happier", "energetic", "calmer"
    private String instrument; // PIANO, SYNTH, BASS, DRUMS, GUITAR, STRINGS
    private List<NoteEventDTO> baseMelody;
    private Double startBeat;
    private Double lengthBeats;
}
