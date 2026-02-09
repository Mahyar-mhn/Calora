package com.calora.backend.repository;

import com.calora.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserId(Long userId);

    List<Activity> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime start, LocalDateTime end);

    void deleteByUserId(Long userId);
}
