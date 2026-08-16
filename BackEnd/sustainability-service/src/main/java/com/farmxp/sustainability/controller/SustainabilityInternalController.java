package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.SustainabilityScoreResponse;
import com.farmxp.sustainability.service.SustainabilityScoreService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sustainability/internal")
public class SustainabilityInternalController {

    private final SustainabilityScoreService scoreService;

    public SustainabilityInternalController(SustainabilityScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @GetMapping("/score/{farmerId}")
    public ResponseEntity<SustainabilityScoreResponse> getScore(@PathVariable Long farmerId) {
        return ResponseEntity.ok(scoreService.getScore(farmerId));
    }
}
