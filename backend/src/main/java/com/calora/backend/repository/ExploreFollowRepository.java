package com.calora.backend.repository;

import com.calora.backend.model.ExploreFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExploreFollowRepository extends JpaRepository<ExploreFollow, Long> {
    Optional<ExploreFollow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);

    List<ExploreFollow> findByFollowerId(Long followerId);

    List<ExploreFollow> findByFollowingId(Long followingId);

    long countByFollowerId(Long followerId);

    long countByFollowingId(Long followingId);

    long countByFollowerIdIn(List<Long> followerIds);

    void deleteByFollowerId(Long followerId);

    void deleteByFollowingId(Long followingId);
}
