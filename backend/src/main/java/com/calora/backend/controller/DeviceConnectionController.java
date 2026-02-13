package com.calora.backend.controller;

import com.calora.backend.model.DeviceConnection;
import com.calora.backend.model.User;
import com.calora.backend.repository.DeviceConnectionRepository;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/device-connections")
public class DeviceConnectionController {

    private static final List<String> SUPPORTED_PROVIDERS = List.of(
            "Apple Health",
            "Google Fit",
            "Fitbit",
            "Garmin",
            "Strava"
    );

    @Autowired
    private DeviceConnectionRepository deviceConnectionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getConnections(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        List<DeviceConnection> existing = deviceConnectionRepository.findByUserIdOrderByProviderAsc(userId);
        Map<String, DeviceConnection> byProvider = new HashMap<>();
        for (DeviceConnection connection : existing) {
            byProvider.put(connection.getProvider().toLowerCase(Locale.ROOT), connection);
        }

        for (String provider : SUPPORTED_PROVIDERS) {
            String key = provider.toLowerCase(Locale.ROOT);
            if (!byProvider.containsKey(key)) {
                DeviceConnection created = new DeviceConnection();
                created.setUser(user);
                created.setProvider(provider);
                created.setConnected(false);
                created.setUpdatedAt(LocalDateTime.now());
                DeviceConnection saved = deviceConnectionRepository.save(created);
                byProvider.put(key, saved);
            }
        }

        List<DeviceConnectionResponse> response = SUPPORTED_PROVIDERS.stream()
                .map(provider -> {
                    DeviceConnection item = byProvider.get(provider.toLowerCase(Locale.ROOT));
                    return new DeviceConnectionResponse(
                            item.getId(),
                            item.getProvider(),
                            Boolean.TRUE.equals(item.getConnected()),
                            item.getUpdatedAt()
                    );
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}/toggle")
    public ResponseEntity<?> toggleConnection(@PathVariable Long userId, @RequestBody ToggleRequest request) {
        if (request == null || request.provider == null || request.provider.isBlank()) {
            return ResponseEntity.badRequest().body("provider is required");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String provider = request.provider.trim();
        DeviceConnection connection = deviceConnectionRepository
                .findByUserIdAndProviderIgnoreCase(userId, provider)
                .orElseGet(() -> {
                    DeviceConnection created = new DeviceConnection();
                    created.setUser(userOpt.get());
                    created.setProvider(provider);
                    created.setConnected(false);
                    return created;
                });

        connection.setConnected(!Boolean.TRUE.equals(connection.getConnected()));
        connection.setUpdatedAt(LocalDateTime.now());
        DeviceConnection saved = deviceConnectionRepository.save(connection);

        return ResponseEntity.ok(new DeviceConnectionResponse(
                saved.getId(),
                saved.getProvider(),
                Boolean.TRUE.equals(saved.getConnected()),
                saved.getUpdatedAt()
        ));
    }

    public static class ToggleRequest {
        public String provider;
    }

    public record DeviceConnectionResponse(
            Long id,
            String provider,
            boolean connected,
            LocalDateTime updatedAt
    ) {}
}
