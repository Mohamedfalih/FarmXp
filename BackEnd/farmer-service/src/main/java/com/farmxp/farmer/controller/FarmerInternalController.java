package com.farmxp.farmer.controller;

import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.service.FarmerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/farmers/internal")
public class FarmerInternalController {

    private final FarmerService farmerService;

    public FarmerInternalController(
            FarmerService farmerService) {

        this.farmerService = farmerService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<FarmerProfileResponse>> getAllFarmers() {
        return ResponseEntity.ok(farmerService.getAllProfiles());
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<FarmerProfileResponse>
    getFarmer(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                farmerService.getProfile(
                        farmerId)
        );
    }

    @PostMapping("/{farmerId}/xp")
    public ResponseEntity<Void> addXp(
            @PathVariable Long farmerId,
            @RequestParam Integer amount) {
        
        farmerService.addXp(farmerId, amount);
        return ResponseEntity.ok().build();
    }
}