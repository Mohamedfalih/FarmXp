package com.farmxp.learning.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(
            @Value("${jwt.secret}")
            String secret) {

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );
    }

    public Claims extractClaims(
            String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractUserId(
            String token) {

        Object userId =
                extractClaims(token)
                        .get("userId");

        if (userId == null) {
            throw new RuntimeException(
                    "User ID not found in token"
            );
        }

        return Long.valueOf(
                userId.toString()
        );
    }

    public String extractRole(
            String token) {

        Object role =
                extractClaims(token)
                        .get("role");

        return role == null
                ? null
                : role.toString();
    }
}