package com.farmxp.learning.controller;

import com.farmxp.learning.dto.AnswerRequest;
import com.farmxp.learning.dto.AnswerResponse;
import com.farmxp.learning.service.QuestionService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(
            QuestionService questionService) {

        this.questionService = questionService;
    }

    @PostMapping("/check-answer")
    public ResponseEntity<AnswerResponse>
    checkAnswer(
            @Valid @RequestBody
            AnswerRequest request) {

        return ResponseEntity.ok(
                questionService.checkAnswer(request)
        );
    }
}