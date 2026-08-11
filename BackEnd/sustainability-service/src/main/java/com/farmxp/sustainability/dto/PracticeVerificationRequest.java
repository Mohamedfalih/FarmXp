package com.farmxp.sustainability.dto;

import jakarta.validation.constraints.NotNull;

public class PracticeVerificationRequest {

    @NotNull(message = "Verification status is required")
    private Boolean approved;

    private String rejectionReason;

    public PracticeVerificationRequest() {
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}