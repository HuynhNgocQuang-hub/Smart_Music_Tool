package com.musicstudio.service;

import com.musicstudio.dto.ClipDTO;
import com.musicstudio.dto.NoteEventDTO;
import com.musicstudio.dto.TrackDTO;
import com.musicstudio.entity.Clip;
import com.musicstudio.entity.MusicProject;
import com.musicstudio.entity.NoteEvent;
import com.musicstudio.entity.Track;
import com.musicstudio.exception.ResourceNotFoundException;
import com.musicstudio.repository.ProjectRepository;
import com.musicstudio.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final ProjectRepository projectRepository;
    private final TrackRepository trackRepository;

    @Transactional
    public TrackDTO addTrackToProject(Long projectId, TrackDTO trackDTO) {
        MusicProject project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        Integer nextOrder = project.getTracks() != null ? project.getTracks().size() : 0;

        Track track = Track.builder()
                .project(project)
                .name(trackDTO.getName() != null ? trackDTO.getName() : "New Track")
                .instrument(trackDTO.getInstrument() != null ? trackDTO.getInstrument() : "PIANO")
                .volume(trackDTO.getVolume() != null ? trackDTO.getVolume() : 80)
                .pan(trackDTO.getPan() != null ? trackDTO.getPan() : 0)
                .muted(trackDTO.getMuted() != null ? trackDTO.getMuted() : false)
                .solo(trackDTO.getSolo() != null ? trackDTO.getSolo() : false)
                .trackOrder(nextOrder)
                .build();

        Track saved = trackRepository.save(track);
        return mapTrackToDTO(saved);
    }

    @Transactional
    public TrackDTO updateTrack(Long trackId, TrackDTO trackDTO) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found: " + trackId));

        if (trackDTO.getName() != null) track.setName(trackDTO.getName());
        if (trackDTO.getInstrument() != null) track.setInstrument(trackDTO.getInstrument());
        if (trackDTO.getVolume() != null) track.setVolume(trackDTO.getVolume());
        if (trackDTO.getPan() != null) track.setPan(trackDTO.getPan());
        if (trackDTO.getMuted() != null) track.setMuted(trackDTO.getMuted());
        if (trackDTO.getSolo() != null) track.setSolo(trackDTO.getSolo());

        Track saved = trackRepository.save(track);
        return mapTrackToDTO(saved);
    }

    @Transactional
    public void deleteTrack(Long trackId) {
        if (!trackRepository.existsById(trackId)) {
            throw new ResourceNotFoundException("Track not found: " + trackId);
        }
        trackRepository.deleteById(trackId);
    }

    @Transactional
    public TrackDTO addClipToTrack(Long trackId, ClipDTO clipDTO) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found: " + trackId));

        Clip clip = Clip.builder()
                .track(track)
                .name(clipDTO.getName() != null ? clipDTO.getName() : "Melody Clip")
                .startTime(clipDTO.getStartTime() != null ? clipDTO.getStartTime() : 0.0)
                .duration(clipDTO.getDuration() != null ? clipDTO.getDuration() : 8.0)
                .clipType(clipDTO.getClipType() != null ? clipDTO.getClipType() : "NOTE")
                .audioAssetUrl(clipDTO.getAudioAssetUrl())
                .build();

        if (clipDTO.getNoteEvents() != null && !clipDTO.getNoteEvents().isEmpty()) {
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

        if (track.getClips() == null) {
            track.setClips(new ArrayList<>());
        }
        track.getClips().add(clip);

        Track saved = trackRepository.save(track);
        return mapTrackToDTO(saved);
    }

    private TrackDTO mapTrackToDTO(Track track) {
        List<ClipDTO> clipDTOs = track.getClips() == null ? new ArrayList<>() :
                track.getClips().stream().map(clip -> {
                    List<NoteEventDTO> noteDTOs = clip.getNoteEvents() == null ? new ArrayList<>() :
                            clip.getNoteEvents().stream().map(note -> NoteEventDTO.builder()
                                    .id(note.getId())
                                    .pitch(note.getPitch())
                                    .startTime(note.getStartTime())
                                    .duration(note.getDuration())
                                    .velocity(note.getVelocity())
                                    .build()).toList();

                    return ClipDTO.builder()
                            .id(clip.getId())
                            .name(clip.getName())
                            .startTime(clip.getStartTime())
                            .duration(clip.getDuration())
                            .clipType(clip.getClipType())
                            .audioAssetUrl(clip.getAudioAssetUrl())
                            .noteEvents(noteDTOs)
                            .build();
                }).toList();

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
    }
}
