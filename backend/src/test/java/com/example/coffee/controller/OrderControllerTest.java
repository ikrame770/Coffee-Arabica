
package com.example.coffee.controller;

import com.example.coffee.model.Order;
import com.example.coffee.model.Product;
import com.example.coffee.repository.OrderRepository;
import com.example.coffee.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    private Order createOrder(String customerName, double total, String status) {
        Order order = new Order();
        order.setCustomerName(customerName);
        order.setTotal(total);
        order.setStatus(status);

        return orderRepo.save(order);
    }

    @BeforeEach
    void setUp() {
        // Supprimer d'abord les commandes et leurs articles
        orderRepo.deleteAll();

        // Ensuite, supprimer les produits
        productRepo.deleteAll();
    }

    @Test
    void shouldCreateOrderAndCalculateTotal() throws Exception {

        // ARRANGE : préparer deux produits
        Product coffee = new Product();
        coffee.setName("Espresso");
        coffee.setCategory("Coffee");
        coffee.setPrice(15.0);
        coffee.setAvailable(true);
        coffee = productRepo.save(coffee);

        Product tea = new Product();
        tea.setName("Tea");
        tea.setCategory("Tea");
        tea.setPrice(10.0);
        tea.setAvailable(true);
        tea = productRepo.save(tea);

        // ACT : envoyer une commande avec les deux produits
        String orderJson = """
                {
                    "customerName": "Ahmed",
                    "phone": "0600000000",
                    "items": [
                        {
                            "product": {"id": %d},
                            "quantity": 2
                        },
                        {
                            "product": {"id": %d},
                            "quantity": 3
                        }
                    ]
                }
                """.formatted(coffee.getId(), tea.getId());

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))

                // ASSERT : vérifier la réponse HTTP
                .andExpect(status().isOk())

                // Vérifier les informations de la commande
                .andExpect(jsonPath("$.customerName").value("Ahmed"))

                // Espresso : 15 × 2 = 30
                .andExpect(jsonPath("$.items[0].price").value(30.0))

                // Tea : 10 × 3 = 30
                .andExpect(jsonPath("$.items[1].price").value(30.0))

                // Total : 30 + 30 = 60
                .andExpect(jsonPath("$.total").value(60.0));

        // Vérifier également l'enregistrement en base
        org.junit.jupiter.api.Assertions.assertEquals(1, orderRepo.count());
    }

    @Test
    void shouldReturnAllOrders() throws Exception {

        // ARRANGE
        createOrder("Ahmed", 60.0, "PENDING");
        createOrder("Sara", 100.0, "READY");

        // ACT + ASSERT
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturnOrderById() throws Exception {

        // ARRANGE
        Order order = createOrder("Ahmed", 60.0, "PENDING");

        // ACT + ASSERT
        mockMvc.perform(get("/api/orders/" + order.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Ahmed"))
                .andExpect(jsonPath("$.total").value(60.0));
    }

    @Test
    void shouldReturnOrdersByStatus() throws Exception {

        // ARRANGE
        createOrder("Ahmed", 60.0, "PENDING");
        createOrder("Sara", 100.0, "READY");
        createOrder("Youssef", 80.0, "PENDING");

        // ACT + ASSERT
        mockMvc.perform(get("/api/orders/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void shouldUpdateOrderStatus() throws Exception {

        Order order = createOrder("Ahmed", 60.0, "PENDING");

        mockMvc.perform(put("/api/orders/" + order.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("\"PREPARING\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PREPARING"));
    }

    @Test
    void shouldUpdateOrderPayment() throws Exception {

        Order order = createOrder("Ahmed", 60.0, "PENDING");

        String paymentJson = """
                {
                    "payment": "PAID"
                }
                """;

        mockMvc.perform(put("/api/orders/" + order.getId() + "/payment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(paymentJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.payment").value("PAID"));
    }

    @Test
    void shouldDeleteOrder() throws Exception {

        Order order = createOrder("Ahmed", 60.0, "PENDING");

        mockMvc.perform(delete("/api/orders/" + order.getId()))
                .andExpect(status().isOk());

        org.junit.jupiter.api.Assertions.assertFalse(
                orderRepo.existsById(order.getId()));
    }

    @Test
    void shouldReturnOverviewStatistics() throws Exception {

        // ARRANGE
        Order paidOrder = createOrder("Ahmed", 60.0, "PENDING");
        paidOrder.setPayment("PAID");
        orderRepo.save(paidOrder);

        createOrder("Sara", 100.0, "READY");

        // ACT + ASSERT
        mockMvc.perform(get("/api/orders/stats/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(2))
                .andExpect(jsonPath("$.totalRevenue").value(160.0))
                .andExpect(jsonPath("$.pending").value(1))
                .andExpect(jsonPath("$.ready").value(1))
                .andExpect(jsonPath("$.todayRevenue").value(60.0))
                .andExpect(jsonPath("$.monthRevenue").value(60.0));
    }


    @Test
    void shouldReturnProductStatistics() throws Exception {

        // ARRANGE : créer les produits
        Product coffee = new Product();
        coffee.setName("Espresso");
        coffee.setCategory("Coffee");
        coffee.setPrice(15.0);
        coffee.setAvailable(true);
        coffee = productRepo.save(coffee);

        Product tea = new Product();
        tea.setName("Tea");
        tea.setCategory("Tea");
        tea.setPrice(10.0);
        tea.setAvailable(true);
        tea = productRepo.save(tea);

        // Créer une commande avec deux articles
        String orderJson = """
                {
                    "customerName": "Ahmed",
                    "phone": "0600000000",
                    "items": [
                        {"product": {"id": %d}, "quantity": 2},
                        {"product": {"id": %d}, "quantity": 3}
                    ]
                }
                """.formatted(coffee.getId(), tea.getId());

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isOk());

        // ACT + ASSERT
        mockMvc.perform(get("/api/orders/stats/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].product").value("Tea"))
                .andExpect(jsonPath("$[0].quantity").value(3))
                .andExpect(jsonPath("$[0].revenue").value(30.0))
                .andExpect(jsonPath("$[1].product").value("Espresso"))
                .andExpect(jsonPath("$[1].quantity").value(2))
                .andExpect(jsonPath("$[1].revenue").value(30.0));
    }
}
