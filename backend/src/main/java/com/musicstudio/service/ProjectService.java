package com.musicstudio.service;

import com.musicstudio.dto.*;
import com.musicstudio.entity.*;
import com.musicstudio.exception.ResourceNotFoundException;
import com.musicstudio.repository.ProjectRepository;
import com.musicstudio.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TrackRepository trackRepository;

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, String ownerId) {
        MusicProject project = MusicProject.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bpm(request.getBpm() != null ? request.getBpm() : 120)
                .musicKey(request.getMusicKey() != null ? request.getMusicKey() : "C Major")
                .ownerId(ownerId != null ? ownerId : "user_default")
                .build();

        // Create default starter tracks for beginner friendliness
        List<Track> starterTracks = new ArrayList<>();
        
        // Track 1: Piano Melody
        Track pianoTrack = Track.builder()
                .project(project)
                .name("Grand Piano")
                .instrument("PIANO")
                .volume(85)
                .pan(0)
                .muted(false)
                .solo(false)
                .trackOrder(0)
                .build();
        
        // Track 2: Drums
        Track drumTrack = Track.builder()
                .project(project)
                .name("Drums Beat")
                .instrument("DRUMS")
                .volume(90)
                .pan(0)
                .muted(false)
                .solo(false)
                .trackOrder(1)
                .build();

        // Track 3: Bass
        Track bassTrack = Track.builder()
                .project(project)
                .name("Deep Bass")
                .instrument("BASS")
                .volume(80)
                .pan(0)
                .muted(false)
                .solo(false)
                .trackOrder(2)
                .build();

        starterTracks.add(pianoTrack);
        starterTracks.add(drumTrack);
        starterTracks.add(bassTrack);

        project.setTracks(starterTracks);

        MusicProject saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        MusicProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(String ownerId) {
        List<MusicProject> projects = projectRepository.findByOwnerIdOrderByUpdatedAtDesc(ownerId);
        return projects.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse updateProject(Long id, CreateProjectRequest request) {
        MusicProject project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getBpm() != null) project.setBpm(request.getBpm());
        if (request.getMusicKey() != null) project.setMusicKey(request.getMusicKey());

        if (request.getTracks() != null) {
            project.getTracks().clear();
            int order = 0;
            for (TrackDTO trackDTO : request.getTracks()) {
                Track track = Track.builder()
                        .project(project)
                        .name(trackDTO.getName() != null ? trackDTO.getName() : "Track " + (order + 1))
                        .instrument(trackDTO.getInstrument() != null ? trackDTO.getInstrument() : "PIANO")
                        .volume(trackDTO.getVolume() != null ? trackDTO.getVolume() : 80)
                        .pan(trackDTO.getPan() != null ? trackDTO.getPan() : 0)
                        .muted(trackDTO.getMuted() != null ? trackDTO.getMuted() : false)
                        .solo(trackDTO.getSolo() != null ? trackDTO.getSolo() : false)
                        .trackOrder(trackDTO.getTrackOrder() != null ? trackDTO.getTrackOrder() : order++)
                        .build();

                if (trackDTO.getClips() != null) {
                    List<Clip> clips = new ArrayList<>();
                    for (ClipDTO clipDTO : trackDTO.getClips()) {
                        Clip clip = Clip.builder()
                                .track(track)
                                .name(clipDTO.getName() != null ? clipDTO.getName() : "Clip")
                                .startTime(clipDTO.getStartTime() != null ? clipDTO.getStartTime() : 0.0)
                                .duration(clipDTO.getDuration() != null ? clipDTO.getDuration() : 8.0)
                                .clipType(clipDTO.getClipType() != null ? clipDTO.getClipType() : "NOTE")
                                .audioAssetUrl(clipDTO.getAudioAssetUrl())
                                .build();

                        if (clipDTO.getNoteEvents() != null) {
                            List<NoteEvent> notes = new ArrayList<>();
                            for (NoteEventDTO noteDTO : clipDTO.getNoteEvents()) {
                                notes.add(NoteEvent.builder()
                                        .clip(clip)
                                        .pitch(noteDTO.getPitch())
                                        .startTime(noteDTO.getStartTime())
                                        .duration(noteDTO.getDuration())
                                        .velocity(noteDTO.getVelocity() != null ? noteDTO.getVelocity() : 100)
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
        }

        MusicProject saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public ProjectResponse mapToResponse(MusicProject project) {
        List<TrackDTO> trackDTOs = project.getTracks() == null ? new ArrayList<>() :
                project.getTracks().stream().map(track -> {
                    List<ClipDTO> clipDTOs = track.getClips() == null ? new ArrayList<>() :
                            track.getClips().stream().map(clip -> {
                                List<NoteEventDTO> noteDTOs = clip.getNoteEvents() == null ? new ArrayList<>() :
                                        clip.getNoteEvents().stream().map(note -> NoteEventDTO.builder()
                                                .id(note.getId())
                                                .pitch(note.getPitch())
                                                .startTime(note.getStartTime())
                                                .duration(note.getDuration())
                                                .velocity(note.getVelocity())
                                                .build()).collect(Collectors.toList());

                                return ClipDTO.builder()
                                        .id(clip.getId())
                                        .name(clip.getName())
                                        .startTime(clip.getStartTime())
                                        .duration(clip.getDuration())
                                        .clipType(clip.getClipType())
                                        .audioAssetUrl(clip.getAudioAssetUrl())
                                        .noteEvents(noteDTOs)
                                        .build();
                            }).collect(Collectors.toList());

                    return TrackDTO.builder()
                            .id(track.getId())
                            .name(track.getName())
                            .instrument(track.getInstrument())
                            .volume(track.getVolume())
                            .pan(track.getPan())
                            .muted(track.getMuted())
                            .solo(track.getSolo())
                            .trackOrder(track.getTrackOrder())
                            .clips(clipDTOs)
                            .build();
                }).collect(Collectors.toList());

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .bpm(project.getBpm())
                .musicKey(project.getMusicKey())
                .ownerId(project.getOwnerId())
                .tracks(trackDTOs)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .version(project.getVersion())
                .build();
    }
}
