package com.farmxp.sustainability.client;

import com.farmxp.sustainability.dto.LearningSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "learning-service")
public interface LearningServiceClient {

    @GetMapping("/api/learning/internal/summary/{farmerId}")
    LearningSummaryResponse getLearningSummary(@PathVariable Long farmerId);
}
