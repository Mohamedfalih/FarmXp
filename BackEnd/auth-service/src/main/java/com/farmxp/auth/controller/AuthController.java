package com.farmxp.auth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmxp.auth.dto.ChangePasswordRequest;
import com.farmxp.auth.dto.LoginRequest;
import com.farmxp.auth.dto.LoginResponse;
import com.farmxp.auth.dto.RegisterRequest;
import com.farmxp.auth.dto.UpdateProfileRequest;
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
    // FORGOT / RESET PASSWORD
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            authService.generatePasswordResetToken(email);
            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a reset link will be sent."));
        } catch (RuntimeException e) {
            // For security, do not reveal if the email exists or not
            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a reset link will be sent."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            if (token == null || newPassword == null) {
                throw new RuntimeException("Token and new password are required");
            }
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================================
    // USERS BY ROLE
    // ==========================================

    @GetMapping("/users/by-role")
    public ResponseEntity<?> getUsersByRole(
            @org.springframework.web.bind.annotation.RequestParam String role,
            Authentication authentication) {

        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Authentication required"));
            }

            java.util.List<Long> userIds = authService.getUserIdsByRole(role);
            return ResponseEntity.ok(userIds);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================================
    // CURRENT USER
    // ==========================================

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
            }
            Long userId = Long.parseLong(authentication.getName());
            authService.deleteUser(userId); // Use generic delete method for all roles
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

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

            Long userId = Long.parseLong(authentication.getName());

            User user =
                    authService.getUserById(userId);

            UserResponse response =
                    new UserResponse(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getPhone(),
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
    // UPDATE PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

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

            Long userId = Long.parseLong(authentication.getName());

            UserResponse response =
                    authService.updateProfile(userId, request);

            return ResponseEntity.ok(response);

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

            Long userId = Long.parseLong(authentication.getName());
            authService.changePassword(
                    userId,
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