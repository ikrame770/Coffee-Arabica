package com.example.coffee.controller;

import com.example.coffee.dto.UserResponse;
import com.example.coffee.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Renvoie l'utilisateur actuellement connecté
    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return UserResponse.from(user);
    }
}
