package com.example.coffee.config;

import com.example.coffee.enums.Role;
import com.example.coffee.model.User;
import com.example.coffee.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("!test")
public class AdminInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USERNAME}") String username,
            @Value("${ADMIN_PASSWORD}") String password,
            @Value("${ADMIN_EMAIL}") String email) {
        return args -> {

            if (userRepository.existsByUsername(username)) {
                return;
            }

            User admin = new User();

            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);

            userRepository.save(admin);
        };
    }
}