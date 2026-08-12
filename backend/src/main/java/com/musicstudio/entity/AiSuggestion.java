package com.musicstudio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_suggestions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private String suggestionType; // CONTINUE_MELODY, BUILD_AROUND_MELODY, INSTRUMENT_RECOMMENDATION, MOOD_VARIATION

    private String targetInstrument;

    @Column(columnDefinition = "TEXT")
    private String payloadJson; // Generated notes or recommendation data

    @Column(nullable = false)
    private String status; // PREVIEWED, ACCEPTED, REJECTED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "PREVIEWED";
    }
}
