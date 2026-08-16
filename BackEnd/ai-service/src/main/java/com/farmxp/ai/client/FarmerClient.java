package com.farmxp.ai.client;

import com.farmxp.ai.dto.client.FarmerProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "FARMER-SERVICE", path = "/api/farmers/internal")
public interface FarmerClient {
    @GetMapping("/{farmerId}")
    FarmerProfile getFarmerProfile(@org.springframework.web.bind.annotation.RequestHeader("Authorization") String token, @PathVariable("farmerId") Long farmerId);
}
