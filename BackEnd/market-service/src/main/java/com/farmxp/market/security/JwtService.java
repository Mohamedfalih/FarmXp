package com.farmxp.market.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService(
            @Value("${jwt.secret}") String secret) {

        this.secretKey = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
    }

    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    public String extractRole(String token) {

        return extractClaim(
                token,
                claims -> claims.get("role", String.class)
        );
    }

    public Long extractUserId(String token) {

        return extractClaim(
                token,
                claims -> claims.get("userId", Long.class)
        );
    }

    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {

        try {

            Claims claims =
                    extractAllClaims(token);

            Date expiration =
                    claims.getExpiration();

            return expiration != null
                    && expiration.after(new Date());

        } catch (Exception exception) {

            return false;
        }
    }
}