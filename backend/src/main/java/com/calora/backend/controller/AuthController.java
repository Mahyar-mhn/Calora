package com.calora.backend.controller;

import com.calora.backend.model.User;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        String normalizedEmail = normalizeEmail(user.getEmail());
        if (normalizedEmail == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        user.setEmail(normalizedEmail);
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
        String email = normalizeEmail(credentials.get("email"));
        String password = credentials.get("password");
        if (email == null || password == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        Optional<User> user = userRepository.findByEmailIgnoreCase(email)
                .filter(u -> Objects.equals(u.getPassword(), password));

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

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    private String normalizeEmail(String email) {
        if (email == null) return null;
        String normalized = email.trim().toLowerCase();
        return normalized.isEmpty() ? null : normalized;
    }
}
