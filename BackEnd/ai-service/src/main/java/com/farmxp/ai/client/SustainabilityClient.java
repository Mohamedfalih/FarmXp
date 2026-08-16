package com.farmxp.ai.client;

import com.farmxp.ai.dto.client.SustainabilityScore;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SUSTAINABILITY-SERVICE", path = "/api/sustainability/internal")
public interface SustainabilityClient {
    @GetMapping("/score/{farmerId}")
    SustainabilityScore getScore(@org.springframework.web.bind.annotation.RequestHeader("Authorization") String token, @PathVariable("farmerId") Long farmerId);
}
