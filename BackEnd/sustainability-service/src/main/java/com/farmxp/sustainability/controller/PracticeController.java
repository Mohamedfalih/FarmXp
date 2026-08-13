package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.PracticeLogRequest;
import com.farmxp.sustainability.dto.PracticeLogResponse;
import com.farmxp.sustainability.service.PracticeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sustainability/practices")
//@CrossOrigin(origins = "http://localhost:5173")
public class PracticeController {

    private final PracticeService practiceService;

    public PracticeController(
            PracticeService practiceService) {

        this.practiceService = practiceService;
    }

    @PostMapping
    public ResponseEntity<PracticeLogResponse> createPractice(
            Authentication authentication,
            @Valid @RequestBody PracticeLogRequest request) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        PracticeLogResponse response =
                practiceService.createPractice(
                        farmerId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<PracticeLogResponse>>
    getMyPractices(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                practiceService.getFarmerPractices(
                        farmerId
                )
        );
    }

    @GetMapping("/{practiceId}")
    public ResponseEntity<PracticeLogResponse> getPractice(
            Authentication authentication,
            @PathVariable Long practiceId) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                practiceService.getPractice(
                        farmerId,
                        practiceId
                )
        );
    }
}