package com.farmxp.learning.controller;

import com.farmxp.learning.dto.*;
import com.farmxp.learning.service.ProgressService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning/progress")
//@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(
            ProgressService progressService) {

        this.progressService = progressService;
    }

    @PostMapping(
            "/modules/{moduleId}/games/{gameId}/start"
    )
    public ResponseEntity<ProgressResponse>
    startGame(
            Authentication authentication,
            @PathVariable Long moduleId,
            @PathVariable Long gameId) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        progressService.startGame(
                                farmerId,
                                moduleId,
                                gameId
                        )
                );
    }

    @PostMapping(
            "/modules/{moduleId}/complete"
    )
    public ResponseEntity<ProgressResponse>
    completeModule(
            Authentication authentication,
            @PathVariable Long moduleId) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                progressService.completeModule(
                        farmerId,
                        moduleId
                )
        );
    }

    @PostMapping(
            "/modules/{moduleId}/games/{gameId}/submit"
    )
    public ResponseEntity<ProgressResponse>
    submitGame(
            Authentication authentication,
            @PathVariable Long moduleId,
            @PathVariable Long gameId,
            @Valid @RequestBody
            List<AnswerRequest> answers) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                progressService.submitGame(
                        farmerId,
                        moduleId,
                        gameId,
                        answers
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<ProgressResponse>>
    getMyProgress(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                progressService.getMyProgress(
                        farmerId
                )
        );
    }

    @GetMapping("/modules")
    public ResponseEntity<List<ModuleProgressResponse>>
    getModuleProgress(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                progressService.getModuleProgress(
                        farmerId
                )
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<LearningSummaryResponse>
    getSummary(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                progressService.getLearningSummary(
                        farmerId
                )
        );
    }

    @GetMapping("/admin/summary/{farmerId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LearningSummaryResponse>
    getFarmerSummary(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                progressService.getLearningSummary(
                        farmerId
                )
        );
    }
}