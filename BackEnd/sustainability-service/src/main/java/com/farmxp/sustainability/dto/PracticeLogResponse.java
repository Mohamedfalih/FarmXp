package com.farmxp.sustainability.dto;

import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;

import java.time.LocalDateTime;

public class PracticeLogResponse {

    private Long practiceLogId;
    private Long farmerId;
    private String farmerName;
    private String farmerEmail;
    private SustainabilityCategory category;
    private String practiceName;
    private String description;
    private String evidence;
    private PracticeStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;

    public PracticeLogResponse() {
    }

    public Long getPracticeLogId() {
        return practiceLogId;
    }

    public void setPracticeLogId(Long practiceLogId) {
        this.practiceLogId = practiceLogId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmerEmail() {
        return farmerEmail;
    }

    public void setFarmerEmail(String farmerEmail) {
        this.farmerEmail = farmerEmail;
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

    public PracticeStatus getStatus() {
        return status;
    }

    public void setStatus(PracticeStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}