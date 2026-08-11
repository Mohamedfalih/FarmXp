package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.SustainabilityScoreResponse;
import com.farmxp.sustainability.service.SustainabilityScoreService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sustainability/score")
@CrossOrigin(origins = "http://localhost:5173")
public class SustainabilityScoreController {

    private final SustainabilityScoreService scoreService;

    public SustainabilityScoreController(
            SustainabilityScoreService scoreService) {

        this.scoreService = scoreService;
    }

    @GetMapping
    public ResponseEntity<SustainabilityScoreResponse>
    getMyScore(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                scoreService.getScore(farmerId)
        );
    }
}