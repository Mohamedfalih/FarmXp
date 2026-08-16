package com.farmxp.scheme.dto;

import com.farmxp.scheme.enums.SchemeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SchemeResponse {

    private Long schemeId;

    private String title;

    private String description;

    private String eligibility;

    private String benefits;

    private String applicationUrl;

    private String officialWebsiteUrl;

    private String department;

    private String state;

    private Double minFarmSize;

    private String applicableCrops;

    private LocalDate lastDate;

    private SchemeStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public SchemeResponse() {
    }

    public SchemeResponse(
            Long schemeId,
            String title,
            String description,
            String eligibility,
            String benefits,
            String applicationUrl,
            String officialWebsiteUrl,
            String department,
            String state,
            Double minFarmSize,
            String applicableCrops,
            LocalDate lastDate,
            SchemeStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {

        this.schemeId = schemeId;
        this.title = title;
        this.description = description;
        this.eligibility = eligibility;
        this.benefits = benefits;
        this.applicationUrl = applicationUrl;
        this.officialWebsiteUrl = officialWebsiteUrl;
        this.department = department;
        this.state = state;
        this.minFarmSize = minFarmSize;
        this.applicableCrops = applicableCrops;
        this.lastDate = lastDate;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(Long schemeId) {
        this.schemeId = schemeId;
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

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public void setApplicationUrl(String applicationUrl) {
        this.applicationUrl = applicationUrl;
    }

    public String getOfficialWebsiteUrl() {
        return officialWebsiteUrl;
    }

    public void setOfficialWebsiteUrl(String officialWebsiteUrl) {
        this.officialWebsiteUrl = officialWebsiteUrl;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Double getMinFarmSize() {
        return minFarmSize;
    }

    public void setMinFarmSize(Double minFarmSize) {
        this.minFarmSize = minFarmSize;
    }

    public String getApplicableCrops() {
        return applicableCrops;
    }

    public void setApplicableCrops(String applicableCrops) {
        this.applicableCrops = applicableCrops;
    }

    public LocalDate getLastDate() {
        return lastDate;
    }

    public void setLastDate(LocalDate lastDate) {
        this.lastDate = lastDate;
    }

    public SchemeStatus getStatus() {
        return status;
    }

    public void setStatus(SchemeStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}