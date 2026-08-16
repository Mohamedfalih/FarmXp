package com.farmxp.scheme.config;

import com.farmxp.scheme.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS is handled centrally by the API Gateway (globalcors in application.properties).
                // Scheme-service must NOT add its own Access-Control-Allow-Origin header because that
                // would cause a duplicate CORS header.
                // With cors.disable() here, Spring Security's CorsFilter is NOT registered.
                // OPTIONS preflight requests are handled by the gateway's globalcors configuration.
                // The permitAll() rule below ensures OPTIONS are never challenged by JWT authentication.
                .cors(cors -> cors.disable())

                // CSRF
                .csrf(csrf -> csrf.disable())

                // SESSION
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // AUTHORIZATION
                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs/**"
                        ).permitAll()

                        // Public
                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        // Allow CORS preflight OPTIONS requests without JWT
                        // The gateway handles the CORS headers; Spring Security must not block OPTIONS with 401/403.
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Farmer + Admin
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/schemes/**"
                        ).hasAnyRole("FARMER", "ADMIN")

                        // Admin only
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/schemes"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.PUT,
                                "/api/schemes/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE,
                                "/api/schemes/**"
                        ).hasRole("ADMIN")

                        // Everything else
                        .anyRequest().authenticated()
                )

                // JWT FILTER
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}