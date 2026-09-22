package com.musicstudio.controller;

import com.musicstudio.dto.ClipDTO;
import com.musicstudio.dto.TrackDTO;
import com.musicstudio.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @PostMapping
    public ResponseEntity<TrackDTO> addTrack(
            @PathVariable Long projectId,
            @RequestBody TrackDTO trackDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackService.addTrackToProject(projectId, trackDTO));
    }

    @PutMapping("/{trackId}")
    public ResponseEntity<TrackDTO> updateTrack(
            @PathVariable Long projectId,
            @PathVariable Long trackId,
            @RequestBody TrackDTO trackDTO) {
        return ResponseEntity.ok(trackService.updateTrack(projectId, trackId, trackDTO));
    }

    @DeleteMapping("/{trackId}")
    public ResponseEntity<Void> deleteTrack(
            @PathVariable Long projectId,
            @PathVariable Long trackId) {
        trackService.deleteTrack(projectId, trackId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{trackId}/clips")
    public ResponseEntity<TrackDTO> addClipToTrack(
            @PathVariable Long projectId,
            @PathVariable Long trackId,
            @RequestBody ClipDTO clipDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackService.addClipToTrack(projectId, trackId, clipDTO));
    }
}
