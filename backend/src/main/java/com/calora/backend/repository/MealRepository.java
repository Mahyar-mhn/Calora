package com.calora.backend.repository;

import com.calora.backend.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserId(Long userId);
}
