package com.musicstudio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClipDTO {
    private Long id;
    private String name;
    private Double startTime;
    private Double duration;
    private String clipType;
    private String audioAssetUrl;
    private List<NoteEventDTO> noteEvents;
}
