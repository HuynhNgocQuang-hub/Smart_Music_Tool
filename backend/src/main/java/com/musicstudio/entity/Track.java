package com.musicstudio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private MusicProject project;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String instrument; // PIANO, SYNTH, BASS, DRUMS, GUITAR, STRINGS

    @Column(nullable = false)
    private Integer volume; // 0 to 100

    @Column(nullable = false)
    private Integer pan; // -50 to +50

    @Column(nullable = false)
    private Boolean muted;

    @Column(nullable = false)
    private Boolean solo;

    @Column(nullable = false)
    private Integer trackOrder;

    @Builder.Default
    @OneToMany(mappedBy = "track", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startTime ASC")
    private List<Clip> clips = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.volume == null) this.volume = 80;
        if (this.pan == null) this.pan = 0;
        if (this.muted == null) this.muted = false;
        if (this.solo == null) this.solo = false;
        if (this.trackOrder == null) this.trackOrder = 0;
    }
}
