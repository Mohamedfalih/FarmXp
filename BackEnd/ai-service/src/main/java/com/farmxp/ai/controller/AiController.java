package com.farmxp.ai.controller;

import com.farmxp.ai.dto.*;
import com.farmxp.ai.service.AiService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody
            ChatRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization");
        Long farmerId = extractFarmerIdFromHeader(token);
        return ResponseEntity.ok(
                aiService.chat(request, farmerId, token)
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

    @GetMapping("/ml-recommendation")
    public ResponseEntity<MlRecommendationResponse> mlRecommendation(jakarta.servlet.http.HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        Long farmerId = extractFarmerIdFromHeader(token);
        return ResponseEntity.ok(aiService.getMlRecommendation(farmerId, token));
    }

    private Long extractFarmerIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String[] parts = token.split("\\.");
                if (parts.length == 3) {
                    String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
                    // Extract "sub":"..."
                    java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"userId\"\\s*:\\s*(\\d+)").matcher(payload);
                    if (m.find()) {
                        return Long.parseLong(m.group(1));
                    }
                    // Fallback to sub if userId is missing but sub is numeric
                    m = java.util.regex.Pattern.compile("\"sub\"\\s*:\\s*\"?(\\d+)\"?").matcher(payload);
                    if (m.find()) {
                        return Long.parseLong(m.group(1));
                    }
                }
            } catch (Exception e) {}
        }
        return null;
    }
}