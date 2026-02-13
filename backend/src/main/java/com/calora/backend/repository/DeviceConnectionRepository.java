package com.calora.backend.repository;

import com.calora.backend.model.DeviceConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceConnectionRepository extends JpaRepository<DeviceConnection, Long> {
    List<DeviceConnection> findByUserIdOrderByProviderAsc(Long userId);
    Optional<DeviceConnection> findByUserIdAndProviderIgnoreCase(Long userId, String provider);
}
