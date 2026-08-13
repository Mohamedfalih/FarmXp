package com.farmxp.sustainability.client;

import com.farmxp.sustainability.dto.FarmerProfileResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "farmer-service")
public interface FarmerServiceClient {

    @GetMapping(
            "/api/farmers/internal/{farmerId}")
    FarmerProfileResponse getFarmer(
            @PathVariable Long farmerId);
}