package com.farmxp.ai.client;

import com.farmxp.ai.dto.client.LearningSummary;
import com.farmxp.ai.dto.client.ModuleItem;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "LEARNING-SERVICE")
public interface LearningClient {
    @GetMapping("/api/learning/internal/summary/{farmerId}")
    LearningSummary getLearningSummary(@org.springframework.web.bind.annotation.RequestHeader("Authorization") String token, @PathVariable("farmerId") Long farmerId);

    @GetMapping("/api/learning/modules")
    List<ModuleItem> getPublishedModules(@org.springframework.web.bind.annotation.RequestHeader("Authorization") String token);
}
