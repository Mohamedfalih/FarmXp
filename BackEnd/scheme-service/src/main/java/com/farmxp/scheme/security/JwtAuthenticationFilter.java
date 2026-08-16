package com.farmxp.scheme.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authorizationHeader =
                    request.getHeader("Authorization");

            if (authorizationHeader == null
                    || !authorizationHeader.startsWith("Bearer ")) {

                filterChain.doFilter(request, response);
                return;
            }

            String token =
                    authorizationHeader.substring(7);

            try {

                Claims claims =
                        Jwts.parser()
                                .verifyWith(
                                        io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                                                jwtSecret.getBytes()
                                        )
                                )
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                Object userIdObj = claims.get("userId");

                Collection<SimpleGrantedAuthority>
                        authorities =
                        extractAuthorities(claims);

                if (userIdObj != null
                        && !authorities.isEmpty()) {

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userIdObj.toString(),
                                    null,
                                    authorities
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }

            } catch (Exception exception) {

                SecurityContextHolder
                        .clearContext();
            }

            filterChain.doFilter(
                    request,
                    response
            );
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private Collection<SimpleGrantedAuthority>
    extractAuthorities(Claims claims) {

        List<SimpleGrantedAuthority>
                authorities =
                new ArrayList<>();

        Object rolesObject =
                claims.get("roles");

        if (rolesObject instanceof List<?> roles) {

            for (Object role : roles) {

                if (role != null) {

                    authorities.add(
                            createAuthority(
                                    role.toString()
                            )
                    );
                }
            }
        }

        if (authorities.isEmpty()) {

            Object roleObject =
                    claims.get("role");

            if (roleObject != null) {

                if (roleObject instanceof String role) {

                    authorities.add(
                            createAuthority(role)
                    );
                }
            }
        }

        return authorities;
    }

    private SimpleGrantedAuthority
    createAuthority(String role) {

        if (role.startsWith("ROLE_")) {

            return new SimpleGrantedAuthority(
                    role
            );
        }

        return new SimpleGrantedAuthority(
                "ROLE_" + role
        );
    }
}