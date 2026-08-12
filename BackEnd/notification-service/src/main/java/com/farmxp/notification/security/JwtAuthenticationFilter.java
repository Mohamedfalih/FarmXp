
package com.farmxp.notification.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

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

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authorizationHeader
                        .substring(7)
                        .trim();

        if (token.isEmpty()) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            if (jwtService.isTokenValid(token)) {

                String username =
                        jwtService.extractUsername(token);

                String role =
                        jwtService.extractRole(token);

                // Temporary diagnostic output
                System.out.println(
                        "JWT USERNAME = " + username
                );

                System.out.println(
                        "JWT ROLE = " + role
                );

                if (username != null
                        && role != null
                        && SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

                    String authority =
                            role.startsWith("ROLE_")
                                    ? role
                                    : "ROLE_" + role;

                    System.out.println(
                            "SPRING AUTHORITY = " + authority
                    );

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singletonList(
                                            new SimpleGrantedAuthority(
                                                    authority
                                            )
                                    )
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }

            } else {

                System.out.println(
                        "JWT TOKEN = INVALID"
                );
            }

        } catch (Exception exception) {

            System.out.println(
                    "JWT ERROR = "
                            + exception.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}
