package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.PracticeLogResponse;
import com.farmxp.sustainability.dto.PracticeVerificationRequest;
import com.farmxp.sustainability.dto.PracticeVerificationResponse;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.service.VerificationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sustainability/verification")
@CrossOrigin(origins = "http://localhost:5173")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(
            VerificationService verificationService) {

        this.verificationService =
                verificationService;
    }

    // =====================================================
    // EXISTING API - DO NOT REMOVE
    // =====================================================

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PracticeLogResponse>>
    getPendingPractices() {

        return ResponseEntity.ok(
                verificationService.getPendingPractices()
        );
    }

    // =====================================================
    // NEW API - GET VERIFICATION HISTORY BY STATUS
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PracticeLogResponse>>
    getPracticesByStatus(
            @RequestParam PracticeStatus status) {

        return ResponseEntity.ok(
                verificationService
                        .getPracticesByStatus(status)
        );
    }

    // =====================================================
    // EXISTING API - DO NOT REMOVE
    // =====================================================

    @PutMapping("/{practiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PracticeVerificationResponse>
    verifyPractice(
            Authentication authentication,
            @PathVariable Long practiceId,
            @Valid @RequestBody
            PracticeVerificationRequest request) {

        Long adminId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                verificationService.verifyPractice(
                        practiceId,
                        adminId,
                        request
                )
        );
    }
}