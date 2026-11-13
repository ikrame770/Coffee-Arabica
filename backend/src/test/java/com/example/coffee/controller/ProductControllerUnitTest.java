
package com.example.coffee.controller;

import com.example.coffee.model.Product;
import com.example.coffee.repository.ProductRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerUnitTest {

    @Mock
    private ProductRepository repo;

    @InjectMocks
    private ProductController controller;

    @Test
    void shouldReturnAllProducts() {

        Product p1 = new Product();
        p1.setName("Espresso");

        Product p2 = new Product();
        p2.setName("Tea");

        when(repo.findAll()).thenReturn(List.of(p1, p2));

        List<Product> result = controller.getAll();

        assertEquals(2, result.size());
        verify(repo).findAll();
    }


    @Test
    void shouldReturnProductsByCategory() {

        Product product = new Product();
        product.setCategory("Coffee");

        when(repo.findByCategory("Coffee"))
                .thenReturn(List.of(product));

        List<Product> result = controller.getByCategory("Coffee");

        assertEquals(1, result.size());
        assertEquals("Coffee", result.get(0).getCategory());
        verify(repo).findByCategory("Coffee");
    }

    @Test
    void shouldReturnProductById() {

        Product product = new Product();
        product.setId(1L);
        product.setName("Espresso");

        when(repo.findById(1L)).thenReturn(Optional.of(product));

        Product result = controller.getById(1L);

        assertNotNull(result);
        assertEquals("Espresso", result.getName());
        verify(repo).findById(1L);
    }

    @Test
    void shouldCreateProduct() {

        Product product = new Product();
        product.setName("Cappuccino");

        when(repo.save(product)).thenReturn(product);

        Product result = controller.create(product);

        assertEquals("Cappuccino", result.getName());
        verify(repo).save(product);
    }

    @Test
    void shouldUpdateProduct() {

        Product product = new Product();
        product.setName("Double Espresso");

        when(repo.save(product)).thenReturn(product);

        Product result = controller.update(1L, product);

        assertEquals(1L, result.getId());
        assertEquals("Double Espresso", result.getName());
        verify(repo).save(product);
    }

    @Test
    void shouldDeleteProduct() {

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}
