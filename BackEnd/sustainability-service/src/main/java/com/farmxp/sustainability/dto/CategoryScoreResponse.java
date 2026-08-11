package com.farmxp.sustainability.dto;

import com.farmxp.sustainability.enums.SustainabilityCategory;

public class CategoryScoreResponse {

    private SustainabilityCategory category;
    private Integer score;
    private Integer maxScore;

    public CategoryScoreResponse() {
    }

    public CategoryScoreResponse(
            SustainabilityCategory category,
            Integer score,
            Integer maxScore) {

        this.category = category;
        this.score = score;
        this.maxScore = maxScore;
    }

    public SustainabilityCategory getCategory() {
        return category;
    }

    public void setCategory(SustainabilityCategory category) {
        this.category = category;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }
}