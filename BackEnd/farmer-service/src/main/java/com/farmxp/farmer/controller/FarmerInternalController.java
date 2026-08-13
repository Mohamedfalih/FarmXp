package com.farmxp.farmer.controller;

import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.service.FarmerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmers/internal")
public class FarmerInternalController {

    private final FarmerService farmerService;

    public FarmerInternalController(
            FarmerService farmerService) {

        this.farmerService = farmerService;
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<FarmerProfileResponse>
    getFarmer(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                farmerService.getFarmerById(
                        farmerId)
        );
    }
}