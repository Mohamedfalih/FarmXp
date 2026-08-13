package com.farmxp.learning.dto;

import com.farmxp.learning.enums.ModuleStatus;

import java.time.LocalDateTime;

public class ModuleResponse {

    private Long moduleId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String category;
    private String icon;
    private String videoUrl;
    private Integer durationMinutes;
    private Integer xpReward;
    private String objectives;
    private ModuleStatus status;
    private Integer displayOrder;
    private LocalDateTime createdAt;

    public ModuleResponse() {
    }

    public ModuleResponse(
            Long moduleId,
            String title,
            String description,
            String thumbnailUrl,
            String category,
            String icon,
            String videoUrl,
            Integer durationMinutes,
            Integer xpReward,
            String objectives,
            ModuleStatus status,
            Integer displayOrder,
            LocalDateTime createdAt) {

        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.icon = icon;
        this.videoUrl = videoUrl;
        this.durationMinutes = durationMinutes;
        this.xpReward = xpReward;
        this.objectives = objectives;
        this.status = status;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getCategory() {
        return category;
    }

    public String getIcon() {
        return icon;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public String getObjectives() {
        return objectives;
    }

    public ModuleStatus getStatus() {
        return status;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}