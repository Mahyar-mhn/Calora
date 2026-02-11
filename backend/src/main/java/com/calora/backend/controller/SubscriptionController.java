package com.calora.backend.controller;

import com.calora.backend.model.User;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/purchase")
    public ResponseEntity<?> purchase(@RequestBody PurchaseRequest request) {
        if (request == null || request.userId == null || request.plan == null || request.plan.isBlank()) {
            return ResponseEntity.badRequest().body("User id and plan are required");
        }

        Optional<User> userOpt = userRepository.findById(request.userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        if (user.getBudget() == null) {
            user.setBudget(100);
        }
        if (user.getIsPremium() == null) {
            user.setIsPremium(false);
        }

        String plan = request.plan.trim().toLowerCase();
        int price;
        LocalDate baseDate = user.getPremiumExpiresAt() != null && !user.getPremiumExpiresAt().isBefore(LocalDate.now())
                ? user.getPremiumExpiresAt()
                : LocalDate.now();

        if (plan.contains("monthly")) {
            price = 2;
            user.setPremiumExpiresAt(baseDate.plusMonths(1));
        } else if (plan.contains("yearly") || plan.contains("annual")) {
            price = 20;
            user.setPremiumExpiresAt(baseDate.plusYears(1));
        } else {
            return ResponseEntity.badRequest().body("Invalid plan");
        }

        if (user.getBudget() < price) {
            return ResponseEntity.badRequest().body("Insufficient budget");
        }

        user.setBudget(user.getBudget() - price);
        user.setIsPremium(true);

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/add-budget")
    public ResponseEntity<?> addBudget(@RequestBody BudgetRequest request) {
        if (request == null || request.userId == null || request.amount == null) {
            return ResponseEntity.badRequest().body("User id and amount are required");
        }
        if (request.amount <= 0) {
            return ResponseEntity.badRequest().body("Amount must be greater than 0");
        }

        Optional<User> userOpt = userRepository.findById(request.userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        if (user.getBudget() == null) {
            user.setBudget(100);
        }
        user.setBudget(user.getBudget() + request.amount);

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    public static class PurchaseRequest {
        public Long userId;
        public String plan;
    }

    public static class BudgetRequest {
        public Long userId;
        public Integer amount;
    }
}
