
package com.example.coffee.service;

import com.example.coffee.dto.CreateUserRequest;
import com.example.coffee.dto.UpdateUserRequest;
import com.example.coffee.dto.UserResponse;
import com.example.coffee.enums.Role;
import com.example.coffee.model.User;
import com.example.coffee.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE : créer un utilisateur
    public UserResponse createUser(CreateUserRequest request) {

        validateRequired(request.firstName(), "Prénom");
        validateRequired(request.lastName(), "Nom");
        validateRequired(request.username(), "Nom d'utilisateur");
        validateRequired(request.email(), "Email");
        validateRequired(request.password(), "Mot de passe");

        if (request.role() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Le rôle est obligatoire");
        }

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        // Vérifier si le username existe déjà
        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Nom d'utilisateur déjà utilisé");
        }

        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email déjà utilisé");
        }

        User user = new User();

        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(request.phone());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setActive(true);

        return UserResponse.from(userRepository.save(user));
    }

    // READ ALL : récupérer tous les utilisateurs
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    // READ BY ID : récupérer un utilisateur par son ID
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        return UserResponse.from(findUser(id));
    }

    // UPDATE : modifier les informations d'un utilisateur
    public UserResponse updateUser(Long id, UpdateUserRequest request) {

        User user = findUser(id);

        validateRequired(request.firstName(), "Prénom");
        validateRequired(request.lastName(), "Nom");
        validateRequired(request.email(), "Email");

        String email = request.email().trim().toLowerCase();

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (!user.getEmail().equalsIgnoreCase(email)
                && userRepository.existsByEmail(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email déjà utilisé");
        }

        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(email);
        user.setPhone(request.phone());

        // Modification du rôle
        if (request.role() != null) {

            // Empêcher la rétrogradation du dernier ADMIN actif
            if (user.isActive()
                    && user.getRole() == Role.ADMIN
                    && request.role() != Role.ADMIN) {

                long activeAdmins = userRepository.findAll()
                        .stream()
                        .filter(u -> u.getRole() == Role.ADMIN
                                && u.isActive())
                        .count();

                if (activeAdmins <= 1) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Impossible de modifier le rôle du dernier administrateur");
                }
            }

            user.setRole(request.role());
        }

        return UserResponse.from(userRepository.save(user));
    }

    // UPDATE STATUS : activer ou désactiver un utilisateur
    public UserResponse updateStatus(Long id, boolean active) {

        User user = findUser(id);

        // Empêcher la désactivation du dernier ADMIN actif
        if (!active
                && user.getRole() == Role.ADMIN
                && user.isActive()) {

            long activeAdmins = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getRole() == Role.ADMIN
                            && u.isActive())
                    .count();

            if (activeAdmins <= 1) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Impossible de désactiver le dernier administrateur");
            }
        }

        user.setActive(active);

        return UserResponse.from(userRepository.save(user));
    }

    // Recherche d'un utilisateur
    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"));
    }

    // Validation des champs obligatoires
    private void validateRequired(String value, String field) {

        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    field + " obligatoire");
        }
    }
}
