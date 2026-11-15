package com.example.coffee.service;

import com.example.coffee.dto.CreateUserRequest;
import com.example.coffee.enums.Role;
import com.example.coffee.model.User;
import com.example.coffee.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

        @Mock
        private UserRepository userRepository;

        @Mock
        private PasswordEncoder passwordEncoder;

        @InjectMocks
        private UserService userService;

        @Test
        void shouldCreateUserWithEncodedPassword() {

                CreateUserRequest request = new CreateUserRequest(
                                "Sara",
                                "Amrani",
                                "sara",
                                "sara@coffee.com",
                                "0612345678",
                                "Password123!",
                                Role.BARISTA);

                when(userRepository.existsByUsername("sara"))
                                .thenReturn(false);

                when(userRepository.existsByEmail("sara@coffee.com"))
                                .thenReturn(false);

                when(passwordEncoder.encode("Password123!"))
                                .thenReturn("$2a$12$encodedPassword");

                when(userRepository.save(any(User.class)))
                                .thenAnswer(invocation -> {
                                        User user = invocation.getArgument(0);
                                        user.setId(1L);
                                        return user;
                                });

                var result = userService.createUser(request);

                assertEquals("sara", result.username());
                assertEquals(Role.BARISTA, result.role());

                verify(passwordEncoder).encode("Password123!");
                verify(userRepository).save(any(User.class));
        }

        @Test
        void shouldRejectDuplicateUsername() {

                CreateUserRequest request = new CreateUserRequest(
                                "Sara",
                                "Amrani",
                                "sara",
                                "sara@coffee.com",
                                "0612345678",
                                "Password123!",
                                Role.BARISTA);

                when(userRepository.existsByUsername("sara"))
                                .thenReturn(true);

                ResponseStatusException exception = assertThrows(
                                ResponseStatusException.class,
                                () -> userService.createUser(request));

                assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());

                verify(userRepository, never()).save(any(User.class));
        }
}