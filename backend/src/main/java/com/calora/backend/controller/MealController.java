package com.calora.backend.controller;

import com.calora.backend.model.Meal;
import com.calora.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meals")
public class MealController {

    @Autowired
    private MealRepository mealRepository;

    @GetMapping
    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Meal> getUserMeals(@PathVariable Long userId) {
        return mealRepository.findByUserId(userId);
    }

    @PostMapping
    public Meal createMeal(@RequestBody Meal meal) {
        return mealRepository.save(meal);
    }
}
