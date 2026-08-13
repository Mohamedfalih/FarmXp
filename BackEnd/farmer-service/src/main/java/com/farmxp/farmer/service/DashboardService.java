package com.farmxp.farmer.service;

import com.farmxp.farmer.client.LearningServiceClient;
import com.farmxp.farmer.client.SustainabilityServiceClient;

import com.farmxp.farmer.dto.CropResponse;
import com.farmxp.farmer.dto.DashboardResponse;
import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.dto.LearningSummaryResponse;
import com.farmxp.farmer.dto.SustainabilityScoreResponse;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final FarmerService farmerService;
    private final CropService cropService;

    private final LearningServiceClient
            learningServiceClient;

    private final SustainabilityServiceClient
            sustainabilityServiceClient;

    public DashboardService(
            FarmerService farmerService,
            CropService cropService,
            LearningServiceClient
                    learningServiceClient,
            SustainabilityServiceClient
                    sustainabilityServiceClient) {

        this.farmerService = farmerService;
        this.cropService = cropService;

        this.learningServiceClient =
                learningServiceClient;

        this.sustainabilityServiceClient =
                sustainabilityServiceClient;
    }

    public DashboardResponse getDashboard(
            Long userId) {

        // ==========================================
        // FARMER PROFILE
        // ==========================================

        FarmerProfileResponse farmer =
                farmerService.getProfile(userId);

        // ==========================================
        // CROPS
        // ==========================================

        List<CropResponse> crops =
                cropService.getMyCrops(userId);

        // ==========================================
        // LEARNING SERVICE
        // ==========================================

        LearningSummaryResponse learning =
                learningServiceClient
                        .getLearningSummary();

        // ==========================================
        // SUSTAINABILITY SERVICE
        // ==========================================

        SustainabilityScoreResponse
                sustainability =
                sustainabilityServiceClient
                        .getSustainabilityScore();

        // ==========================================
        // COMBINE EVERYTHING
        // ==========================================

        return new DashboardResponse(
                farmer,
                crops,
                learning,
                sustainability
        );
    }
}