package com.farmxp.notification.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(
            @Value("${jwt.secret}") String secret) {

        this.secretKey =
                io.jsonwebtoken.security.Keys
                        .hmacShaKeyFor(
                                secret.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        );
    }

    public String extractUsername(
            String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public String extractRole(
            String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    public Long extractUserId(
            String token) {

        Number userId = extractAllClaims(token)
                .get("userId", Number.class);
                
        return userId != null ? userId.longValue() : null;
    }

    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractAllClaims(token);

            return claims.getExpiration()
                    .after(
                            new java.util.Date()
                    );

        } catch (Exception exception) {

            return false;
        }
    }

    private Claims extractAllClaims(
            String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}