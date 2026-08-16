package com.farmxp.learning.controller;

import com.farmxp.learning.dto.LearningSummaryResponse;
import com.farmxp.learning.service.ProgressService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learning/internal")
public class LearningInternalController {

    private final ProgressService progressService;

    public LearningInternalController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/summary/{farmerId}")
    public ResponseEntity<LearningSummaryResponse> getLearningSummary(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                progressService.getLearningSummary(farmerId)
        );
    }
}
