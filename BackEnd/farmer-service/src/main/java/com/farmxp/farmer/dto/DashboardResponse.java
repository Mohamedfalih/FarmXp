package com.farmxp.farmer.dto;

import java.util.List;

public class DashboardResponse {

    private FarmerProfileResponse farmer;
    private List<CropResponse> crops;
    private LearningSummaryResponse learning;
    private SustainabilityScoreResponse
            sustainability;

    public DashboardResponse() {
    }

    public DashboardResponse(
            FarmerProfileResponse farmer,
            List<CropResponse> crops,
            LearningSummaryResponse learning,
            SustainabilityScoreResponse
                    sustainability) {

        this.farmer = farmer;
        this.crops = crops;
        this.learning = learning;
        this.sustainability =
                sustainability;
    }

    public FarmerProfileResponse getFarmer() {
        return farmer;
    }

    public void setFarmer(
            FarmerProfileResponse farmer) {

        this.farmer = farmer;
    }

    public List<CropResponse> getCrops() {
        return crops;
    }

    public void setCrops(
            List<CropResponse> crops) {

        this.crops = crops;
    }

    public LearningSummaryResponse getLearning() {
        return learning;
    }

    public void setLearning(
            LearningSummaryResponse learning) {

        this.learning = learning;
    }

    public SustainabilityScoreResponse
    getSustainability() {

        return sustainability;
    }

    public void setSustainability(
            SustainabilityScoreResponse
                    sustainability) {

        this.sustainability =
                sustainability;
    }
}