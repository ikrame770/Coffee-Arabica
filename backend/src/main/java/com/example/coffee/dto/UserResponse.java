package com.example.coffee.dto;

import com.example.coffee.enums.Role;
import com.example.coffee.model.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        String phone,
        Role role,
        boolean active,
        LocalDateTime createdAt) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt());
    }
}
