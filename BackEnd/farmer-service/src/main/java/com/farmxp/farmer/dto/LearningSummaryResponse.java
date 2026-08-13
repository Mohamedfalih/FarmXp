package com.farmxp.farmer.dto;

public class LearningSummaryResponse {

    private Long farmerId;
    private Integer totalModules;
    private Integer completedModules;
    private Double overallCompletionPercentage;
    private Integer totalGamesCompleted;
    private Integer totalGames;

    public LearningSummaryResponse() {
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Integer getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(Integer totalModules) {
        this.totalModules = totalModules;
    }

    public Integer getCompletedModules() {
        return completedModules;
    }

    public void setCompletedModules(
            Integer completedModules) {

        this.completedModules = completedModules;
    }

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public void setOverallCompletionPercentage(
            Double overallCompletionPercentage) {

        this.overallCompletionPercentage =
                overallCompletionPercentage;
    }

    public Integer getTotalGamesCompleted() {
        return totalGamesCompleted;
    }

    public void setTotalGamesCompleted(
            Integer totalGamesCompleted) {

        this.totalGamesCompleted =
                totalGamesCompleted;
    }

    public Integer getTotalGames() {
        return totalGames;
    }

    public void setTotalGames(Integer totalGames) {
        this.totalGames = totalGames;
    }
}