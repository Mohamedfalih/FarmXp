package com.farmxp.sustainability.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(
            @Value("${jwt.secret}") String secret) {

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes()
                );
    }

    public Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractUserId(String token) {

        Claims claims = extractClaims(token);

        Object userId = claims.get("userId");

        if (userId == null) {
            throw new RuntimeException(
                    "User ID not found in token"
            );
        }

        return Long.valueOf(
                userId.toString()
        );
    }

    public String extractRole(String token) {

        Claims claims = extractClaims(token);

        Object role = claims.get("role");

        if (role == null) {
            return null;
        }

        return role.toString();
    }
}