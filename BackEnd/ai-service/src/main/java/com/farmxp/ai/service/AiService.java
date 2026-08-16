package com.farmxp.ai.service;

import com.farmxp.ai.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final RestClient restClient;
    private final RestClient pythonClient;
    private final String geminiApiKey;

    private final com.farmxp.ai.client.FarmerClient farmerClient;
    private final com.farmxp.ai.client.LearningClient learningClient;
    private final com.farmxp.ai.client.SustainabilityClient sustainabilityClient;

    public AiService(
            @Value("${gemini.api.key:}") String geminiApiKey,
            com.farmxp.ai.client.FarmerClient farmerClient,
            com.farmxp.ai.client.LearningClient learningClient,
            com.farmxp.ai.client.SustainabilityClient sustainabilityClient) {
        
        this.geminiApiKey = geminiApiKey;
        this.farmerClient = farmerClient;
        this.learningClient = learningClient;
        this.sustainabilityClient = sustainabilityClient;
        
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = 
                new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(12000);
        
        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
                
        this.pythonClient = RestClient.builder()
                .requestFactory(factory)
                .baseUrl("http://localhost:8000")
                .build();
    }

    public ChatResponse chat(ChatRequest request, Long farmerId, String token) {
        
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API Key is not configured.");
            return new ChatResponse("⚠️ Sorry, I'm having trouble connecting right now. Please check your connection and try again. [LIVE GEMINI TEST BLOCKED — GEMINI_API_KEY NOT CONFIGURED]");
        }

        long chatStart = System.currentTimeMillis();
        String contextPrompt = "";
        if (farmerId != null && token != null) {
            long t0 = System.currentTimeMillis();
            com.farmxp.ai.dto.client.FarmerProfile farmer = null;
            try { farmer = farmerClient.getFarmerProfile(token, farmerId); } catch (Exception e) {
                log.error("Failed to fetch Farmer Profile: {}", e.getMessage());
            }
            long t1 = System.currentTimeMillis();
            log.info("Farmer context: {} ms", (t1 - t0));
            
            com.farmxp.ai.dto.client.SustainabilityScore score = null;
            try { score = sustainabilityClient.getScore(token, farmerId); } catch (Exception e) {
                log.error("Failed to fetch Sustainability Score: {}", e.getMessage());
            }
            long t2 = System.currentTimeMillis();
            log.info("Sustainability context: {} ms", (t2 - t1));
            
            com.farmxp.ai.dto.client.LearningSummary learning = null;
            try { learning = learningClient.getLearningSummary(token, farmerId); } catch (Exception e) {
                log.error("Failed to fetch Learning Summary: {}", e.getMessage());
            }
            long t3 = System.currentTimeMillis();
            log.info("Learning context: {} ms", (t3 - t2));
            List<com.farmxp.ai.dto.client.ModuleItem> modules = null;
            try { modules = learningClient.getPublishedModules(token); } catch (Exception e) {
                log.error("Failed to fetch Published Modules: {}", e.getMessage());
            }

            contextPrompt = "You are the FarmXP AI Assistant.\n" +
                "You are assisting a farmer inside the FarmXP application.\n" +
                "The following is the authenticated farmer's real FarmXP data retrieved from internal backend services.\n\n" +
                "Farmer ID: " + farmerId + "\n";
            
            if (farmer != null) {
                contextPrompt += "Current XP: " + farmer.getTotalXp() + "\n";
            }
            if (score != null && score.getTotalScore() != null) {
                contextPrompt += "Sustainability Score: " + score.getTotalScore() + "\n";
            }
            if (learning != null && learning.getCompletedModules() != null) {
                contextPrompt += "Completed Modules Count: " + learning.getCompletedModules() + "\n";
            }
            if (modules != null && !modules.isEmpty()) {
                contextPrompt += "Available Learning Modules:\n";
                for (com.farmxp.ai.dto.client.ModuleItem m : modules) {
                    contextPrompt += "- " + m.getTitle() + " (Category: " + m.getCategory() + ")\n";
                }
            }
            
            contextPrompt += "\nIMPORTANT:\n" +
                "Use this FarmXP context when answering the farmer's questions.\n" +
                "Do not claim that you cannot access the farmer's account when the requested information is present in the supplied context.\n" +
                "Do not invent values.\n" +
                "If the requested information is not available in the supplied context, clearly say that the information is currently unavailable.\n\n" +
                "User question:\n";
        }

        try {
            Map<String, Object> payload = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", contextPrompt + request.getMessage())
                    ))
                )
            );

            long g0 = System.currentTimeMillis();
            GeminiResponse response = restClient.post()
                    .uri(java.net.URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + geminiApiKey))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(GeminiResponse.class);
            long g1 = System.currentTimeMillis();
            log.info("Gemini request: {} ms", (g1 - g0));
            log.info("AI CHAT TOTAL: {} ms", (g1 - chatStart));

            if (response != null && response.candidates != null && !response.candidates.isEmpty()) {
                String text = response.candidates.get(0).content.parts.get(0).text;
                return new ChatResponse(text);
            }

            return new ChatResponse("I'm sorry, I couldn't get a response. Please try again.");
            
        } catch (HttpClientErrorException.Unauthorized | HttpClientErrorException.Forbidden e) {
            return new ChatResponse("⚠️ AI service configuration error (Invalid API Key).");
        } catch (HttpClientErrorException.TooManyRequests e) {
            return new ChatResponse("⚠️ The AI service is currently busy. Please try again later.");
        } catch (HttpServerErrorException e) {
            return new ChatResponse("⚠️ The AI service is experiencing technical difficulties. Please try again later.");
        } catch (Exception e) {
            System.err.println("Gemini connection error:");
            e.printStackTrace();
            return new ChatResponse("⚠️ Sorry, I'm having trouble connecting right now.");
        }
    }

    public RecommendationResponse recommendation(RecommendationRequest request) {

        String prompt = "Give a brief farming recommendation for " 
                + request.getCropName() + " during " + request.getSeason() 
                + " season in " + request.getState() + ".";
                
        ChatRequest chatReq = new ChatRequest();
        chatReq.setMessage(prompt);
        ChatResponse chatResponse = chat(chatReq, null, null);
        
        return new RecommendationResponse(chatResponse.getReply());
    }

    public MlRecommendationResponse getMlRecommendation(Long farmerId, String token) {
        // Fetch data from other microservices
        com.farmxp.ai.dto.client.FarmerProfile farmer = null;
        try { farmer = farmerClient.getFarmerProfile(token, farmerId); } catch (Exception e) {
            log.error("Failed to fetch Farmer Profile for farmerId {}: {}", farmerId, e.getMessage());
        }
        
        com.farmxp.ai.dto.client.LearningSummary learning = null;
        try { learning = learningClient.getLearningSummary(token, farmerId); } catch (Exception e) {
            log.error("Failed to fetch Learning Summary for farmerId {}: {}", farmerId, e.getMessage());
        }
        
        com.farmxp.ai.dto.client.SustainabilityScore score = null;
        try { score = sustainabilityClient.getScore(token, farmerId); } catch (Exception e) {
            log.error("Failed to fetch Sustainability Score for farmerId {}: {}", farmerId, e.getMessage());
        }
        
        List<com.farmxp.ai.dto.client.ModuleItem> modules = null;
        try { modules = learningClient.getPublishedModules(token); } catch (Exception e) {
            log.error("Failed to fetch Published Modules: {}", e.getMessage());
        }
        
        if (modules == null) {
            modules = List.of();
        }

        // Build request for Python engine
        Map<String, Object> farmerContext = new java.util.HashMap<>();
        farmerContext.put("farmerId", farmerId);
        farmerContext.put("xp", farmer != null && farmer.getTotalXp() != null ? farmer.getTotalXp() : 0);
        farmerContext.put("sustainabilityScore", score != null && score.getTotalScore() != null ? score.getTotalScore() : 0.0);
        farmerContext.put("completedModules", learning != null && learning.getCompletedModules() != null ? learning.getCompletedModules() : 0);

        Map<String, Object> payload = Map.of(
            "farmer", farmerContext,
            "availableModules", modules
        );

        try {
            return pythonClient.post()
                    .uri("/recommend")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(MlRecommendationResponse.class);
        } catch (Exception e) {
            // Fallback response if Python is down
            MlRecommendationResponse fallback = new MlRecommendationResponse();
            fallback.setFarmerId(farmerId);
            fallback.setCluster("BEGINNER");
            fallback.setRecommendedModuleId(1L);
            fallback.setRecommendedModuleTitle("Getting Started with Sustainability");
            fallback.setReason("Our ML engine is currently initializing. Here's a great starter module!");
            fallback.setImpactScore(10.0);
            fallback.setExpectedBenefits(Map.of("water", "Medium", "chemical", "Medium", "yield", "Medium"));
            return fallback;
        }
    }

    private static class GeminiResponse {
        public List<Candidate> candidates;
        
        public static class Candidate {
            public Content content;
        }
        
        public static class Content {
            public List<Part> parts;
        }
        
        public static class Part {
            public String text;
        }
    }
}