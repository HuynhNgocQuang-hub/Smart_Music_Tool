package com.musicstudio.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiMelodyRequest {
    private String prompt;
    private String lyrics;
    private String musicKey;
    private String mood; // "sadder", "happier", "energetic", "calmer", "pop", "ballad"
    private String instrument; // PIANO, SYNTH, BASS, DRUMS, GUITAR, STRINGS
    private Integer autoTuneLevel; // 0 to 100
    private Double speedTempo;
    private List<NoteEventDTO> baseMelody;
    private Integer bpm;
    private List<String> activeTrackNames;
    private Double startBeat;
    private Double lengthBeats;
}
