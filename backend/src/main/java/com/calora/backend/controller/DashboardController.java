package com.calora.backend.controller;

import com.calora.backend.model.Activity;
import com.calora.backend.model.DashboardSummary;
import com.calora.backend.model.Meal;
import com.calora.backend.model.User;
import com.calora.backend.repository.ActivityRepository;
import com.calora.backend.repository.MealRepository;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

        @Autowired
        private MealRepository mealRepository;

        @Autowired
        private ActivityRepository activityRepository;

        @Autowired
        private UserRepository userRepository;

        @GetMapping("/summary/{userId}")
        public org.springframework.http.ResponseEntity<?> getSummary(@PathVariable Long userId) {
                DashboardSummary summary = new DashboardSummary();

                try {
                        Optional<User> userOpt = userRepository.findById(userId);
                        if (userOpt.isEmpty()) {
                                return org.springframework.http.ResponseEntity.ok(summary); // or throw exception
                        }
                        User user = userOpt.get();

                        // 1. Set Daily Target & Macros
                        int dailyTarget;
                        if (user.getDailyCalorieTarget() != null) {
                                dailyTarget = user.getDailyCalorieTarget();
                        } else {
                                // Fallback based on goal if explicit target not set
                                String goal = user.getGoal(); // "Lose Weight", "Maintain Weight", "Gain Weight"

                                if (goal != null) {
                                        String normalizedGoal = goal.trim().toLowerCase();
                                        if (normalizedGoal.contains("lose")) {
                                                dailyTarget = 2000;
                                        } else if (normalizedGoal.contains("maintain")) {
                                                dailyTarget = 2500;
                                        } else if (normalizedGoal.contains("gain")) {
                                                dailyTarget = 3000;
                                        } else {
                                                dailyTarget = 2200; // Default fallback
                                        }
                                } else {
                                        dailyTarget = 2200; // Default fallback
                                }
                        }
                        summary.setDailyTarget(dailyTarget);

                        // Standard Split: 30% Protein, 40% Carbs, 30% Fats
                        summary.setProteinTarget((int) ((dailyTarget * 0.3) / 4));
                        summary.setCarbsTarget((int) ((dailyTarget * 0.4) / 4));
                        summary.setFatsTarget((int) ((dailyTarget * 0.3) / 9));

                        // 2. Weight
                        summary.setCurrentWeight(user.getWeight());
                        summary.setWeightGoal(user.getWeight() != null ? user.getWeight() : 0.0);

                        List<Meal> allMeals = mealRepository.findByUserId(userId);
                        if (allMeals == null)
                                allMeals = new ArrayList<>(); // Defensive check

                        List<Activity> allActivities = activityRepository.findByUserId(userId);
                        if (allActivities == null)
                                allActivities = new ArrayList<>(); // Defensive check

                        LocalDate today = LocalDate.now();

                        // 3. Today's Consumption
                        int caloriesConsumed = allMeals.stream()
                                        .filter(m -> m.getDate() != null && m.getDate().toLocalDate().isEqual(today))
                                        .mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum();

                        int proteinConsumed = allMeals.stream()
                                        .filter(m -> m.getDate() != null && m.getDate().toLocalDate().isEqual(today))
                                        .mapToInt(m -> m.getProtein() != null ? m.getProtein() : 0).sum();

                        int carbsConsumed = allMeals.stream()
                                        .filter(m -> m.getDate() != null && m.getDate().toLocalDate().isEqual(today))
                                        .mapToInt(m -> m.getCarbs() != null ? m.getCarbs() : 0).sum();

                        int fatsConsumed = allMeals.stream()
                                        .filter(m -> m.getDate() != null && m.getDate().toLocalDate().isEqual(today))
                                        .mapToInt(m -> m.getFats() != null ? m.getFats() : 0).sum();

                        int caloriesBurned = allActivities.stream()
                                        .filter(a -> a.getDate() != null && a.getDate().toLocalDate().isEqual(today))
                                        .mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();

                        summary.setCaloriesConsumed(caloriesConsumed);
                        summary.setCaloriesBurned(caloriesBurned);
                        summary.setProteinConsumed(proteinConsumed);
                        summary.setCarbsConsumed(carbsConsumed);
                        summary.setFatsConsumed(fatsConsumed);
                        summary.setCaloriesRemaining(dailyTarget - caloriesConsumed + caloriesBurned);

                        // 4. Recent Activities (Last 5)
                        List<DashboardSummary.RecentActivity> recentActivities = allActivities.stream()
                                        .filter(a -> a.getDate() != null)
                                        .sorted(Comparator.comparing(Activity::getDate).reversed())
                                        .limit(5)
                                        .map(a -> new DashboardSummary.RecentActivity(
                                                        a.getId(),
                                                        a.getType() != null ? a.getType() : "Unknown",
                                                        (a.getDuration() != null ? a.getDuration() : 0) + " min",
                                                        a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0,
                                                        formatTimeAgo(a.getDate())))
                                        .collect(Collectors.toList());
                        summary.setRecentActivities(recentActivities);

                        // 5. Calorie Trends (Last 7 Days)
                        List<DashboardSummary.DailyTrend> trends = new ArrayList<>();
                        DateTimeFormatter trendFormatter = DateTimeFormatter.ofPattern("MMM d");

                        for (int i = 6; i >= 0; i--) {
                                LocalDate date = today.minusDays(i);

                                int dayConsumed = allMeals.stream()
                                                .filter(m -> m.getDate() != null
                                                                && m.getDate().toLocalDate().isEqual(date))
                                                .mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum();

                                int dayBurned = allActivities.stream()
                                                .filter(a -> a.getDate() != null
                                                                && a.getDate().toLocalDate().isEqual(date))
                                                .mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned()
                                                                : 0)
                                                .sum();

                                trends.add(new DashboardSummary.DailyTrend(
                                                date.format(trendFormatter),
                                                dayConsumed,
                                                dailyTarget,
                                                dayBurned));
                        }
                        summary.setCalorieTrends(trends);

                        return org.springframework.http.ResponseEntity.ok(summary);

                } catch (Exception e) {
                        System.err.println("Error generating dashboard summary for user " + userId);
                        e.printStackTrace();
                        return org.springframework.http.ResponseEntity.status(500).body("Error: " + e.getMessage()); // Return
                                                                                                                     // error
                                                                                                                     // message
                }
        }

        private String formatTimeAgo(LocalDateTime dateTime) {
                java.time.Duration duration = java.time.Duration.between(dateTime, LocalDateTime.now());
                long minutes = duration.toMinutes();
                if (minutes < 60)
                        return minutes + " minutes ago";
                long hours = duration.toHours();
                if (hours < 24)
                        return hours + " hours ago";
                long days = duration.toDays();
                return days + " days ago";
        }
}
