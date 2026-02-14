package com.calora.backend.repository;

import com.calora.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    java.util.Optional<User> findByEmail(String email);
    java.util.Optional<User> findByEmailIgnoreCase(String email);
    java.util.List<User> findByEmailContainingIgnoreCase(String email);
}
