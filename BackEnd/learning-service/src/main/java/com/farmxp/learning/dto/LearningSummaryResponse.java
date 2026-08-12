package com.farmxp.learning.dto;

public class LearningSummaryResponse {

    private Long farmerId;
    private Integer totalModules;
    private Integer completedModules;
    private Double overallCompletionPercentage;
    private Integer totalGamesCompleted;
    private Integer totalGames;

    public LearningSummaryResponse() {
    }

    public LearningSummaryResponse(
            Long farmerId,
            Integer totalModules,
            Integer completedModules,
            Double overallCompletionPercentage,
            Integer totalGamesCompleted,
            Integer totalGames) {

        this.farmerId = farmerId;
        this.totalModules = totalModules;
        this.completedModules = completedModules;
        this.overallCompletionPercentage =
                overallCompletionPercentage;
        this.totalGamesCompleted = totalGamesCompleted;
        this.totalGames = totalGames;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public Integer getTotalModules() {
        return totalModules;
    }

    public Integer getCompletedModules() {
        return completedModules;
    }

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public Integer getTotalGamesCompleted() {
        return totalGamesCompleted;
    }

    public Integer getTotalGames() {
        return totalGames;
    }
}