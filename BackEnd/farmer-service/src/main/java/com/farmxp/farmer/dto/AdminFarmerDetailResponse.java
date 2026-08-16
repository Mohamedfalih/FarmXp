package com.farmxp.farmer.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AdminFarmerDetailResponse {
    private FarmerProfileResponse profile;
    private SustainabilityScoreResponse sustainability;
    private LearningSummaryResponse learning;
    private String email;
    private String joinedDate;
    private String primaryCrop;
    private String farmingType;

    public AdminFarmerDetailResponse() {
    }

    public FarmerProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(FarmerProfileResponse profile) {
        this.profile = profile;
    }

    public SustainabilityScoreResponse getSustainability() {
        return sustainability;
    }

    public void setSustainability(SustainabilityScoreResponse sustainability) {
        this.sustainability = sustainability;
    }

    public LearningSummaryResponse getLearning() {
        return learning;
    }

    public void setLearning(LearningSummaryResponse learning) {
        this.learning = learning;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(String joinedDate) {
        this.joinedDate = joinedDate;
    }

    public String getPrimaryCrop() {
        return primaryCrop;
    }

    public void setPrimaryCrop(String primaryCrop) {
        this.primaryCrop = primaryCrop;
    }

    public String getFarmingType() {
        return farmingType;
    }

    public void setFarmingType(String farmingType) {
        this.farmingType = farmingType;
    }
}
