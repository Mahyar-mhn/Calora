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

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> updateUser(@PathVariable Long id,
            @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    // we can update other fields like password/role if needed, but for now just
                    // basic info
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
}
