package com.farmxp.farmer.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmxp.farmer.dto.FarmerProfileRequest;
import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.security.JwtService;
import com.farmxp.farmer.service.FarmerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerController {

    private final FarmerService farmerService;
    private final JwtService jwtService;

    public FarmerController(
            FarmerService farmerService,
            JwtService jwtService) {

        this.farmerService = farmerService;
        this.jwtService = jwtService;
    }

    // ==========================================
    // TEST
    // ==========================================

    @GetMapping("/test")
    public ResponseEntity<?> test() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Farmer service is working"
                )
        );
    }

    // ==========================================
    // CREATE PROFILE
    // ==========================================

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(
            Authentication authentication,
            @Valid @RequestBody FarmerProfileRequest request) {

        try {

            Long userId = getUserId(authentication);

            FarmerProfileResponse response =
                    farmerService.createProfile(
                            userId,
                            request
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // ==========================================
    // GET PROFILE
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        try {

            Long userId = getUserId(authentication);

            FarmerProfileResponse response =
                    farmerService.getProfile(userId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }
    }

    // ==========================================
    // CHECK PROFILE EXISTS
    // ==========================================

    @GetMapping("/profile/exists")
    public ResponseEntity<?> profileExists(
            Authentication authentication) {

        try {

            Long userId = getUserId(authentication);

            boolean exists =
                    farmerService.profileExists(userId);

            return ResponseEntity.ok(
                    Map.of(
                            "userId", userId,
                            "profileExists", exists
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
    // UPDATE PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @Valid @RequestBody FarmerProfileRequest request) {

        try {

            Long userId = getUserId(authentication);

            FarmerProfileResponse response =
                    farmerService.updateProfile(
                            userId,
                            request
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // ==========================================
    // GET USER ID FROM JWT
    // ==========================================

    private Long getUserId(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Authentication required"
            );
        }

        String principal =
                authentication.getName();

        try {

            return Long.parseLong(principal);

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                    "Invalid user information in token"
            );
        }
    }
}