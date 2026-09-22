package com.musicstudio.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Project name must not be blank")
    @Size(max = 100, message = "Project name cannot exceed 100 characters")
    private String name;

    private String description;

    @Min(value = 40, message = "BPM must be at least 40")
    @Max(value = 240, message = "BPM cannot exceed 240")
    private Integer bpm = 120;

    private String musicKey = "C Major";

    private java.util.List<TrackDTO> tracks;
}
