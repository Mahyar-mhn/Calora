package com.calora.backend.repository;

import com.calora.backend.model.ExploreReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExploreReactionRepository extends JpaRepository<ExploreReaction, Long> {
    List<ExploreReaction> findByPostId(Long postId);

    Optional<ExploreReaction> findByPostIdAndUserId(Long postId, Long userId);

    void deleteByPostId(Long postId);

    void deleteByUserId(Long userId);
}
