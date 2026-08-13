package com.farmxp.farmer.dto;

import java.util.List;

public class SustainabilityScoreResponse {

    private Long farmerId;
    private Integer totalScore;
    private Integer maxScore;
    private List<CategoryScoreResponse>
            categoryScores;

    public SustainabilityScoreResponse() {
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public List<CategoryScoreResponse>
    getCategoryScores() {

        return categoryScores;
    }

    public void setCategoryScores(
            List<CategoryScoreResponse>
                    categoryScores) {

        this.categoryScores =
                categoryScores;
    }
}