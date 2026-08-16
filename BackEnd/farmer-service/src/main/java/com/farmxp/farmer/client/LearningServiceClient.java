package com.farmxp.farmer.client;

import com.farmxp.farmer.dto.LearningSummaryResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "learning-service"
)
public interface LearningServiceClient {

    @GetMapping(
            "/api/learning/progress/summary"
    )
    LearningSummaryResponse getLearningSummary();

    @GetMapping(
            "/api/learning/progress/admin/summary/{farmerId}"
    )
    LearningSummaryResponse getFarmerSummary(@org.springframework.web.bind.annotation.PathVariable("farmerId") Long farmerId);
}