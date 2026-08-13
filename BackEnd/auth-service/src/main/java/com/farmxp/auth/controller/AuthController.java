package com.farmxp.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmxp.auth.dto.ChangePasswordRequest;
import com.farmxp.auth.dto.LoginRequest;
import com.farmxp.auth.dto.LoginResponse;
import com.farmxp.auth.dto.RegisterRequest;
import com.farmxp.auth.dto.UserResponse;
import com.farmxp.auth.entity.User;
import com.farmxp.auth.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================================
    // FARMER REGISTRATION
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {

            User user = authService.register(request);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Registration successful");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("active", user.getActive());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, String> response = new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {

            User user = authService.login(request);

            String token = authService.generateToken(user);

            LoginResponse response = new LoginResponse(
                    "Login successful",
                    token,
                    user.getUserId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response = new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    // ==========================================
    // AUTHENTICATION TEST
    // ==========================================

    @GetMapping("/test")
    public ResponseEntity<?> testAuthentication() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "JWT authentication successful"
                )
        );
    }

    // ==========================================
    // CURRENT USER
    // ==========================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        try {

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "Authentication required"
                                )
                        );
            }

            String username = authentication.getName();

            User user =
                    authService.getUserByUsername(username);

            UserResponse response =
                    new UserResponse(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole().name(),
                            user.getActive()
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        try {

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "Authentication required"
                                )
                        );
            }

            authService.changePassword(
                    authentication.getName(),
                    request.getCurrentPassword(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password changed successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // ==========================================
    // FARMER AUTHORIZATION TEST
    // ==========================================

    @GetMapping("/farmer/test")
    public ResponseEntity<?> farmerTest() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Farmer authorization successful"
                )
        );
    }

    // ==========================================
    // ADMIN AUTHORIZATION TEST
    // ==========================================

    @GetMapping("/admin/test")
    public ResponseEntity<?> adminTest() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Admin authorization successful"
                )
        );
    }
}