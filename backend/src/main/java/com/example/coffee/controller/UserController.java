package com.example.coffee.controller;

import com.example.coffee.dto.CreateUserRequest;
import com.example.coffee.dto.UpdateUserRequest;
import com.example.coffee.dto.UserResponse;
import com.example.coffee.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Ajouter un utilisateur
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(
            @RequestBody CreateUserRequest request) {

        return userService.createUser(request);
    }

    // Consulter tous les utilisateurs
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // Consulter un utilisateur
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Modifier les informations d'un utilisateur
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {

        return userService.updateUser(id, request);
    }

    // Activer ou désactiver un utilisateur
    @PatchMapping("/{id}/status")
    public UserResponse updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {

        Boolean active = body.get("active");

        if (active == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le champ active est obligatoire");
        }

        return userService.updateStatus(id, active);
    }
}
