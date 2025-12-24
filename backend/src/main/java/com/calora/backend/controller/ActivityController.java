package com.calora.backend.controller;

import com.calora.backend.model.Activity;
import com.calora.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Activity> getUserActivities(@PathVariable Long userId) {
        return activityRepository.findByUserId(userId);
    }

    @PostMapping
    public Activity createActivity(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }
}
