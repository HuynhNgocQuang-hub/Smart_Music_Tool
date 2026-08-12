package com.musicstudio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSuggestionResponse {
    private Long id;
    private Long projectId;
    private String suggestionType;
    private String targetInstrument;
    private String explanation;
    private List<TrackDTO> suggestedTracks;
    private List<NoteEventDTO> suggestedNotes;
    private String status; // PREVIEWED, ACCEPTED, REJECTED
    private LocalDateTime createdAt;
}
