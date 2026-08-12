package com.musicstudio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "music_projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MusicProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Integer bpm;

    @Column(nullable = false)
    private String musicKey; // e.g. "C Major", "A Minor"

    @Column(nullable = false)
    private String ownerId; // Default user / system owner

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("trackOrder ASC")
    private List<Track> tracks = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.bpm == null) this.bpm = 120;
        if (this.musicKey == null) this.musicKey = "C Major";
        if (this.ownerId == null) this.ownerId = "user_default";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
