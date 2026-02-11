package com.calora.backend.controller;

import com.calora.backend.model.FoodItem;
import com.calora.backend.model.FoodItemType;
import com.calora.backend.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FoodCatalogController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @GetMapping("/foods")
    public List<FoodItem> getFoods(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return queryByType(FoodItemType.FOOD, search, category);
    }

    @GetMapping("/recipes")
    public List<FoodItem> getFamousRecipes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        return queryByType(FoodItemType.FAMOUS_RECIPE, search, category);
    }

    private List<FoodItem> queryByType(FoodItemType type, String search, String category) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !"All".equalsIgnoreCase(category);

        if (hasSearch && hasCategory) {
            return foodItemRepository.findByTypeAndCategoryAndNameContainingIgnoreCaseOrderByNameAsc(type, category, search);
        }
        if (hasSearch) {
            return foodItemRepository.findByTypeAndNameContainingIgnoreCaseOrderByNameAsc(type, search);
        }
        if (hasCategory) {
            return foodItemRepository.findByTypeAndCategoryOrderByNameAsc(type, category);
        }
        return foodItemRepository.findByTypeOrderByNameAsc(type);
    }
}
