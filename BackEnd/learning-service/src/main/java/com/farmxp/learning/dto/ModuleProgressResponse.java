package com.farmxp.learning.dto;

import com.farmxp.learning.enums.ProgressStatus;

public class ModuleProgressResponse {

    private Long moduleId;
    private String moduleTitle;
    private ProgressStatus status;
    private Integer completedGames;
    private Integer totalGames;
    private Double completionPercentage;

    public ModuleProgressResponse() {
    }

    public ModuleProgressResponse(
            Long moduleId,
            String moduleTitle,
            ProgressStatus status,
            Integer completedGames,
            Integer totalGames,
            Double completionPercentage) {

        this.moduleId = moduleId;
        this.moduleTitle = moduleTitle;
        this.status = status;
        this.completedGames = completedGames;
        this.totalGames = totalGames;
        this.completionPercentage = completionPercentage;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public String getModuleTitle() {
        return moduleTitle;
    }

    public ProgressStatus getStatus() {
        return status;
    }

    public Integer getCompletedGames() {
        return completedGames;
    }

    public Integer getTotalGames() {
        return totalGames;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }
}