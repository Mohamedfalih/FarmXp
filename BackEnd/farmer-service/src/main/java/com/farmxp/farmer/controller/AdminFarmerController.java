package com.farmxp.farmer.controller;

import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.service.FarmerService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFarmerController {

    private final FarmerService farmerService;

    public AdminFarmerController(
            FarmerService farmerService) {

        this.farmerService = farmerService;
    }

    @GetMapping
    public ResponseEntity<List<com.farmxp.farmer.dto.AdminFarmerListResponse>>
    getAllFarmers() {

        return ResponseEntity.ok(
                farmerService.getAllFarmers()
        );
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<com.farmxp.farmer.dto.AdminFarmerDetailResponse>
    getFarmer(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                farmerService.getAdminFarmerDetails(
                        farmerId)
        );
    }
}