package com.calora.backend.controller;

import com.calora.backend.model.Activity;
import com.calora.backend.model.User;
import com.calora.backend.repository.ActivityRepository;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Activity> getUserActivities(@PathVariable Long userId) {
        return activityRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/range")
    public List<Activity> getUserActivitiesInRange(
            @PathVariable Long userId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        LocalDate endDate = (to != null && !to.isBlank()) ? LocalDate.parse(to) : LocalDate.now();
        LocalDate startDate = (from != null && !from.isBlank()) ? LocalDate.parse(from) : endDate.minusDays(6);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        return activityRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);
    }

    @PostMapping
    public ResponseEntity<?> createActivity(@RequestBody Activity activity) {
        if (activity.getUser() == null || activity.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User id is required");
        }

        Optional<User> userOpt = userRepository.findById(activity.getUser().getId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        activity.setUser(userOpt.get());
        if (activity.getDate() == null) {
            activity.setDate(LocalDateTime.now());
        }

        Activity saved = activityRepository.save(activity);
        return ResponseEntity.ok(saved);
    }
}
