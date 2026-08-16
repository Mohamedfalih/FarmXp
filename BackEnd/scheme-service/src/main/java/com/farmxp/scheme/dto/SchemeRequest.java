package com.farmxp.scheme.dto;

import com.farmxp.scheme.enums.SchemeStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class SchemeRequest {

    @NotBlank(message = "Scheme title is required")
    private String title;

    @NotBlank(message = "Scheme description is required")
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

    @NotNull(message = "Scheme status is required")
    private SchemeStatus status;

    public SchemeRequest() {
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
}