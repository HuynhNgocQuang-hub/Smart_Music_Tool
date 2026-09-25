package com.musicstudio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstudio.dto.NoteEventDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-1.5-flash}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiProducerResult {
        private String explanation;
        private String targetInstrument;
        private List<NoteEventDTO> notes;
    }

    public GeminiProducerResult generateProducerResponse(String prompt, String musicKey, int bpm, String targetInstrument) {
        if (!isConfigured()) {
            return null;
        }

        try {
            String systemPrompt = String.format(
                "Bạn là AI Music Producer & Songwriter chuyên nghiệp trên ứng dụng AURA Music Studio.\n" +
                "Phân tích ngữ cảnh dự án âm nhạc:\n" +
                "- Tông nhạc (Key): %s\n" +
                "- Tốc độ nhịp (BPM): %d\n" +
                "- Nhạc cụ mục tiêu: %s\n" +
                "- Đề xuất của người dùng: \"%s\"\n\n" +
                "Nhiệm vụ:\n" +
                "1. Trả lời tự nhiên, thân thiện bằng tiếng Việt chuẩn vai trò AI Producer âm nhạc.\n" +
                "2. Nếu người dùng hỏi câu hỏi giao tiếp thông thường (ví dụ: \"bạn có thể giúp gì\", \"chào bạn\", \"bạn là ai\"), hãy giới thiệu bản thân và các tính năng trợ giúp (sáng tạo giai điệu, viết lời ca, gieo vần, tư vấn phối khí) một cách lịch sự, cuốn hút. Để mảng \"notes\" là [] (mảng rỗng).\n" +
                "3. Nếu người dùng yêu cầu tạo giai điệu/hợp âm/nhạc cụ, hãy tư vấn + trả về 4-12 nốt nhạc phù hợp tông %s trong mảng \"notes\".\n" +
                "4. Trả về ĐÚNG cấu trúc JSON (không bọc trong markdown ```json):\n" +
                "{\n" +
                "  \"explanation\": \"Nội dung trả lời tiếng Việt sắc sảo (dùng markdown **bold**, *italic*, danh sách)\",\n" +
                "  \"targetInstrument\": \"PIANO|DRUMS|BASS|SYNTH|GUITAR|STRINGS\",\n" +
                "  \"notes\": [\n" +
                "    {\"pitch\": \"C4\", \"startTime\": 0.0, \"duration\": 0.5, \"velocity\": 90}\n" +
                "  ]\n" +
                "}",
                musicKey != null ? musicKey : "C Major",
                bpm > 0 ? bpm : 120,
                targetInstrument != null ? targetInstrument : "PIANO",
                prompt != null ? prompt : "Xin chào",
                musicKey != null ? musicKey : "C Major"
            );

            String requestBody = objectMapper.writeValueAsString(
                Map.of("contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", systemPrompt)
                    ))
                ))
            );

            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(12))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    String rawContent = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                    return parseGeminiTextToResult(rawContent, targetInstrument);
                }
            } else {
                System.err.println("Gemini API Status Error: " + response.statusCode() + " - " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Gemini API call warning: " + e.getMessage());
        }

        return null;
    }

    private GeminiProducerResult parseGeminiTextToResult(String text, String fallbackInstrument) {
        if (text == null) return null;
        String cleanJson = text.trim();
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }
        cleanJson = cleanJson.trim();

        try {
            JsonNode json = objectMapper.readTree(cleanJson);
            String explanation = json.path("explanation").asText(text);
            String inst = json.path("targetInstrument").asText(fallbackInstrument);
            
            List<NoteEventDTO> notes = new ArrayList<>();
            JsonNode notesArray = json.path("notes");
            if (notesArray.isArray()) {
                for (JsonNode n : notesArray) {
                    String pitch = n.path("pitch").asText("C4");
                    double startTime = n.path("startTime").asDouble(0.0);
                    double duration = n.path("duration").asDouble(0.5);
                    int velocity = n.path("velocity").asInt(90);

                    notes.add(NoteEventDTO.builder()
                            .pitch(pitch)
                            .startTime(startTime)
                            .duration(duration)
                            .velocity(velocity)
                            .build());
                }
            }

            return GeminiProducerResult.builder()
                    .explanation(explanation)
                    .targetInstrument(inst != null && !inst.isEmpty() ? inst : fallbackInstrument)
                    .notes(notes)
                    .build();
        } catch (Exception e) {
            return GeminiProducerResult.builder()
                    .explanation(text)
                    .targetInstrument(fallbackInstrument)
                    .notes(new ArrayList<>())
                    .build();
        }
    }
}
