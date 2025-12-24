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
        if (userRepository.findAll().stream().anyMatch(u -> u.getEmail().equals(user.getEmail()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email) && u.getPassword().equals(password))
                .findFirst();

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
