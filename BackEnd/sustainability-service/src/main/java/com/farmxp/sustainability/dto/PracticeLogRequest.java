package com.farmxp.sustainability.dto;

import com.farmxp.sustainability.enums.SustainabilityCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PracticeLogRequest {

    @NotNull(message = "Category is required")
    private SustainabilityCategory category;

    @NotBlank(message = "Practice name is required")
    private String practiceName;

    private String description;

    private String evidence;

    public PracticeLogRequest() {
    }

    public SustainabilityCategory getCategory() {
        return category;
    }

    public void setCategory(SustainabilityCategory category) {
        this.category = category;
    }

    public String getPracticeName() {
        return practiceName;
    }

    public void setPracticeName(String practiceName) {
        this.practiceName = practiceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }
}