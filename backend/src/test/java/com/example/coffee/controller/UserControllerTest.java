
package com.example.coffee.controller;

import com.example.coffee.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    // Méthode utilitaire pour créer un utilisateur de test
    private Long createTestUser() throws Exception {

        String json = """
                {
                    "firstName": "Sara",
                    "lastName": "Amrani",
                    "username": "sara",
                    "email": "sara@coffee.com",
                    "phone": "0612345678",
                    "password": "Password123!",
                    "role": "BARISTA"
                }
                """;

        String response = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return com.fasterxml.jackson.databind.json.JsonMapper
                .builder()
                .build()
                .readTree(response)
                .get("id")
                .asLong();
    }

    // 1. CREATE : créer un barista
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateBarista() throws Exception {

        String json = """
                {
                    "firstName": "Sara",
                    "lastName": "Amrani",
                    "username": "sara",
                    "email": "sara@coffee.com",
                    "phone": "0612345678",
                    "password": "Password123!",
                    "role": "BARISTA"
                }
                """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("sara"))
                .andExpect(jsonPath("$.role").value("BARISTA"))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    // 2. READ ALL : récupérer tous les utilisateurs
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnAllUsers() throws Exception {

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // 3. READ BY ID : récupérer un utilisateur par son ID
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnUserById() throws Exception {

        Long id = createTestUser();

        mockMvc.perform(get("/api/users/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.username").value("sara"))
                .andExpect(jsonPath("$.role").value("BARISTA"));
    }

    // 4. UPDATE : modifier les informations d'un utilisateur
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldUpdateUser() throws Exception {

        Long id = createTestUser();

        String updateJson = """
                {
                    "firstName": "Salma",
                    "lastName": "Ali",
                    "email": "salma@coffee.com",
                    "phone": "0600000000",
                    "role": "BARISTA"
                }
                """;

        mockMvc.perform(put("/api/users/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.firstName").value("Salma"))
                .andExpect(jsonPath("$.lastName").value("Ali"))
                .andExpect(jsonPath("$.email").value("salma@coffee.com"))
                .andExpect(jsonPath("$.phone").value("0600000000"));
    }

    // 5. BARISTA : accès interdit à la gestion des utilisateurs
    @Test
    @WithMockUser(roles = "BARISTA")
    void baristaShouldNotAccessUserManagement() throws Exception {

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    // 6. ANONYMOUS : accès interdit sans authentification
    @Test
    void unauthenticatedUserShouldNotAccessUserManagement()
            throws Exception {

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    // 7. DUPLICATE : refuser un username déjà utilisé
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldRejectDuplicateUsername() throws Exception {

        createTestUser();

        String duplicateJson = """
                {
                    "firstName": "Salma",
                    "lastName": "Ali",
                    "username": "sara",
                    "email": "salma@coffee.com",
                    "phone": "0600000000",
                    "password": "Password456!",
                    "role": "BARISTA"
                }
                """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateJson))
                .andExpect(status().isConflict());
    }

    // 8. DEACTIVATE : désactiver un utilisateur
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeactivateUser() throws Exception {

        Long id = createTestUser();

        mockMvc.perform(patch("/api/users/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"active": false}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    // 9. REACTIVATE : réactiver un utilisateur
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReactivateUser() throws Exception {

        Long id = createTestUser();

        mockMvc.perform(patch("/api/users/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"active": false}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));

        mockMvc.perform(patch("/api/users/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"active": true}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true));
    }
}
