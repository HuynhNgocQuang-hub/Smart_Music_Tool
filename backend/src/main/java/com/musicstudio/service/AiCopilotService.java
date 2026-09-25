package com.musicstudio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstudio.dto.*;
import com.musicstudio.entity.AiSuggestion;
import com.musicstudio.entity.MusicProject;
import com.musicstudio.entity.Track;
import com.musicstudio.entity.Clip;
import com.musicstudio.entity.NoteEvent;
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
    private final GeminiService geminiService;

    private static final String[] MAJOR_SCALE = {"C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"};
    private static final String[] MINOR_SCALE = {"A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"};

    @Transactional
    public AiSuggestionResponse processNaturalLanguagePrompt(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        String rawPrompt = request.getPrompt() != null ? request.getPrompt() : "giai điệu chill";
        String prompt = rawPrompt.toLowerCase();
        String currentKey = request.getMusicKey() != null ? request.getMusicKey() : project.getMusicKey();
        if (currentKey == null) currentKey = "C Major";
        int currentBpm = request.getBpm() != null ? request.getBpm() : (project.getBpm() != null ? project.getBpm() : 120);

        String initialInstrument = request.getInstrument() != null ? request.getInstrument().toUpperCase() : "PIANO";
        if (prompt.contains("drum") || prompt.contains("trống")) initialInstrument = "DRUMS";
        else if (prompt.contains("bass") || prompt.contains("trầm")) initialInstrument = "BASS";
        else if (prompt.contains("guitar")) initialInstrument = "GUITAR";
        else if (prompt.contains("string") || prompt.contains("violin") || prompt.contains("dây")) initialInstrument = "STRINGS";
        else if (prompt.contains("synth") || prompt.contains("edm") || prompt.contains("điện tử")) initialInstrument = "SYNTH";

        // Try Google Gemini API if configured
        if (geminiService != null && geminiService.isConfigured()) {
            GeminiService.GeminiProducerResult geminiResult = geminiService.generateProducerResponse(
                    rawPrompt, currentKey, currentBpm, initialInstrument);
            if (geminiResult != null && geminiResult.getExplanation() != null && !geminiResult.getExplanation().isEmpty()) {
                return saveAiSuggestion(
                        projectId,
                        "GEMINI_PRODUCER",
                        geminiResult.getTargetInstrument() != null ? geminiResult.getTargetInstrument() : initialInstrument,
                        geminiResult.getExplanation(),
                        geminiResult.getNotes(),
                        null
                );
            }
        }

        List<NoteEventDTO> generatedNotes = new ArrayList<>();
        List<TrackDTO> generatedTracks = new ArrayList<>();

        // Intent 0: General Greeting & Copilot Capabilities Inquiry
        if (prompt.contains("giúp") || prompt.contains("chào") || prompt.contains("là ai") || 
            prompt.contains("hướng dẫn") || prompt.contains("bạn có thể") || prompt.contains("là gì")) {
            String explanation = "🤖 **Xin chào! Tôi là AI Music Copilot — Trợ lý Producer âm nhạc của bạn.**\n\n" +
                    "Tôi có thể hỗ trợ bạn các công việc sản xuất âm nhạc sau:\n\n" +
                    "* 🎵 **Sáng tạo giai điệu & Hợp âm**: Tạo giai điệu Piano, Drums, Bass, Synth, Guitar, Strings theo nhiều âm giai (Lofi, Jazz, Minor, EDM...)\n" +
                    "* ✍️ **Sáng tác lời ca & Gieo vần**: Gợi ý lời hát, gieo vần chân/vần lưng và phát triển cấu trúc bài hát (Verse/Chorus/Bridge)\n" +
                    "* 🎛️ **Tư vấn phối khí & Mixer**: Đề xuất cân bằng dải tần âm thanh và thông số hiệu ứng sound.\n\n" +
                    "💡 *Bạn hãy thử gõ: \"Tạo giai điệu Piano buồn\", \"Viết nhịp Drum Lofi 85 BPM\", hoặc \"Gợi ý lời ca cho Verse 1\" nhé!*";
            return saveAiSuggestion(projectId, "GENERAL_ASSISTANCE", "COPILOT", explanation, null, null);
        }

        // Intent 1: Lyric & Songwriting Assistance
        if (prompt.contains("lời") || prompt.contains("vần") || prompt.contains("sáng tác") || prompt.contains("ý tưởng")) {
            String explanation = "✍️ **AI Music Copilot — Tư vấn Lời ca & Gieo vần**:\n\n" +
                    "* **Tông & Nhịp bài hát**: " + currentKey + " • " + currentBpm + " BPM\n" +
                    "* **Gợi ý câu hát**: *\"Đêm nay mưa rơi nhẹ rơi ngoài hiên vắng...\"*\n" +
                    "* **Vần điệu kết hợp**: *vắng — trống — ngóng — mộng — đắng*\n" +
                    "* **Mẹo Producer**: Điệp khúc nên có từ 14-18 từ với nốt vươn cao ở câu thứ 3 để tạo điểm nhấn cảm xúc!";
            return saveAiSuggestion(projectId, "LYRIC_ASSISTANCE", "VOCAL", explanation, null, null);
        }

        // Intent 2: Mixing & Producer Advice Query
        if (prompt.contains("tại sao") || prompt.contains("khuyên") || prompt.contains("mix") || prompt.contains("tư vấn")) {
            String explanation = "🎛️ **Lời khuyên Phối khí & Mixer từ AI Producer**:\n\n" +
                    "* **Cấu trúc dải âm**: Kết hợp tiếng **Grand Piano** làm âm giai chủ đạo (" + currentKey + "), dải **Deep Bass** đi nền nốt C2-G2 và đệm tiếng **Drums Lofi** nhịp gõ 80-90 BPM.\n" +
                    "* **Master FX**: Bật bộ lọc *Lowpass Filter Cutoff* 12000Hz và *Reverb Space* 30% để âm thanh có không gian sâu hơn.";
            return saveAiSuggestion(projectId, "MIXING_ADVICE", "MASTER_FX", explanation, null, null);
        }

        // Intent 3: Context-Aware Melodic Composition
        String targetInstrument = request.getInstrument() != null ? request.getInstrument().toUpperCase() : "PIANO";
        if (prompt.contains("drum") || prompt.contains("trống")) targetInstrument = "DRUMS";
        else if (prompt.contains("bass") || prompt.contains("trầm")) targetInstrument = "BASS";
        else if (prompt.contains("guitar")) targetInstrument = "GUITAR";
        else if (prompt.contains("string") || prompt.contains("violin") || prompt.contains("dây")) targetInstrument = "STRINGS";
        else if (prompt.contains("synth") || prompt.contains("edm") || prompt.contains("điện tử")) targetInstrument = "SYNTH";

        String[] scale = getKeyScalePitches(currentKey);
        String scaleName = currentKey + " Scale";

        if (prompt.contains("jazz") || prompt.contains("blues")) {
            scale = new String[]{"C4", "D#4", "F4", "F#4", "G4", "A#4", "C5", "D#5"};
            scaleName = "Jazz Blues Scale";
        } else if (prompt.contains("lofi") || prompt.contains("chill") || prompt.contains("thư giãn")) {
            scale = new String[]{"C4", "E4", "G4", "B4", "D5", "F5", "G5"};
            scaleName = "Lofi 7th/9th Extended Scale";
        } else if (prompt.contains("buồn") || prompt.contains("sầu") || prompt.contains("sad") || prompt.contains("minor")) {
            scale = new String[]{"A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"};
            scaleName = "Natural Minor Scale";
        }

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
            int currentScaleIdx = (int)(Math.random() * scale.length);
            double currentBeat = 0.0;
            double totalBeats = 8.0;

            while (currentBeat < totalBeats) {
                int step = (int)(Math.random() * 5) - 2;
                currentScaleIdx = Math.max(0, Math.min(scale.length - 1, currentScaleIdx + step));
                String pitch = scale[currentScaleIdx];

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

        String explanation = "🎨 **AI Producer** đã phân tích đề xuất *\"" + rawPrompt + "\"* và khởi tạo **" + generatedNotes.size() + " nốt giai điệu độc bản** chuẩn tông **" + scaleName + "** (" + targetInstrument + ", " + currentBpm + " BPM).";

        return saveAiSuggestion(projectId, "NATURAL_LANGUAGE_PROMPT", targetInstrument, explanation, generatedNotes, generatedTracks);
    }

    @Transactional
    public AiSuggestionResponse generateHarmonyNotes(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        String key = project.getMusicKey() != null ? project.getMusicKey() : "C Major";
        String[] scale = getKeyScalePitches(key);

        List<NoteEventDTO> baseMelody = request.getBaseMelody();
        List<NoteEventDTO> harmonyNotes = new ArrayList<>();

        if (baseMelody != null && !baseMelody.isEmpty()) {
            for (NoteEventDTO n : baseMelody) {
                String harmonyPitch = getDiatonicHarmonyPitch(n.getPitch(), scale, 2); // 3rd interval
                harmonyNotes.add(NoteEventDTO.builder()
                        .pitch(harmonyPitch)
                        .startTime(n.getStartTime())
                        .duration(n.getDuration())
                        .velocity(Math.max(60, n.getVelocity() - 15))
                        .build());
            }
        } else {
            // Procedurally generate a 4-bar harmony motif in target key
            double time = 0.0;
            for (int i = 0; i < 4; i++) {
                int scaleIdx = (i * 2 + 2) % scale.length;
                double dur = (i % 2 == 0) ? 2.0 : 1.5;
                harmonyNotes.add(NoteEventDTO.builder()
                        .pitch(scale[scaleIdx])
                        .startTime(time)
                        .duration(dur)
                        .velocity(80 + (int)(Math.random() * 20))
                        .build());
                time += dur;
            }
        }

        String explanation = "AI đã tự động tạo lớp nốt bè hòa âm (Diatonic Harmony) theo âm giai " + key + " cho bản nhạc.";
        return saveAiSuggestion(projectId, "GENERATE_HARMONY", request.getInstrument() != null ? request.getInstrument() : "STRINGS", explanation, harmonyNotes, null);
    }

    @Transactional
    public AiSuggestionResponse generateSongArrangement(Long projectId) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        String targetKey = project.getMusicKey() != null ? project.getMusicKey() : "C Major";
        String[] scale = getKeyScalePitches(targetKey);
        List<TrackDTO> arrangedTracks = new ArrayList<>();

        // Procedural Chord Progression Generator (I - V - vi - IV or vi - IV - I - V)
        int[][] progressions = {
                {0, 4, 5, 3}, // I - V - vi - IV
                {5, 3, 0, 4}, // vi - IV - I - V
                {0, 3, 4, 0}  // I - IV - V - I
        };
        int[] chosenProg = progressions[(int)(Math.random() * progressions.length)];

        // 1. Procedural Piano Progression
        List<NoteEventDTO> pianoNotes = new ArrayList<>();
        double pTime = 0.0;
        for (int bar = 0; bar < 4; bar++) {
            int rootIdx = chosenProg[bar % chosenProg.length];
            int thirdIdx = (rootIdx + 2) % scale.length;
            int fifthIdx = (rootIdx + 4) % scale.length;

            pianoNotes.add(NoteEventDTO.builder().pitch(scale[rootIdx]).startTime(pTime).duration(2.0).velocity(95).build());
            pianoNotes.add(NoteEventDTO.builder().pitch(scale[thirdIdx]).startTime(pTime + 0.5).duration(1.5).velocity(85).build());
            pianoNotes.add(NoteEventDTO.builder().pitch(scale[fifthIdx]).startTime(pTime + 1.0).duration(1.0).velocity(90).build());
            pTime += 2.0;
        }

        TrackDTO piano = TrackDTO.builder()
                .name("Dynamic Piano Chords")
                .instrument("PIANO")
                .volume(85)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(ClipDTO.builder()
                        .name("AI Piano Chord Progression")
                        .startTime(0.0)
                        .duration(8.0)
                        .clipType("NOTE")
                        .noteEvents(pianoNotes)
                        .build()))
                .build();

        // 2. Ambient Strings Pad
        List<NoteEventDTO> stringNotes = new ArrayList<>();
        double sTime = 0.0;
        for (int bar = 0; bar < 4; bar++) {
            int rootIdx = chosenProg[bar % chosenProg.length];
            int fifthIdx = (rootIdx + 4) % scale.length;
            stringNotes.add(NoteEventDTO.builder().pitch(scale[fifthIdx]).startTime(sTime).duration(2.0).velocity(75).build());
            sTime += 2.0;
        }

        TrackDTO strings = TrackDTO.builder()
                .name("Chorus Ambient Strings")
                .instrument("STRINGS")
                .volume(75)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(List.of(ClipDTO.builder()
                        .name("Strings Pad")
                        .startTime(0.0)
                        .duration(8.0)
                        .clipType("NOTE")
                        .noteEvents(stringNotes)
                        .build()))
                .build();

        arrangedTracks.add(piano);
        arrangedTracks.add(strings);

        String explanation = "AI đã sáng tạo bố cục phối khí hoàn chỉnh (Intro -> Verse -> Chorus) trên âm giai " + targetKey + "!";
        return saveAiSuggestion(projectId, "SONG_ARRANGEMENT", "MULTI_INSTRUMENT", explanation, null, arrangedTracks);
    }

    @Transactional
    public AiSuggestionResponse generateMelodyContinuation(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        List<NoteEventDTO> baseMelody = request.getBaseMelody();
        List<NoteEventDTO> suggestedNotes = new ArrayList<>();

        double startBeat = 0.0;
        int lastScaleIdx = 3;
        if (baseMelody != null && !baseMelody.isEmpty()) {
            NoteEventDTO lastNote = baseMelody.get(baseMelody.size() - 1);
            startBeat = lastNote.getStartTime() + lastNote.getDuration();
        }

        String targetKey = project.getMusicKey() != null ? project.getMusicKey() : "C Major";
        String[] scale = getKeyScalePitches(targetKey);
        int scaleLen = scale.length;

        // Dynamic melodic phrase continuation generator
        double currentBeat = startBeat;
        int count = 6 + (int)(Math.random() * 4); // 6 to 9 notes

        for (int i = 0; i < count; i++) {
            int step = (int)(Math.random() * 5) - 2; // -2 to +2 step
            lastScaleIdx = Math.max(0, Math.min(scaleLen - 1, lastScaleIdx + step));

            double[] durPool = {0.5, 1.0, 0.75, 1.5, 0.5};
            double duration = durPool[(int)(Math.random() * durPool.length)];
            int velocity = 85 + (int)(Math.random() * 30);

            suggestedNotes.add(NoteEventDTO.builder()
                    .pitch(scale[lastScaleIdx])
                    .startTime(currentBeat)
                    .duration(duration)
                    .velocity(velocity)
                    .build());

            currentBeat += duration;
        }

        String explanation = "AI đã tiếp tục sáng tạo " + suggestedNotes.size() + " nốt nhạc theo xu hướng cảm xúc âm điệu " + targetKey + ".";
        return saveAiSuggestion(projectId, "CONTINUE_MELODY", request.getInstrument() != null ? request.getInstrument() : "PIANO", explanation, suggestedNotes, null);
    }

    @Transactional
    public AiSuggestionResponse buildAroundMelody(Long projectId, AiMelodyRequest request) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        String targetKey = project.getMusicKey() != null ? project.getMusicKey() : "C Major";
        String[] bassPitches = {"C2", "G2", "A2", "F2", "D2", "E2"};
        List<TrackDTO> suggestedTracks = new ArrayList<>();

        // 1. Procedural Bassline Generator
        List<NoteEventDTO> bassNotes = new ArrayList<>();
        double time = 0.0;
        for (int i = 0; i < 4; i++) {
            String p = bassPitches[(int)(Math.random() * bassPitches.length)];
            double dur = (i % 2 == 0) ? 2.0 : 1.5;
            bassNotes.add(NoteEventDTO.builder().pitch(p).startTime(time).duration(dur).velocity(105).build());
            time += 2.0;
        }

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

        // 2. Procedural Drum Beat Generator with Hi-hat variations
        List<NoteEventDTO> drumNotes = new ArrayList<>();
        for (double b = 0; b < 8.0; b += 0.5) {
            if (b % 1.0 == 0) {
                drumNotes.add(NoteEventDTO.builder().pitch("C2").startTime(b).duration(0.25).velocity(105 + (int)(Math.random() * 15)).build());
            }
            drumNotes.add(NoteEventDTO.builder().pitch("F#2").startTime(b).duration(0.25).velocity(70 + (int)(Math.random() * 20)).build());
            if (b % 2.0 == 1.0) {
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

        String explanation = "AI Copilot đã phối ngẫu hứng 2 track (Bass & Drums) chuẩn tông " + targetKey + " cho bài hát của bạn.";
        return saveAiSuggestion(projectId, "BUILD_AROUND_MELODY", "BASS_AND_DRUMS", explanation, null, suggestedTracks);
    }

    @Transactional
    public AiSuggestionResponse recommendInstruments(Long projectId) {
        String[] instPool = {"STRINGS", "SYNTH", "GUITAR"};
        String picked = instPool[(int)(Math.random() * instPool.length)];
        String explanation = "AI đề xuất phối thêm nhạc cụ '" + picked + "' giúp bản nhạc hòa âm phong phú và lôi cuốn hơn.";

        TrackDTO track = TrackDTO.builder()
                .name("AI Recommended " + picked)
                .instrument(picked)
                .volume(75)
                .pan(0)
                .muted(false)
                .solo(false)
                .clips(new ArrayList<>())
                .build();

        return saveAiSuggestion(projectId, "INSTRUMENT_RECOMMENDATION", picked, explanation, null, List.of(track));
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
                        .velocity((int)(n.getVelocity() * (0.9 + Math.random() * 0.2)))
                        .build());
            }
        }

        String explanation = "AI đã biến đổi giai điệu sang sắc thái cảm xúc: '" + mood.toUpperCase() + "'. Nghe thử trước khi Chấp nhận.";
        return saveAiSuggestion(projectId, "MOOD_VARIATION", request.getInstrument() != null ? request.getInstrument() : "PIANO", explanation, varied, null);
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public AiSuggestionResponse updateSuggestionStatus(Long suggestionId, String status) {
        AiSuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Suggestion not found: " + suggestionId));

        if (!"ACCEPTED".equalsIgnoreCase(status) && !"REJECTED".equalsIgnoreCase(status)) {
            status = "PREVIEWED";
        }

        suggestion.setStatus(status.toUpperCase());
        AiSuggestion saved = aiSuggestionRepository.save(suggestion);

        // If ACCEPTED, apply suggestion to the Project in database
        if ("ACCEPTED".equalsIgnoreCase(status) && saved.getPayloadJson() != null && !saved.getPayloadJson().isBlank()) {
            try {
                MusicProject project = projectRepository.findById(saved.getProjectId()).orElse(null);
                if (project != null) {
                    AiSuggestionPayload payload = objectMapper.readValue(saved.getPayloadJson(), AiSuggestionPayload.class);
                    if (payload.getSuggestedTracks() != null && !payload.getSuggestedTracks().isEmpty()) {
                        int order = project.getTracks() != null ? project.getTracks().size() : 0;
                        for (TrackDTO tDto : payload.getSuggestedTracks()) {
                            Track track = Track.builder()
                                    .project(project)
                                    .name(tDto.getName() != null ? tDto.getName() : "AI Track")
                                    .instrument(tDto.getInstrument() != null ? tDto.getInstrument() : "PIANO")
                                    .volume(tDto.getVolume() != null ? tDto.getVolume() : 80)
                                    .pan(tDto.getPan() != null ? tDto.getPan() : 0)
                                    .muted(false)
                                    .solo(false)
                                    .trackOrder(order++)
                                    .build();
                            if (tDto.getClips() != null) {
                                List<Clip> clips = new ArrayList<>();
                                for (ClipDTO cDto : tDto.getClips()) {
                                    Clip clip = Clip.builder()
                                            .track(track)
                                            .name(cDto.getName() != null ? cDto.getName() : "AI Clip")
                                            .startTime(cDto.getStartTime() != null ? cDto.getStartTime() : 0.0)
                                            .duration(cDto.getDuration() != null ? cDto.getDuration() : 8.0)
                                            .clipType("NOTE")
                                            .build();
                                    if (cDto.getNoteEvents() != null) {
                                        List<NoteEvent> notes = new ArrayList<>();
                                        for (NoteEventDTO nDto : cDto.getNoteEvents()) {
                                            notes.add(NoteEvent.builder()
                                                    .clip(clip)
                                                    .pitch(nDto.getPitch())
                                                    .startTime(nDto.getStartTime())
                                                    .duration(nDto.getDuration())
                                                    .velocity(nDto.getVelocity() != null ? nDto.getVelocity() : 100)
                                                    .build());
                                        }
                                        clip.setNoteEvents(notes);
                                    }
                                    clips.add(clip);
                                }
                                track.setClips(clips);
                            }
                            project.getTracks().add(track);
                        }
                        projectRepository.save(project);
                    } else if (payload.getSuggestedNotes() != null && !payload.getSuggestedNotes().isEmpty()) {
                        if (project.getTracks() == null) {
                            project.setTracks(new ArrayList<>());
                        }
                        if (project.getTracks().isEmpty()) {
                            Track defaultTrack = Track.builder()
                                    .project(project)
                                    .name("Grand Piano")
                                    .instrument("PIANO")
                                    .volume(85)
                                    .pan(0)
                                    .muted(false)
                                    .solo(false)
                                    .trackOrder(0)
                                    .clips(new ArrayList<>())
                                    .build();
                            project.getTracks().add(defaultTrack);
                        }
                        Track track = project.getTracks().get(0);
                        Clip clip = track.getClips() != null && !track.getClips().isEmpty() ? track.getClips().get(0) : null;
                        if (clip == null) {
                            clip = Clip.builder()
                                    .track(track)
                                    .name("AI Melody Clip")
                                    .startTime(0.0)
                                    .duration(8.0)
                                    .clipType("NOTE")
                                    .build();
                            if (track.getClips() == null) track.setClips(new ArrayList<>());
                            track.getClips().add(clip);
                        }
                        if (clip.getNoteEvents() == null) clip.setNoteEvents(new ArrayList<>());
                        for (NoteEventDTO nDto : payload.getSuggestedNotes()) {
                            clip.getNoteEvents().add(NoteEvent.builder()
                                    .clip(clip)
                                    .pitch(nDto.getPitch())
                                    .startTime(nDto.getStartTime())
                                    .duration(nDto.getDuration())
                                    .velocity(nDto.getVelocity() != null ? nDto.getVelocity() : 100)
                                    .build());
                        }
                        projectRepository.save(project);
                    }
                }
            } catch (Exception e) {
                // Log and ignore payload deserialization errors gracefully
            }
        }

        return AiSuggestionResponse.builder()
                .id(saved.getId())
                .projectId(saved.getProjectId())
                .suggestionType(saved.getSuggestionType())
                .targetInstrument(saved.getTargetInstrument())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional
    public AiSuggestionResponse generateMelodyFromLyrics(Long projectId, AiMelodyRequest request) {
        return processNaturalLanguagePrompt(projectId, request);
    }

    private String[] getKeyScalePitches(String key) {
        if (key != null && (key.toLowerCase().contains("minor") || key.toLowerCase().contains("m"))) {
            return MINOR_SCALE;
        }
        return MAJOR_SCALE;
    }

    private String getDiatonicHarmonyPitch(String pitch, String[] scale, int interval) {
        if (pitch == null || scale == null || scale.length == 0) return "E4";
        int idx = 0;
        for (int i = 0; i < scale.length; i++) {
            if (scale[i].equalsIgnoreCase(pitch)) {
                idx = i;
                break;
            }
        }
        return scale[(idx + interval) % scale.length];
    }

    private AiSuggestionResponse saveAiSuggestion(Long projectId, String type, String instrument, String explanation, List<NoteEventDTO> notes, List<TrackDTO> tracks) {
        String payloadJson = null;
        try {
            AiSuggestionPayload payload = new AiSuggestionPayload(notes, tracks);
            payloadJson = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            // Ignore Jackson serialization errors
        }

        AiSuggestion entity = AiSuggestion.builder()
                .projectId(projectId)
                .suggestionType(type)
                .targetInstrument(instrument)
                .payloadJson(payloadJson)
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

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class AiSuggestionPayload {
        private List<NoteEventDTO> suggestedNotes;
        private List<TrackDTO> suggestedTracks;
    }
}
