package com.calora.backend.config;

import com.calora.backend.model.FoodItem;
import com.calora.backend.model.FoodItemType;
import com.calora.backend.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (foodItemRepository.countByType(FoodItemType.FOOD) == 0) {
            foodItemRepository.saveAll(seedFoods());
        }
        if (foodItemRepository.countByType(FoodItemType.FAMOUS_RECIPE) == 0) {
            foodItemRepository.saveAll(seedRecipes());
        }
    }

    private List<FoodItem> seedFoods() {
        return List.of(
                new FoodItem("Grilled Chicken Breast", 165, 31.0, 0.0, 3.6, "🍗 Lean Animal Proteins", "100g", FoodItemType.FOOD),
                new FoodItem("Brown Rice", 112, 2.6, 24.0, 0.9, "🍚 Complex Carbohydrates", "100g", FoodItemType.FOOD),
                new FoodItem("Steamed Broccoli", 35, 2.4, 7.0, 0.4, "🔥 Low-Calorie Foods", "100g", FoodItemType.FOOD),
                new FoodItem("Salmon Fillet", 208, 20.0, 0.0, 13.0, "🥩 Fatty Animal Proteins", "100g", FoodItemType.FOOD),
                new FoodItem("Greek Yogurt", 59, 10.0, 3.6, 0.4, "🏆 High Protein Density", "100g", FoodItemType.FOOD),
                new FoodItem("Banana", 89, 1.1, 23.0, 0.3, "🍞 Refined Carbohydrates", "1 medium", FoodItemType.FOOD),
                new FoodItem("Almonds", 579, 21.0, 22.0, 50.0, "🥑 Healthy Fats", "100g", FoodItemType.FOOD),
                new FoodItem("Sweet Potato", 86, 1.6, 20.0, 0.1, "🍚 Complex Carbohydrates", "100g", FoodItemType.FOOD)
        );
    }

    private List<FoodItem> seedRecipes() {
        return List.of(
                new FoodItem("Grilled Chicken Breast", 165, 31.0, 0.0, 3.6, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Turkey Breast (roasted)", 135, 30.0, 0.0, 1.0, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Tuna (canned in water)", 116, 26.0, 0.0, 0.8, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Salmon (grilled)", 208, 20.0, 0.0, 13.0, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Egg Whites", 52, 11.0, 0.7, 0.2, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Greek Yogurt (0% fat)", 59, 10.0, 3.6, 0.4, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Cottage Cheese (low-fat)", 98, 11.0, 3.4, 2.3, "🍗 High-Protein / Fitness Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Spaghetti Bolognese", 158, 8.0, 20.0, 5.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Margherita Pizza", 266, 11.0, 33.0, 10.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Beef Burger (plain patty)", 250, 26.0, 0.0, 17.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Chicken Shawarma", 194, 23.0, 5.0, 9.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Chicken Tikka Masala", 168, 14.0, 8.0, 9.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Sushi (salmon roll)", 130, 6.0, 18.0, 4.0, "🍝 Popular Global Meals", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("White Rice (cooked)", 130, 2.7, 28.0, 0.3, "🍚 Everyday & Comfort Foods", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Brown Rice (cooked)", 123, 2.6, 26.0, 1.0, "🍚 Everyday & Comfort Foods", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("French Fries", 312, 3.4, 41.0, 15.0, "🍚 Everyday & Comfort Foods", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Mashed Potatoes", 88, 2.0, 18.0, 1.0, "🍚 Everyday & Comfort Foods", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Omelette (plain)", 154, 11.0, 1.0, 12.0, "🍚 Everyday & Comfort Foods", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Caesar Salad (no croutons)", 120, 6.0, 8.0, 7.0, "🥗 Healthy / Diet-Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Lentils (cooked)", 116, 9.0, 20.0, 0.4, "🥗 Healthy / Diet-Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Chickpeas (cooked)", 164, 9.0, 27.0, 2.6, "🥗 Healthy / Diet-Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Avocado", 160, 2.0, 9.0, 15.0, "🥗 Healthy / Diet-Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Mixed Vegetables (steamed)", 35, 2.0, 7.0, 0.2, "🥗 Healthy / Diet-Friendly", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Dark Chocolate (70%)", 598, 7.8, 46.0, 43.0, "🍰 Snacks & Treats", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Milk Chocolate", 535, 7.6, 59.0, 30.0, "🍰 Snacks & Treats", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Ice Cream (vanilla)", 207, 3.5, 24.0, 11.0, "🍰 Snacks & Treats", "100g", FoodItemType.FAMOUS_RECIPE),
                new FoodItem("Croissant", 406, 8.0, 46.0, 21.0, "🍰 Snacks & Treats", "100g", FoodItemType.FAMOUS_RECIPE)
        );
    }
}
