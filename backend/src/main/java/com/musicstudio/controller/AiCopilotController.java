package com.musicstudio.controller;

import com.musicstudio.dto.AiMelodyRequest;
import com.musicstudio.dto.AiSuggestionResponse;
import com.musicstudio.service.AiCopilotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/ai")
@RequiredArgsConstructor
public class AiCopilotController {

    private final AiCopilotService aiCopilotService;

    @PostMapping("/natural-language")
    public ResponseEntity<AiSuggestionResponse> naturalLanguagePrompt(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.processNaturalLanguagePrompt(projectId, request));
    }

    @PostMapping("/lyrics-to-melody")
    public ResponseEntity<AiSuggestionResponse> generateMelodyFromLyrics(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.generateMelodyFromLyrics(projectId, request));
    }

    @PostMapping("/harmony")
    public ResponseEntity<AiSuggestionResponse> generateHarmony(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.generateHarmonyNotes(projectId, request));
    }

    @PostMapping("/arrangement")
    public ResponseEntity<AiSuggestionResponse> generateArrangement(@PathVariable Long projectId) {
        return ResponseEntity.ok(aiCopilotService.generateSongArrangement(projectId));
    }

    @PostMapping("/continue-melody")
    public ResponseEntity<AiSuggestionResponse> continueMelody(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.generateMelodyContinuation(projectId, request));
    }

    @PostMapping("/build-around-melody")
    public ResponseEntity<AiSuggestionResponse> buildAroundMelody(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.buildAroundMelody(projectId, request));
    }

    @GetMapping("/recommend-instruments")
    public ResponseEntity<AiSuggestionResponse> recommendInstruments(@PathVariable Long projectId) {
        return ResponseEntity.ok(aiCopilotService.recommendInstruments(projectId));
    }

    @PostMapping("/mood-variation")
    public ResponseEntity<AiSuggestionResponse> moodVariation(
            @PathVariable Long projectId,
            @RequestBody AiMelodyRequest request) {
        return ResponseEntity.ok(aiCopilotService.generateMoodVariation(projectId, request));
    }

    @PutMapping("/suggestions/{suggestionId}/status")
    public ResponseEntity<AiSuggestionResponse> updateSuggestionStatus(
            @PathVariable Long projectId,
            @PathVariable Long suggestionId,
            @RequestParam String status) {
        return ResponseEntity.ok(aiCopilotService.updateSuggestionStatus(suggestionId, status));
    }
}
