package com.calora.backend.repository;

import com.calora.backend.model.ExploreComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExploreCommentRepository extends JpaRepository<ExploreComment, Long> {
    List<ExploreComment> findByPostIdOrderByCreatedAtAsc(Long postId);

    void deleteByPostId(Long postId);

    void deleteByUserId(Long userId);
}
