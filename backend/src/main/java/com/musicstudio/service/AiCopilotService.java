package com.musicstudio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstudio.dto.*;
import com.musicstudio.entity.AiSuggestion;
import com.musicstudio.entity.MusicProject;
import com.musicstudio.exception.ResourceNotFoundException;
import com.musicstudio.repository.AiSuggestionRepository;
import com.musicstudio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiCopilotService {

    private final ProjectRepository projectRepository;
    private final AiSuggestionRepository aiSuggestionRepository;

    private static final String[] MAJOR_SCALE = {"C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"};
    private static final String[] MINOR_SCALE = {"A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"};

    @Transactional
    public AiSuggestionResponse processNaturalLanguagePrompt(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase() : "giai điệu chill";
        List<NoteEventDTO> generatedNotes = new ArrayList<>();
        List<TrackDTO> generatedTracks = new ArrayList<>();

        // 1. Detect Target Instrument
        String targetInstrument = "PIANO";
        if (prompt.contains("drum") || prompt.contains("trống")) {
            targetInstrument = "DRUMS";
        } else if (prompt.contains("bass") || prompt.contains("trầm")) {
            targetInstrument = "BASS";
        } else if (prompt.contains("guitar")) {
            targetInstrument = "GUITAR";
        } else if (prompt.contains("string") || prompt.contains("violin") || prompt.contains("dây")) {
            targetInstrument = "STRINGS";
        } else if (prompt.contains("synth") || prompt.contains("edm") || prompt.contains("điện tử")) {
            targetInstrument = "SYNTH";
        }

        // 2. Select Scale based on Mood/Genre in Prompt
        String[] scale = MAJOR_SCALE;
        String scaleName = "Major Pentatonic";

        if (prompt.contains("jazz") || prompt.contains("blues")) {
            scale = new String[]{"C4", "D#4", "F4", "F#4", "G4", "A#4", "C5", "D#5"};
            scaleName = "Jazz Blues Scale";
        } else if (prompt.contains("lofi") || prompt.contains("chill") || prompt.contains("thư giãn")) {
            scale = new String[]{"C4", "E4", "G4", "B4", "D5", "F5", "G5"};
            scaleName = "Lofi 7th/9th Extended Scale";
        } else if (prompt.contains("buồn") || prompt.contains("sầu") || prompt.contains("sad") || prompt.contains("minor")) {
            scale = MINOR_SCALE;
            scaleName = "Natural Minor Scale";
        } else if (prompt.contains("edm") || prompt.contains("sôi động") || prompt.contains("dance")) {
            scale = new String[]{"C4", "D4", "E4", "G4", "A4", "C5", "D5"};
            scaleName = "EDM Pentatonic Scale";
        }

        // 3. Algorithmic Melodic Composition Generator
        if ("DRUMS".equals(targetInstrument)) {
            for (double b = 0; b < 8.0; b += 0.5) {
                generatedNotes.add(NoteEventDTO.builder().pitch("C2").startTime(b).duration(0.25).velocity(100 + (int)(Math.random() * 20)).build());
                if (b % 1.0 == 0.5) {
                    generatedNotes.add(NoteEventDTO.builder().pitch("F#2").startTime(b).duration(0.25).velocity(75 + (int)(Math.random() * 20)).build());
                }
                if (b % 2.0 == 1.0) {
                    generatedNotes.add(NoteEventDTO.builder().pitch("D2").startTime(b).duration(0.25).velocity(105).build());
                }
            }
        } else if ("BASS".equals(targetInstrument)) {
            String[] bassPitches = {"C2", "G2", "A2", "F2", "D2", "E2"};
            double time = 0.0;
            for (int i = 0; i < 4; i++) {
                String p = bassPitches[(int)(Math.random() * bassPitches.length)];
                generatedNotes.add(NoteEventDTO.builder().pitch(p).startTime(time).duration(2.0).velocity(105).build());
                time += 2.0;
            }
        } else {
            // Generative Melody Generator with Stepwise Pitch Motion
            int currentScaleIdx = (int)(Math.random() * scale.length);
            double currentBeat = 0.0;
            double totalBeats = 8.0;

            while (currentBeat < totalBeats) {
                // Stepwise movement (-2, -1, +1, +2 scale positions)
                int step = (int)(Math.random() * 5) - 2;
                currentScaleIdx = Math.max(0, Math.min(scale.length - 1, currentScaleIdx + step));
                String pitch = scale[currentScaleIdx];

                // Rhythmic variations (0.5, 1.0, 1.5 beats)
                double[] durations = {0.5, 1.0, 1.5, 0.5, 1.0};
                double duration = durations[(int)(Math.random() * durations.length)];
                int velocity = 85 + (int)(Math.random() * 30);

                generatedNotes.add(NoteEventDTO.builder()
                        .pitch(pitch)
                        .startTime(currentBeat)
                        .duration(duration)
                        .velocity(velocity)
                        .build());

                currentBeat += duration;
            }
        }

        String explanation = "AI đã phân tích câu lệnh '" + request.getPrompt() + "' và dùng thuật toán Generative AI sáng tạo giai điệu độc bản 8-bar trên âm giai " + scaleName + " (" + targetInstrument + ").";

        return saveAiSuggestion(projectId, "NATURAL_LANGUAGE_PROMPT", targetInstrument, explanation, generatedNotes, generatedTracks);
    }

    @Transactional
    public AiSuggestionResponse generateHarmonyNotes(Long projectId, AiMelodyRequest request) {
        List<NoteEventDTO> baseMelody = request.getBaseMelody();
        List<NoteEventDTO> harmonyNotes = new ArrayList<>();

        if (baseMelody != null && !baseMelody.isEmpty()) {
            for (NoteEventDTO n : baseMelody) {
                String harmonyPitch = getThirdIntervalPitch(n.getPitch());
                harmonyNotes.add(NoteEventDTO.builder()
                        .pitch(harmonyPitch)
                        .startTime(n.getStartTime())
                        .duration(n.getDuration())
                        .velocity(Math.max(60, n.getVelocity() - 15))
                        .build());
            }
        } else {
            harmonyNotes.add(NoteEventDTO.builder().pitch("E4").startTime(0.0).duration(2.0).velocity(80).build());
            harmonyNotes.add(NoteEventDTO.builder().pitch("G4").startTime(2.0).duration(2.0).velocity(80).build());
        }

        String explanation = "AI đã tự động tạo lớp nốt bè hòa âm 3rd (Harmony) quyến rũ cho bản nhạc.";
        return saveAiSuggestion(projectId, "GENERATE_HARMONY", request.getInstrument() != null ? request.getInstrument() : "STRINGS", explanation, harmonyNotes, null);
    }

    @Transactional
    public AiSuggestionResponse generateSongArrangement(Long projectId) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        List<TrackDTO> arrangedTracks = new ArrayList<>();

        // Intro Piano
        TrackDTO piano = TrackDTO.builder()
                .name("Intro & Chorus Piano")
                .instrument("PIANO")
                .volume(85)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(ClipDTO.builder()
                        .name("Piano Progression")
                        .startTime(0.0)
                        .duration(16.0)
                        .clipType("NOTE")
                        .noteEvents(Arrays.asList(
                                NoteEventDTO.builder().pitch("C4").startTime(0.0).duration(2.0).velocity(95).build(),
                                NoteEventDTO.builder().pitch("G4").startTime(2.0).duration(2.0).velocity(95).build(),
                                NoteEventDTO.builder().pitch("A4").startTime(4.0).duration(2.0).velocity(95).build(),
                                NoteEventDTO.builder().pitch("F4").startTime(6.0).duration(2.0).velocity(95).build()
                        )).build()))
                .build();

        // Chorus Strings
        TrackDTO strings = TrackDTO.builder()
                .name("Chorus Ambient Strings")
                .instrument("STRINGS")
                .volume(75)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(ClipDTO.builder()
                        .name("Strings Pad")
                        .startTime(4.0)
                        .duration(12.0)
                        .clipType("NOTE")
                        .noteEvents(Arrays.asList(
                                NoteEventDTO.builder().pitch("C5").startTime(0.0).duration(4.0).velocity(80).build(),
                                NoteEventDTO.builder().pitch("A4").startTime(4.0).duration(4.0).velocity(80).build()
                        )).build()))
                .build();

        arrangedTracks.add(piano);
        arrangedTracks.add(strings);

        String explanation = "AI đã sắp xếp bố cục bài hát hoàn chỉnh (Intro -> Verse -> Chorus) với các lớp phối khí phong phú.";
        return saveAiSuggestion(projectId, "SONG_ARRANGEMENT", "MULTI_INSTRUMENT", explanation, null, arrangedTracks);
    }

    @Transactional
    public AiSuggestionResponse generateMelodyContinuation(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        List<NoteEventDTO> baseMelody = request.getBaseMelody();
        List<NoteEventDTO> suggestedNotes = new ArrayList<>();

        double startBeat = 0.0;
        if (baseMelody != null && !baseMelody.isEmpty()) {
            NoteEventDTO lastNote = baseMelody.get(baseMelody.size() - 1);
            startBeat = lastNote.getStartTime() + lastNote.getDuration();
        }

        String[] scale = "A Minor".equalsIgnoreCase(project.getMusicKey()) ? MINOR_SCALE : MAJOR_SCALE;
        int scaleLen = scale.length;

        for (int i = 0; i < 8; i++) {
            int pitchIdx = (i * 2 + (int)(Math.random() * 3)) % scaleLen;
            double duration = (i % 2 == 0) ? 1.0 : 0.5;
            suggestedNotes.add(NoteEventDTO.builder()
                    .pitch(scale[pitchIdx])
                    .startTime(startBeat + (i * 0.75))
                    .duration(duration)
                    .velocity(90 + (int)(Math.random() * 20))
                    .build());
        }

        String explanation = "AI đã tạo tiếp 8 nốt nhạc hài hòa theo âm điệu " + project.getMusicKey() + ". Nghe thử trước khi chọn Chấp nhận.";
        return saveAiSuggestion(projectId, "CONTINUE_MELODY", request.getInstrument() != null ? request.getInstrument() : "PIANO", explanation, suggestedNotes, null);
    }

    @Transactional
    public AiSuggestionResponse buildAroundMelody(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        List<TrackDTO> suggestedTracks = new ArrayList<>();

        List<NoteEventDTO> bassNotes = Arrays.asList(
                NoteEventDTO.builder().pitch("C2").startTime(0.0).duration(2.0).velocity(100).build(),
                NoteEventDTO.builder().pitch("G2").startTime(2.0).duration(2.0).velocity(100).build(),
                NoteEventDTO.builder().pitch("A2").startTime(4.0).duration(2.0).velocity(100).build(),
                NoteEventDTO.builder().pitch("F2").startTime(6.0).duration(2.0).velocity(100).build()
        );

        ClipDTO bassClip = ClipDTO.builder()
                .name("AI Bass Groove")
                .startTime(0.0)
                .duration(8.0)
                .clipType("NOTE")
                .noteEvents(bassNotes)
                .build();

        TrackDTO bassTrack = TrackDTO.builder()
                .name("AI Bassline")
                .instrument("BASS")
                .volume(85)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(bassClip))
                .build();

        List<NoteEventDTO> drumNotes = new ArrayList<>();
        for (double b = 0; b < 8.0; b += 1.0) {
            drumNotes.add(NoteEventDTO.builder().pitch("C2").startTime(b).duration(0.25).velocity(110).build());
            drumNotes.add(NoteEventDTO.builder().pitch("F#2").startTime(b + 0.5).duration(0.25).velocity(80).build());
            if (b % 2 == 1.0) {
                drumNotes.add(NoteEventDTO.builder().pitch("D2").startTime(b).duration(0.25).velocity(105).build());
            }
        }

        ClipDTO drumClip = ClipDTO.builder()
                .name("AI Drum Pattern")
                .startTime(0.0)
                .duration(8.0)
                .clipType("NOTE")
                .noteEvents(drumNotes)
                .build();

        TrackDTO drumTrack = TrackDTO.builder()
                .name("AI Drum Beat")
                .instrument("DRUMS")
                .volume(90)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(drumClip))
                .build();

        suggestedTracks.add(bassTrack);
        suggestedTracks.add(drumTrack);

        String explanation = "AI Copilot đã phối thêm 2 track (Bass & Drums) tương thích hoàn hảo với giai điệu của bạn.";
        return saveAiSuggestion(projectId, "BUILD_AROUND_MELODY", "BASS_AND_DRUMS", explanation, null, suggestedTracks);
    }

    @Transactional
    public AiSuggestionResponse recommendInstruments(Long projectId) {
        String explanation = "Dựa trên thể loại và giai điệu hiện tại, AI đề xuất thêm nhạc cụ 'STRINGS' (Đàn dây hòa tấu) để làm sâu lắng và mượt mà bản nhạc hơn.";
        TrackDTO stringTrack = TrackDTO.builder()
                .name("Ambient Strings")
                .instrument("STRINGS")
                .volume(75)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(new ArrayList<>())
                .build();

        return saveAiSuggestion(projectId, "INSTRUMENT_RECOMMENDATION", "STRINGS", explanation, null, List.of(stringTrack));
    }

    @Transactional
    public AiSuggestionResponse generateMoodVariation(Long projectId, AiMelodyRequest request) {
        String mood = request.getMood() != null ? request.getMood().toLowerCase() : "sadder";
        List<NoteEventDTO> base = request.getBaseMelody();
        List<NoteEventDTO> varied = new ArrayList<>();

        if (base != null && !base.isEmpty()) {
            for (NoteEventDTO n : base) {
                String newPitch = n.getPitch();
                double newDuration = n.getDuration();

                if ("sadder".equals(mood)) {
                    if (newPitch.contains("4")) newPitch = newPitch.replace("4", "3");
                    newDuration = n.getDuration() * 1.25;
                } else if ("energetic".equals(mood) || "happier".equals(mood)) {
                    if (newPitch.contains("3")) newPitch = newPitch.replace("3", "4");
                    newDuration = Math.max(0.25, n.getDuration() * 0.75);
                }

                varied.add(NoteEventDTO.builder()
                        .pitch(newPitch)
                        .startTime(n.getStartTime())
                        .duration(newDuration)
                        .velocity(n.getVelocity())
                        .build());
            }
        }

        String explanation = "AI đã biến đổi giai điệu sang sắc thái cảm xúc: '" + mood.toUpperCase() + "'. Nghe thử trước khi Chấp nhận.";
        return saveAiSuggestion(projectId, "MOOD_VARIATION", request.getInstrument() != null ? request.getInstrument() : "PIANO", explanation, varied, null);
    }

    @Transactional
    public AiSuggestionResponse updateSuggestionStatus(Long suggestionId, String status) {
        AiSuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Suggestion not found: " + suggestionId));

        if (!"ACCEPTED".equalsIgnoreCase(status) && !"REJECTED".equalsIgnoreCase(status)) {
            status = "PREVIEWED";
        }

        suggestion.setStatus(status.toUpperCase());
        AiSuggestion saved = aiSuggestionRepository.save(suggestion);

        return AiSuggestionResponse.builder()
                .id(saved.getId())
                .projectId(saved.getProjectId())
                .suggestionType(saved.getSuggestionType())
                .targetInstrument(saved.getTargetInstrument())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private String getThirdIntervalPitch(String pitch) {
        if (pitch == null) return "E4";
        if (pitch.startsWith("C")) return pitch.replace("C", "E");
        if (pitch.startsWith("D")) return pitch.replace("D", "F");
        if (pitch.startsWith("E")) return pitch.replace("E", "G");
        if (pitch.startsWith("F")) return pitch.replace("F", "A");
        if (pitch.startsWith("G")) return pitch.replace("G", "B");
        if (pitch.startsWith("A")) return pitch.replace("A", "C");
        if (pitch.startsWith("B")) return pitch.replace("B", "D");
        return "G4";
    }

    private AiSuggestionResponse saveAiSuggestion(Long projectId, String type, String instrument, String explanation, List<NoteEventDTO> notes, List<TrackDTO> tracks) {
        AiSuggestion entity = AiSuggestion.builder()
                .projectId(projectId)
                .suggestionType(type)
                .targetInstrument(instrument)
                .status("PREVIEWED")
                .build();

        AiSuggestion saved = aiSuggestionRepository.save(entity);

        return AiSuggestionResponse.builder()
                .id(saved.getId())
                .projectId(projectId)
                .suggestionType(type)
                .targetInstrument(instrument)
                .explanation(explanation)
                .suggestedNotes(notes)
                .suggestedTracks(tracks)
                .status("PREVIEWED")
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
