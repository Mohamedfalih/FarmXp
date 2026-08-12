package com.farmxp.learning.dto;

import com.farmxp.learning.enums.ModuleStatus;

import java.time.LocalDateTime;

public class ModuleResponse {

    private Long moduleId;
    private String title;
    private String description;
    private String thumbnailUrl;
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
            ModuleStatus status,
            Integer displayOrder,
            LocalDateTime createdAt) {

        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
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