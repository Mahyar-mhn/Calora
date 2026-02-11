package com.calora.backend.repository;

import com.calora.backend.model.FoodItem;
import com.calora.backend.model.FoodItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByTypeOrderByNameAsc(FoodItemType type);

    List<FoodItem> findByTypeAndCategoryOrderByNameAsc(FoodItemType type, String category);

    List<FoodItem> findByTypeAndNameContainingIgnoreCaseOrderByNameAsc(FoodItemType type, String name);

    List<FoodItem> findByTypeAndCategoryAndNameContainingIgnoreCaseOrderByNameAsc(FoodItemType type, String category, String name);

    long countByType(FoodItemType type);
}
