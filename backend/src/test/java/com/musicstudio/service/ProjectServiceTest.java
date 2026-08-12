package com.musicstudio.service;

import com.musicstudio.dto.CreateProjectRequest;
import com.musicstudio.dto.ProjectResponse;
import com.musicstudio.entity.MusicProject;
import com.musicstudio.exception.ResourceNotFoundException;
import com.musicstudio.repository.ProjectRepository;
import com.musicstudio.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TrackRepository trackRepository;

    @InjectMocks
    private ProjectService projectService;

    private MusicProject sampleProject;

    @BeforeEach
    void setUp() {
        sampleProject = MusicProject.builder()
                .id(1L)
                .name("Test Project")
                .bpm(120)
                .musicKey("C Major")
                .ownerId("user_test")
                .tracks(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Create project should return ProjectResponse with starter tracks")
    void testCreateProjectSuccess() {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("New EDM Track");
        request.setBpm(128);
        request.setMusicKey("A Minor");

        when(projectRepository.save(any(MusicProject.class))).thenAnswer(invocation -> {
            MusicProject p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        ProjectResponse response = projectService.createProject(request, "user_test");

        assertNotNull(response);
        assertEquals("New EDM Track", response.getName());
        assertEquals(128, response.getBpm());
        assertEquals("A Minor", response.getMusicKey());
        assertNotNull(response.getTracks());
        assertEquals(3, response.getTracks().size()); // Grand Piano, Drums Beat, Deep Bass

        verify(projectRepository, times(1)).save(any(MusicProject.class));
    }

    @Test
    @DisplayName("Get project by ID should return correct response when exists")
    void testGetProjectByIdSuccess() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        ProjectResponse response = projectService.getProjectById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Project", response.getName());
    }

    @Test
    @DisplayName("Get project by ID should throw ResourceNotFoundException when not found")
    void testGetProjectByIdNotFound() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById(99L);
        });
    }

    @Test
    @DisplayName("Delete project should call deleteById when project exists")
    void testDeleteProjectSuccess() {
        when(projectRepository.existsById(1L)).thenReturn(true);
        doNothing().when(projectRepository).deleteById(1L);

        assertDoesNotThrow(() -> projectService.deleteProject(1L));

        verify(projectRepository, times(1)).deleteById(1L);
    }
}
