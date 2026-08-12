package com.musicstudio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "note_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clip_id", nullable = false)
    private Clip clip;

    @Column(nullable = false)
    private String pitch; // e.g. "C4", "G4", "A#3"

    @Column(nullable = false)
    private Double startTime; // offset inside clip

    @Column(nullable = false)
    private Double duration; // duration in beats

    @Column(nullable = false)
    private Integer velocity; // 0 to 127
}
