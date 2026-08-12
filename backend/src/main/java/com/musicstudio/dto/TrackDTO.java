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
public class TrackDTO {
    private Long id;
    private String name;
    private String instrument;
    private Integer volume;
    private Integer pan;
    private Boolean muted;
    private Boolean solo;
    private Integer trackOrder;
    private List<ClipDTO> clips;
}
