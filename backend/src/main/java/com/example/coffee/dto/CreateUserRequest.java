package com.example.coffee.dto;

import com.example.coffee.enums.Role;

public record CreateUserRequest(
        String firstName,
        String lastName,
        String username,
        String email,
        String phone,
        String password,
        Role role) {
}
