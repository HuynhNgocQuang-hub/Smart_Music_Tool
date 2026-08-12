package com.musicstudio.repository;

import com.musicstudio.entity.MusicProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<MusicProject, Long> {
    List<MusicProject> findByOwnerIdOrderByUpdatedAtDesc(String ownerId);
}
