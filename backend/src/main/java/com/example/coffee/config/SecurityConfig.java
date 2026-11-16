
package com.example.coffee.config;

import com.example.coffee.service.CustomUserDetailsService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            CustomUserDetailsService userDetailsService) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .userDetailsService(userDetailsService)

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // Autoriser les requêtes CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // USER MANAGEMENT : ADMIN uniquement
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // PRODUCTS : consultation publique
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // PRODUCTS : ADMIN et BARISTA
                        .requestMatchers("/api/products/**")
                        .hasAnyRole("ADMIN", "BARISTA")

                        // ORDERS : création publique par les clients
                        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()

                        // ORDERS : statistiques réservées à ADMIN
                        .requestMatchers("/api/orders/stats/**").hasRole("ADMIN")

                        // ORDERS : consultation réservée à ADMIN et BARISTA
                        .requestMatchers(HttpMethod.GET, "/api/orders/**")
                        .hasAnyRole("ADMIN", "BARISTA")

                        // ORDERS : modification du statut et du paiement
                        .requestMatchers(HttpMethod.PUT,
                                "/api/orders/*/status",
                                "/api/orders/*/payment")
                        .hasAnyRole("ADMIN", "BARISTA")

                        // ORDERS : suppression réservée à ADMIN
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**")
                        .hasRole("ADMIN")

                        // Toute autre route est refusée par défaut
                        .anyRequest().denyAll())

                .httpBasic(Customizer.withDefaults())

                .formLogin(form -> form.disable());

        return http.build();
    }
}
