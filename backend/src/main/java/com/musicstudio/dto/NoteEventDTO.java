package com.musicstudio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteEventDTO {
    private Long id;
    private String pitch;
    private Double startTime;
    private Double duration;
    private Integer velocity;
}
