package com.calora.backend.controller;

import com.calora.backend.model.User;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        if (user.getRole() == null) {
            user.setRole(com.calora.backend.model.Role.USER);
        }
        if (user.getBudget() == null) {
            user.setBudget(100);
        }
        if (user.getIsPremium() == null) {
            user.setIsPremium(false);
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> user = userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));

        if (user.isPresent()) {
            User currentUser = user.get();
            boolean updated = false;
            if (currentUser.getBudget() == null) {
                currentUser.setBudget(100);
                updated = true;
            }
            if (currentUser.getIsPremium() == null) {
                currentUser.setIsPremium(false);
                updated = true;
            }
            if (currentUser.getPremiumExpiresAt() != null
                    && currentUser.getPremiumExpiresAt().isBefore(java.time.LocalDate.now())) {
                currentUser.setIsPremium(false);
                updated = true;
            }
            if (updated) {
                currentUser = userRepository.save(currentUser);
            }
            return ResponseEntity.ok(currentUser);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
