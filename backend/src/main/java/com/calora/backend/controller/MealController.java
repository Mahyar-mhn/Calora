package com.calora.backend.controller;

import com.calora.backend.model.Meal;
import com.calora.backend.model.User;
import com.calora.backend.repository.MealRepository;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/meals")
public class MealController {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Meal> getUserMeals(@PathVariable Long userId) {
        return mealRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/range")
    public List<Meal> getUserMealsInRange(
            @PathVariable Long userId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        LocalDate endDate = (to != null && !to.isBlank()) ? LocalDate.parse(to) : LocalDate.now();
        LocalDate startDate = (from != null && !from.isBlank()) ? LocalDate.parse(from) : endDate.minusDays(6);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        return mealRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);
    }

    @PostMapping
    public ResponseEntity<?> createMeal(@RequestBody Meal meal) {
        if (meal.getUser() == null || meal.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User id is required");
        }

        Optional<User> userOpt = userRepository.findById(meal.getUser().getId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        meal.setUser(userOpt.get());
        if (meal.getDate() == null) {
            meal.setDate(LocalDateTime.now());
        }
        if (meal.getMealType() == null || meal.getMealType().isBlank()) {
            meal.setMealType("unspecified");
        }
        if (meal.getQuantity() == null) {
            meal.setQuantity(1.0);
        }
        if (meal.getUnit() == null || meal.getUnit().isBlank()) {
            meal.setUnit("serving");
        }

        Meal saved = mealRepository.save(meal);
        return ResponseEntity.ok(saved);
    }
}
