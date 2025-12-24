package com.calora.backend.controller;

import com.calora.backend.model.Activity;
import com.calora.backend.model.DashboardSummary;
import com.calora.backend.model.Meal;
import com.calora.backend.repository.ActivityRepository;
import com.calora.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/summary/{userId}")
    public DashboardSummary getSummary(@PathVariable Long userId) {
        DashboardSummary summary = new DashboardSummary();
        summary.setDailyTarget(2200); // hardcoded for now

        List<Meal> meals = mealRepository.findByUserId(userId);
        List<Activity> activities = activityRepository.findByUserId(userId);

        // Filter for today (assuming client needs today, strictly speaking we should
        // pass date)
        // For simplicity, aggregating ALL data for now or maybe just today?
        // Let's filter for today.
        LocalDate today = LocalDate.now();

        int caloriesConsumed = meals.stream()
                .filter(m -> m.getDate().toLocalDate().isEqual(today))
                .mapToInt(Meal::getCalories).sum();

        int proteinConsumed = meals.stream()
                .filter(m -> m.getDate().toLocalDate().isEqual(today))
                .mapToInt(Meal::getProtein).sum();

        int carbsConsumed = meals.stream()
                .filter(m -> m.getDate().toLocalDate().isEqual(today))
                .mapToInt(Meal::getCarbs).sum();

        int fatsConsumed = meals.stream()
                .filter(m -> m.getDate().toLocalDate().isEqual(today))
                .mapToInt(Meal::getFats).sum();

        int caloriesBurned = activities.stream()
                .filter(a -> a.getDate().toLocalDate().isEqual(today))
                .mapToInt(Activity::getCaloriesBurned).sum();

        summary.setCaloriesConsumed(caloriesConsumed);
        summary.setCaloriesBurned(caloriesBurned);
        summary.setProteinConsumed(proteinConsumed);
        summary.setCarbsConsumed(carbsConsumed);
        summary.setFatsConsumed(fatsConsumed);

        summary.setCaloriesRemaining(summary.getDailyTarget() - caloriesConsumed + caloriesBurned);

        return summary;
    }
}
