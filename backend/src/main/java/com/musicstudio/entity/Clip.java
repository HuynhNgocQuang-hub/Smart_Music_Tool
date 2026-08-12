package com.musicstudio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    private String name;

    @Column(nullable = false)
    private Double startTime; // start time in beats/seconds

    @Column(nullable = false)
    private Double duration; // duration in beats/seconds

    @Column(nullable = false)
    private String clipType; // NOTE or AUDIO

    private String audioAssetUrl;

    @Builder.Default
    @OneToMany(mappedBy = "clip", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startTime ASC")
    private List<NoteEvent> noteEvents = new ArrayList<>();
}
