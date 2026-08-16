package com.farmxp.ai.dto;

import java.util.Map;

public class MlRecommendationResponse {
    private Long farmerId;
    private String cluster;
    private Long recommendedModuleId;
    private String recommendedModuleTitle;
    private String reason;
    private Double impactScore;
    private Map<String, String> expectedBenefits;

    // Getters and Setters

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getCluster() {
        return cluster;
    }

    public void setCluster(String cluster) {
        this.cluster = cluster;
    }

    public Long getRecommendedModuleId() {
        return recommendedModuleId;
    }

    public void setRecommendedModuleId(Long recommendedModuleId) {
        this.recommendedModuleId = recommendedModuleId;
    }

    public String getRecommendedModuleTitle() {
        return recommendedModuleTitle;
    }

    public void setRecommendedModuleTitle(String recommendedModuleTitle) {
        this.recommendedModuleTitle = recommendedModuleTitle;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Double getImpactScore() {
        return impactScore;
    }

    public void setImpactScore(Double impactScore) {
        this.impactScore = impactScore;
    }

    public Map<String, String> getExpectedBenefits() {
        return expectedBenefits;
    }

    public void setExpectedBenefits(Map<String, String> expectedBenefits) {
        this.expectedBenefits = expectedBenefits;
    }
}
