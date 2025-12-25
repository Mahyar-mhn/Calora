package com.calora.backend.config;

import com.calora.backend.model.Role;
import com.calora.backend.model.User;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@system.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@system.com");
            admin.setName("System Admin");
            admin.setPassword("admin123"); // Ideally this should be encrypted
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@system.com");
        }
    }
}
