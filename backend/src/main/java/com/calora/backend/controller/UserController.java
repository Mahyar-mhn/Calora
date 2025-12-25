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
    public org.springframework.http.ResponseEntity<User> updateUser(@PathVariable Long id,
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
}
