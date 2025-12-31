package com.calora.backend.controller;

import com.calora.backend.model.User;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.calora.backend.repository.MealRepository mealRepository;

    @Autowired
    private com.calora.backend.repository.ActivityRepository activityRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @jakarta.transaction.Transactional
    public org.springframework.http.ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    mealRepository.deleteByUserId(id);
                    activityRepository.deleteByUserId(id);
                    userRepository.delete(user);
                    return org.springframework.http.ResponseEntity.ok().build();
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> updateUser(@PathVariable Long id,
            @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    if (userDetails.getName() != null) {
                        user.setName(userDetails.getName());
                    }
                    if (userDetails.getEmail() != null) {
                        user.setEmail(userDetails.getEmail());
                    }
                    if (userDetails.getGoal() != null) {
                        user.setGoal(userDetails.getGoal());
                    }
                    if (userDetails.getDailyCalorieTarget() != null) {
                        user.setDailyCalorieTarget(userDetails.getDailyCalorieTarget());
                    }
                    if (userDetails.getAge() != null)
                        user.setAge(userDetails.getAge());
                    if (userDetails.getGender() != null)
                        user.setGender(userDetails.getGender());
                    if (userDetails.getHeight() != null)
                        user.setHeight(userDetails.getHeight());
                    if (userDetails.getWeight() != null)
                        user.setWeight(userDetails.getWeight());
                    if (userDetails.getActivityLevel() != null)
                        user.setActivityLevel(userDetails.getActivityLevel());

                    User updatedUser = userRepository.save(user);
                    return org.springframework.http.ResponseEntity.ok(updatedUser);
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<?> uploadImage(@PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return userRepository.findById(id)
                .map(user -> {
                    try {
                        String uploadDir = "uploads/";
                        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                        if (!java.nio.file.Files.exists(uploadPath)) {
                            java.nio.file.Files.createDirectories(uploadPath);
                        }

                        String fileName = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(fileName),
                                java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                        user.setProfilePicture("/uploads/" + fileName);
                        return org.springframework.http.ResponseEntity.ok(userRepository.save(user));
                    } catch (java.io.IOException e) {
                        return org.springframework.http.ResponseEntity.internalServerError().build();
                    }
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<?> deleteImage(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    String oldPath = user.getProfilePicture();
                    if (oldPath != null && oldPath.startsWith("/uploads/")) {
                        // Optional: could delete the file from disk here
                        // For now, just removing the reference is sufficient
                    }
                    user.setProfilePicture(null);
                    return org.springframework.http.ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}
