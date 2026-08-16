package com.farmxp.learning.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "farmer-service")
public interface FarmerServiceClient {

    @PostMapping("/api/farmers/internal/{farmerId}/xp")
    void addXp(@PathVariable("farmerId") Long farmerId, @RequestParam("amount") Integer amount);
}
