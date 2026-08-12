package com.musicstudio.repository;

import com.musicstudio.entity.AiSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, Long> {
    List<AiSuggestion> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
