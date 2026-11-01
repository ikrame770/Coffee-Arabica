
package com.example.coffee.controller;

import com.example.coffee.model.Product;
import com.example.coffee.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.coffee.repository.OrderRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository repo;

    @Autowired
    private OrderRepository order_repo;

    @BeforeEach
    void setUp() {
        order_repo.deleteAll();
        repo.deleteAll();
    }

    private Product createProduct(
            String name, String category, double price, boolean available) {

        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setAvailable(available);
        product.setDescription("Test description");
        product.setImage("test.jpg");

        return repo.save(product);
    }

    @Test
    void shouldReturnAllProducts() throws Exception {
        createProduct("Espresso", "Coffee", 15.0, true);
        createProduct("Tea", "Tea", 10.0, true);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturnOnlyAvailableProducts() throws Exception {
        createProduct("Espresso", "Coffee", 15.0, true);
        createProduct("Unavailable Coffee", "Coffee", 20.0, false);

        mockMvc.perform(get("/api/products/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Espresso"));
    }

    @Test
    void shouldFilterProductsByCategory() throws Exception {
        createProduct("Espresso", "Coffee", 15.0, true);
        createProduct("Tea", "Tea", 10.0, true);

        mockMvc.perform(get("/api/products/category/Coffee"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].category").value("Coffee"));
    }

    @Test
    void shouldReturnProductById() throws Exception {
        Product product = createProduct("Espresso", "Coffee", 15.0, true);

        mockMvc.perform(get("/api/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Espresso"))
                .andExpect(jsonPath("$.price").value(15.0));
    }

    @Test
    void shouldCreateProduct() throws Exception {
        String productJson = """
                {
                    "name": "Cappuccino",
                    "description": "Coffee with milk",
                    "price": 25.0,
                    "category": "Coffee",
                    "image": "cappuccino.jpg",
                    "available": true
                }
                """;

        mockMvc.perform(post("/api/products")
                        .contentType("application/json")
                        .content(productJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Cappuccino"))
                .andExpect(jsonPath("$.price").value(25.0));

        org.junit.jupiter.api.Assertions.assertEquals(1, repo.count());
    }

    @Test
    void shouldUpdateProduct() throws Exception {
        Product product = createProduct("Espresso", "Coffee", 15.0, true);

        String updatedJson = """
                {
                    "name": "Double Espresso",
                    "description": "Updated description",
                    "price": 20.0,
                    "category": "Coffee",
                    "image": "double.jpg",
                    "available": true
                }
                """;

        mockMvc.perform(put("/api/products/" + product.getId())
                        .contentType("application/json")
                        .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Double Espresso"))
                .andExpect(jsonPath("$.price").value(20.0));

        org.junit.jupiter.api.Assertions.assertEquals(
                "Double Espresso",
                repo.findById(product.getId()).orElseThrow().getName()
        );
    }

    @Test
    void shouldDeleteProduct() throws Exception {
        Product product = createProduct("Espresso", "Coffee", 15.0, true);

        mockMvc.perform(delete("/api/products/" + product.getId()))
                .andExpect(status().isOk());

        org.junit.jupiter.api.Assertions.assertFalse(
                repo.existsById(product.getId())
        );
    }
}
