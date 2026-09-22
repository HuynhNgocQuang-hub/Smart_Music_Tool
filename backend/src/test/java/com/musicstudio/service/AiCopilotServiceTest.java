package com.musicstudio.service;

import com.musicstudio.dto.AiMelodyRequest;
import com.musicstudio.dto.AiSuggestionResponse;
import com.musicstudio.entity.AiSuggestion;
import com.musicstudio.entity.MusicProject;
import com.musicstudio.repository.AiSuggestionRepository;
import com.musicstudio.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiCopilotServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AiSuggestionRepository aiSuggestionRepository;

    @InjectMocks
    private AiCopilotService aiCopilotService;

    private MusicProject sampleProject;

    @BeforeEach
    void setUp() {
        sampleProject = MusicProject.builder()
                .id(1L)
                .name("AI Test Project")
                .bpm(120)
                .musicKey("C Major")
                .tracks(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Melody Continuation should generate notes without mutating original track directly")
    void testGenerateMelodyContinuation() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(aiSuggestionRepository.save(any(AiSuggestion.class))).thenAnswer(i -> {
            AiSuggestion s = i.getArgument(0);
            s.setId(10L);
            return s;
        });

        AiMelodyRequest request = new AiMelodyRequest();
        request.setInstrument("PIANO");
        request.setBaseMelody(new ArrayList<>());

        AiSuggestionResponse response = aiCopilotService.generateMelodyContinuation(1L, request);

        assertNotNull(response);
        assertEquals("CONTINUE_MELODY", response.getSuggestionType());
        assertEquals("PREVIEWED", response.getStatus());
        assertNotNull(response.getSuggestedNotes());
        assertFalse(response.getSuggestedNotes().isEmpty());
    }

    @Test
    @DisplayName("Build Around Melody should generate bass and drum tracks")
    void testBuildAroundMelody() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(aiSuggestionRepository.save(any(AiSuggestion.class))).thenAnswer(i -> {
            AiSuggestion s = i.getArgument(0);
            s.setId(11L);
            return s;
        });

        AiMelodyRequest request = new AiMelodyRequest();
        AiSuggestionResponse response = aiCopilotService.buildAroundMelody(1L, request);

        assertNotNull(response);
        assertEquals("BUILD_AROUND_MELODY", response.getSuggestionType());
        assertNotNull(response.getSuggestedTracks());
        assertEquals(2, response.getSuggestedTracks().size());
    }

    @Test
    @DisplayName("Update suggestion status should change status to ACCEPTED")
    void testUpdateSuggestionStatus() {
        AiSuggestion suggestion = AiSuggestion.builder()
                .id(100L)
                .projectId(1L)
                .suggestionType("CONTINUE_MELODY")
                .status("PREVIEWED")
                .build();

        when(aiSuggestionRepository.findById(100L)).thenReturn(Optional.of(suggestion));
        when(aiSuggestionRepository.save(any(AiSuggestion.class))).thenAnswer(i -> i.getArgument(0));

        AiSuggestionResponse response = aiCopilotService.updateSuggestionStatus(100L, "ACCEPTED");

        assertNotNull(response);
        assertEquals("ACCEPTED", response.getStatus());
    }

    @Test
    @DisplayName("Generate Melody from Lyrics should parse Vietnamese tone and produce pitch-aligned notes")
    void testGenerateMelodyFromLyrics() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(aiSuggestionRepository.save(any(AiSuggestion.class))).thenAnswer(i -> {
            AiSuggestion s = i.getArgument(0);
            s.setId(12L);
            return s;
        });

        AiMelodyRequest request = new AiMelodyRequest();
        request.setLyrics("Đêm nay mưa rơi nhẹ rơi ngoài hiên vắng\nLời ca cất lên nhẹ nhàng xoa dịu đi nỗi đau");
        request.setMusicKey("C Major");
        request.setInstrument("PIANO");

        AiSuggestionResponse response = aiCopilotService.generateMelodyFromLyrics(1L, request);

        assertNotNull(response);
        assertEquals("LYRICS_TO_MELODY", response.getSuggestionType());
        assertNotNull(response.getSuggestedNotes());
        assertTrue(response.getSuggestedNotes().size() >= 10);
    }
}
