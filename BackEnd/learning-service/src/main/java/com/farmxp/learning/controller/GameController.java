package com.farmxp.learning.controller;

import com.farmxp.learning.dto.GameRequest;
import com.farmxp.learning.dto.GameResponse;
import com.farmxp.learning.dto.QuestionRequest;
import com.farmxp.learning.dto.QuestionResponse;
import com.farmxp.learning.service.GameService;
import com.farmxp.learning.service.QuestionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning/games")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    private final GameService gameService;
    private final QuestionService questionService;

    public GameController(
            GameService gameService,
            QuestionService questionService) {

        this.gameService = gameService;
        this.questionService = questionService;
    }

    // ==========================================
    // CREATE GAME
    // ==========================================

    @PostMapping("/module/{moduleId}")
    public ResponseEntity<GameResponse> createGame(
            @PathVariable Long moduleId,
            @Valid @RequestBody GameRequest request) {

        GameResponse response =
                gameService.createGame(
                        moduleId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // GET GAME
    // ==========================================

    @GetMapping("/{gameId}")
    public ResponseEntity<GameResponse> getGame(
            @PathVariable Long gameId) {

        return ResponseEntity.ok(
                gameService.getGame(gameId)
        );
    }

    // ==========================================
    // CREATE QUESTION
    // ==========================================

    @PostMapping("/{gameId}/questions")
    public ResponseEntity<QuestionResponse> createQuestion(
            @PathVariable Long gameId,
            @Valid @RequestBody QuestionRequest request) {

        QuestionResponse response =
                questionService.createQuestion(
                        gameId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // GET QUESTIONS FOR GAME
    // ==========================================

    @GetMapping("/{gameId}/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestions(
            @PathVariable Long gameId) {

        return ResponseEntity.ok(
                questionService.getQuestions(gameId)
        );
    }
}