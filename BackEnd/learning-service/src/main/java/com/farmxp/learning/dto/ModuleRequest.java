package com.farmxp.learning.dto;

import com.farmxp.learning.enums.ModuleStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ModuleRequest {

    @NotBlank(message = "Module title is required")
    private String title;

    private String description;

    private String thumbnailUrl;

    @NotNull(message = "Module status is required")
    private ModuleStatus status;

    @NotNull(message = "Display order is required")
    @PositiveOrZero(message = "Display order cannot be negative")
    private Integer displayOrder;

    public ModuleRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public ModuleStatus getStatus() {
        return status;
    }

    public void setStatus(ModuleStatus status) {
        this.status = status;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}