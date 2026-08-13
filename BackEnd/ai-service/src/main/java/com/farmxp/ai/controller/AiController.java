package com.farmxp.ai.controller;

import com.farmxp.ai.dto.*;
import com.farmxp.ai.service.AiService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody
            ChatRequest request) {

        return ResponseEntity.ok(
                aiService.chat(request)
        );
    }

    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationResponse>
    recommendation(
            @RequestBody
            RecommendationRequest request) {

        return ResponseEntity.ok(
                aiService.recommendation(
                        request)
        );
    }
}