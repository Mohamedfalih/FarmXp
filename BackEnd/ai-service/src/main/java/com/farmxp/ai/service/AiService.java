package com.farmxp.ai.service;

import com.farmxp.ai.dto.*;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    public ChatResponse chat(
            ChatRequest request) {

        /*
         * Gemini integration will be connected here.
         */

        return new ChatResponse(
                "AI response for: "
                + request.getMessage()
        );
    }

    public RecommendationResponse
    recommendation(
            RecommendationRequest request) {

        String result =
                "Farming recommendation for "
                + request.getCropName()
                + " during "
                + request.getSeason()
                + " season in "
                + request.getState();

        return new RecommendationResponse(
                result
        );
    }
}