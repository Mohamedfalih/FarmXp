package com.farmxp.farmer.controller;

import com.farmxp.farmer.dto.CropRequest;
import com.farmxp.farmer.dto.CropResponse;
import com.farmxp.farmer.security.JwtService;
import com.farmxp.farmer.service.CropService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers/crops")

public class CropController {

    private final CropService cropService;
    private final JwtService jwtService;

    public CropController(
            CropService cropService,
            JwtService jwtService) {

        this.cropService = cropService;
        this.jwtService = jwtService;
    }

    // ==========================================
    // CREATE CROP
    // ==========================================

    @PostMapping
    public ResponseEntity<CropResponse> createCrop(
            Authentication authentication,
            @Valid @RequestBody CropRequest request) {

        Long userId =
                getUserId(authentication);

        CropResponse response =
                cropService.createCrop(
                        userId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // GET MY CROPS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<CropResponse>>
    getMyCrops(
            Authentication authentication) {

        Long userId =
                getUserId(authentication);

        return ResponseEntity.ok(
                cropService.getMyCrops(userId)
        );
    }

    // ==========================================
    // GET SINGLE CROP
    // ==========================================

    @GetMapping("/{cropId}")
    public ResponseEntity<CropResponse> getCrop(
            Authentication authentication,
            @PathVariable Long cropId) {

        Long userId =
                getUserId(authentication);

        return ResponseEntity.ok(
                cropService.getCrop(
                        userId,
                        cropId
                )
        );
    }

    // ==========================================
    // UPDATE CROP
    // ==========================================

    @PutMapping("/{cropId}")
    public ResponseEntity<CropResponse> updateCrop(
            Authentication authentication,
            @PathVariable Long cropId,
            @Valid @RequestBody CropRequest request) {

        Long userId =
                getUserId(authentication);

        return ResponseEntity.ok(
                cropService.updateCrop(
                        userId,
                        cropId,
                        request
                )
        );
    }

    // ==========================================
    // DELETE CROP
    // ==========================================

    @DeleteMapping("/{cropId}")
    public ResponseEntity<Void> deleteCrop(
            Authentication authentication,
            @PathVariable Long cropId) {

        Long userId =
                getUserId(authentication);

        cropService.deleteCrop(
                userId,
                cropId
        );

        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // JWT → USER ID
    // ==========================================

    private Long getUserId(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

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