package com.farmxp.farmer.config;

import com.farmxp.farmer.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

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

                .csrf(csrf ->
                        csrf.disable()
                )

                // ==========================================
                // SESSION
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

                        // ----------------------------------
                        // Swagger / OpenAPI
                        // ----------------------------------

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        )
                        .permitAll()

                        // ----------------------------------
                        // CORS Preflight
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        // ----------------------------------
                        // Test endpoint
                        // ----------------------------------

                        .requestMatchers(
                                "/api/farmers/test"
                        )
                        .permitAll()

                        // ----------------------------------
                        // Dashboard
                        // FARMER ONLY
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/farmers/dashboard"
                        )
                        .hasRole("FARMER")

                        // ----------------------------------
                        // Other Farmer APIs
                        // FARMER + ADMIN
                        // ----------------------------------

                        .requestMatchers(
                                "/api/farmers/**"
                        )
                        .hasAnyRole(
                                "FARMER",
                                "ADMIN"
                        )

                        // ----------------------------------
                        // Everything else
                        // ----------------------------------

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