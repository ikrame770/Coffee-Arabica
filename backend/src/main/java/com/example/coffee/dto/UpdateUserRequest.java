package com.example.coffee.dto;

import com.example.coffee.enums.Role;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        Role role) {
}