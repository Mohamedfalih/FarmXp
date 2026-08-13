package com.farmxp.farmer.client;

import com.farmxp.farmer.dto.SustainabilityScoreResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "sustainability-service"
)
public interface SustainabilityServiceClient {

    @GetMapping(
            "/api/sustainability/score"
    )
    SustainabilityScoreResponse getSustainabilityScore();
}