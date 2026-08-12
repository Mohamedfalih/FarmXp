package com.farmxp.learning.security;

import io.jsonwebtoken.Claims;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication
        .UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority
        .SimpleGrantedAuthority;

import org.springframework.security.core.context
        .SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorization =
                request.getHeader("Authorization");

        if (authorization == null
                || !authorization
                .startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            String token =
                    authorization.substring(7);

            Claims claims =
                    jwtService.extractClaims(token);

            Long userId =
                    jwtService.extractUserId(token);

            String role =
                    jwtService.extractRole(token);

            List<SimpleGrantedAuthority>
                    authorities =
                    role == null
                            ? List.of()
                            : List.of(
                                    new SimpleGrantedAuthority(
                                            role.startsWith(
                                                    "ROLE_"
                                            )
                                                    ? role
                                                    : "ROLE_" + role
                                    )
                            );

            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId.toString(),
                            null,
                            authorities
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

        } catch (Exception e) {

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}