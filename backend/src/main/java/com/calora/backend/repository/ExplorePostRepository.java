package com.calora.backend.repository;

import com.calora.backend.model.ExplorePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExplorePostRepository extends JpaRepository<ExplorePost, Long> {
    List<ExplorePost> findAllByOrderByCreatedAtDesc();

    List<ExplorePost> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdIn(List<Long> userIds);

    void deleteByUserId(Long userId);
}
