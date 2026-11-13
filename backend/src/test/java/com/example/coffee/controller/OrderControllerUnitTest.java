
package com.example.coffee.controller;

import com.example.coffee.model.Order;
import com.example.coffee.model.OrderItem;
import com.example.coffee.model.Product;
import com.example.coffee.repository.OrderRepository;
import com.example.coffee.repository.ProductRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderControllerUnitTest {

    @Mock
    private OrderRepository orderRepo;

    @Mock
    private ProductRepository productRepo;

    @InjectMocks
    private OrderController controller;

    // 1. Récupérer toutes les commandes
    @Test
    void shouldReturnAllOrders() {

        Order o1 = new Order();
        o1.setCustomerName("Ahmed");

        Order o2 = new Order();
        o2.setCustomerName("Sara");

        when(orderRepo.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(o1, o2));

        List<Order> result = controller.getAll();

        assertEquals(2, result.size());
        verify(orderRepo).findAllByOrderByCreatedAtDesc();
    }

    // 2. Récupérer une commande par ID
    @Test
    void shouldReturnOrderById() {

        Order order = new Order();
        order.setCustomerName("Ahmed");

        when(orderRepo.findById(1L))
                .thenReturn(Optional.of(order));

        Order result = controller.getById(1L);

        assertNotNull(result);
        assertEquals("Ahmed", result.getCustomerName());
        verify(orderRepo).findById(1L);
    }

    // 3. Récupérer les commandes par statut
    @Test
    void shouldReturnOrdersByStatus() {

        Order order = new Order();
        order.setStatus("PENDING");

        when(orderRepo.findByStatus("PENDING"))
                .thenReturn(List.of(order));

        List<Order> result = controller.getByStatus("PENDING");

        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
        verify(orderRepo).findByStatus("PENDING");
    }

    // 4. Créer une commande et calculer le total
    @Test
    void shouldCreateOrderAndCalculateTotal() {

        Product coffee = new Product();
        coffee.setId(1L);
        coffee.setName("Espresso");
        coffee.setPrice(15.0);

        Product tea = new Product();
        tea.setId(2L);
        tea.setName("Tea");
        tea.setPrice(10.0);

        OrderItem item1 = new OrderItem();
        item1.setProduct(coffee);
        item1.setQuantity(2);

        OrderItem item2 = new OrderItem();
        item2.setProduct(tea);
        item2.setQuantity(3);

        Order order = new Order();
        order.setItems(new ArrayList<>(List.of(item1, item2)));

        when(productRepo.findById(1L))
                .thenReturn(Optional.of(coffee));

        when(productRepo.findById(2L))
                .thenReturn(Optional.of(tea));

        when(orderRepo.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Order result = controller.create(order);

        // Espresso : 15 × 2 = 30
        assertEquals(30.0, item1.getPrice());

        // Tea : 10 × 3 = 30
        assertEquals(30.0, item2.getPrice());

        // Total : 30 + 30 = 60
        assertEquals(60.0, result.getTotal());

        assertSame(order, item1.getOrder());
        assertSame(order, item2.getOrder());

        verify(productRepo, times(2)).findById(anyLong());
        verify(orderRepo).save(order);
    }

    // 5. Modifier le statut d'une commande
    @Test
    void shouldUpdateOrderStatus() {

        Order order = new Order();
        order.setStatus("PENDING");

        when(orderRepo.findById(1L))
                .thenReturn(Optional.of(order));

        when(orderRepo.save(order)).thenReturn(order);

        Order result = controller.updateStatus(1L, "\"PREPARING\"");

        assertEquals("PREPARING", result.getStatus());

        verify(orderRepo).findById(1L);
        verify(orderRepo).save(order);
    }

    // 6. Modifier le paiement
    @Test
    void shouldUpdateOrderPayment() {

        Order order = new Order();
        order.setPayment("UNPAID");

        when(orderRepo.findById(1L))
                .thenReturn(Optional.of(order));

        when(orderRepo.save(order)).thenReturn(order);

        Map<String, String> body = new HashMap<>();
        body.put("payment", "PAID");

        Order result = controller.updatePayment(1L, body);

        assertEquals("PAID", result.getPayment());

        verify(orderRepo).findById(1L);
        verify(orderRepo).save(order);
    }

    // 7. Supprimer une commande
    @Test
    void shouldDeleteOrder() {

        controller.delete(1L);

        verify(orderRepo).deleteById(1L);
    }

    // 8. Calculer les statistiques générales
    @Test
    void shouldReturnOverviewStatistics() {

        LocalDateTime now = LocalDateTime.now();

        Order paidOrder = new Order();
        paidOrder.setTotal(60.0);
        paidOrder.setPayment("PAID");
        paidOrder.setCreatedAt(now);

        Order unpaidOrder = new Order();
        unpaidOrder.setTotal(100.0);
        unpaidOrder.setPayment("UNPAID");
        unpaidOrder.setCreatedAt(now);

        when(orderRepo.findAll())
                .thenReturn(List.of(paidOrder, unpaidOrder));

        when(orderRepo.findByStatus("PENDING"))
                .thenReturn(List.of(paidOrder));

        when(orderRepo.findByStatus("PREPARING"))
                .thenReturn(List.of());

        when(orderRepo.findByStatus("READY"))
                .thenReturn(List.of(unpaidOrder));

        when(orderRepo.findByStatus("DELIVERED"))
                .thenReturn(List.of());

        Map<String, Object> result = controller.getOverview();

        assertEquals(2, result.get("totalOrders"));
        assertEquals(160.0, result.get("totalRevenue"));
        assertEquals(1, result.get("pending"));
        assertEquals(1, result.get("ready"));
        assertEquals(60.0, result.get("todayRevenue"));
        assertEquals(60.0, result.get("monthRevenue"));

        verify(orderRepo).findAll();
    }
   // 9. Statistiques par produit
    @Test
    void shouldReturnProductStatistics() {

        Product coffee = new Product();
        coffee.setName("Espresso");

        OrderItem item1 = new OrderItem();
        item1.setProduct(coffee);
        item1.setQuantity(2);
        item1.setPrice(30.0);

        OrderItem item2 = new OrderItem();
        item2.setProduct(coffee);
        item2.setQuantity(3);
        item2.setPrice(45.0);

        Order order = new Order();
        order.setItems(List.of(item1, item2));

        when(orderRepo.findAll()).thenReturn(List.of(order));

        List<Map<String, Object>> result = controller.getProductStats();

        assertEquals(1, result.size());
        assertEquals("Espresso", result.get(0).get("product"));
        assertEquals(5, result.get(0).get("quantity"));
        assertEquals(75.0, result.get(0).get("revenue"));

        verify(orderRepo).findAll();
    }
}
