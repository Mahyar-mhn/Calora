package com.calora.backend.repository;

import com.calora.backend.model.ExploreLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExploreLikeRepository extends JpaRepository<ExploreLike, Long> {
    List<ExploreLike> findByPostId(Long postId);

    Optional<ExploreLike> findByPostIdAndUserId(Long postId, Long userId);

    void deleteByPostId(Long postId);

    void deleteByUserId(Long userId);
}
