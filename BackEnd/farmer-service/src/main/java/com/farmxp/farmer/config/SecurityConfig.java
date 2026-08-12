package com.farmxp.farmer.config;

import com.farmxp.farmer.security.JwtAuthenticationFilter;

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

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // ==========================================
            // CSRF
            // ==========================================

            .csrf(csrf -> csrf.disable())

            // ==========================================
            // STATELESS SESSION
            // ==========================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // ==========================================
            // AUTHORIZATION
            // ==========================================

            .authorizeHttpRequests(auth -> auth

                // ======================================
                // SWAGGER / OPENAPI
                // ======================================

                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // ======================================
                // TEST ENDPOINT
                // ======================================

                .requestMatchers(
                    "/api/farmers/test"
                ).permitAll()

                // ======================================
                // FARMER PROFILE
                // FARMER + ADMIN CAN READ
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/farmers/profile",
                    "/api/farmers/profile/exists"
                ).hasAnyRole(
                    "FARMER",
                    "ADMIN"
                )

                // ======================================
                // FARMER PROFILE CREATE / UPDATE
                // FARMER ONLY
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/farmers/profile"
                ).hasRole("FARMER")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/farmers/profile"
                ).hasRole("FARMER")

                // ======================================
                // CROP - READ
                // FARMER + ADMIN
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/farmers/crops/**"
                ).hasAnyRole(
                    "FARMER",
                    "ADMIN"
                )

                // ======================================
                // CROP - CREATE
                // FARMER ONLY
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/farmers/crops"
                ).hasRole("FARMER")

                // ======================================
                // CROP - UPDATE
                // FARMER ONLY
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/farmers/crops/**"
                ).hasRole("FARMER")

                // ======================================
                // CROP - DELETE
                // FARMER ONLY
                // ======================================

                .requestMatchers(
                    org.springframework.http.HttpMethod.DELETE,
                    "/api/farmers/crops/**"
                ).hasRole("FARMER")

                // ======================================
                // ANY OTHER FARMER API
                // ======================================

                .requestMatchers(
                    "/api/farmers/**"
                ).hasAnyRole(
                    "FARMER",
                    "ADMIN"
                )

                // ======================================
                // EVERYTHING ELSE
                // ======================================

                .anyRequest()
                .authenticated()
            )

            // ==========================================
            // JWT FILTER
            // ==========================================

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}