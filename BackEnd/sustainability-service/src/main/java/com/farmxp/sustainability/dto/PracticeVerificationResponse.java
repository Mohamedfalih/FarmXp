package com.farmxp.sustainability.dto;

import com.farmxp.sustainability.enums.PracticeStatus;

public class PracticeVerificationResponse {

    private Long practiceLogId;
    private PracticeStatus status;
    private String message;

    public PracticeVerificationResponse() {
    }

    public PracticeVerificationResponse(
            Long practiceLogId,
            PracticeStatus status,
            String message) {

        this.practiceLogId = practiceLogId;
        this.status = status;
        this.message = message;
    }

    public Long getPracticeLogId() {
        return practiceLogId;
    }

    public void setPracticeLogId(Long practiceLogId) {
        this.practiceLogId = practiceLogId;
    }

    public PracticeStatus getStatus() {
        return status;
    }

    public void setStatus(PracticeStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}