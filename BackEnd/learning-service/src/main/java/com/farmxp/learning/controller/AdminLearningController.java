package com.farmxp.learning.controller;

import com.farmxp.learning.dto.*;
import com.farmxp.learning.service.GameService;
import com.farmxp.learning.service.ModuleService;
import com.farmxp.learning.service.QuestionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLearningController {

    private final ModuleService moduleService;
    private final GameService gameService;
    private final QuestionService questionService;

    public AdminLearningController(
            ModuleService moduleService,
            GameService gameService,
            QuestionService questionService) {

        this.moduleService = moduleService;
        this.gameService = gameService;
        this.questionService = questionService;
    }

    // =========================
    // MODULES
    // =========================

    @GetMapping("/modules")
    public ResponseEntity<List<ModuleResponse>>
    getAllModules() {

        return ResponseEntity.ok(
                moduleService.getAllModules()
        );
    }

    @PostMapping("/modules")
    public ResponseEntity<ModuleResponse>
    createModule(
            @Valid @RequestBody
            ModuleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        moduleService.createModule(
                                request
                        )
                );
    }

    @PutMapping("/modules/{moduleId}")
    public ResponseEntity<ModuleResponse>
    updateModule(
            @PathVariable Long moduleId,
            @Valid @RequestBody
            ModuleRequest request) {

        return ResponseEntity.ok(
                moduleService.updateModule(
                        moduleId,
                        request
                )
        );
    }

    @DeleteMapping("/modules/{moduleId}")
    public ResponseEntity<?> deleteModule(
            @PathVariable Long moduleId) {

        moduleService.deleteModule(moduleId);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Module deleted successfully"
                )
        );
    }

    // =========================
    // GAMES
    // =========================

    @PostMapping("/modules/{moduleId}/games")
    public ResponseEntity<GameResponse>
    createGame(
            @PathVariable Long moduleId,
            @Valid @RequestBody
            GameRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        gameService.createGame(
                                moduleId,
                                request
                        )
                );
    }

    @GetMapping("/modules/{moduleId}/games")
    public ResponseEntity<List<GameResponse>>
    getGames(
            @PathVariable Long moduleId) {

        return ResponseEntity.ok(
                gameService.getGamesByModule(
                        moduleId
                )
        );
    }

    @PutMapping("/games/{gameId}")
    public ResponseEntity<GameResponse>
    updateGame(
            @PathVariable Long gameId,
            @Valid @RequestBody
            GameRequest request) {

        return ResponseEntity.ok(
                gameService.updateGame(
                        gameId,
                        request
                )
        );
    }

    @DeleteMapping("/games/{gameId}")
    public ResponseEntity<?> deleteGame(
            @PathVariable Long gameId) {

        gameService.deleteGame(gameId);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Game deleted successfully"
                )
        );
    }

    // =========================
    // QUESTIONS
    // =========================

    @PostMapping("/games/{gameId}/questions")
    public ResponseEntity<QuestionResponse>
    createQuestion(
            @PathVariable Long gameId,
            @Valid @RequestBody
            QuestionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        questionService.createQuestion(
                                gameId,
                                request
                        )
                );
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<QuestionResponse>
    updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody
            QuestionRequest request) {

        return ResponseEntity.ok(
                questionService.updateQuestion(
                        questionId,
                        request
                )
        );
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(
            @PathVariable Long questionId) {

        questionService.deleteQuestion(
                questionId
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Question deleted successfully"
                )
        );
    }
}