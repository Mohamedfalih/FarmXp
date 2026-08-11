package com.farmxp.sustainability.entity;

import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CERTIFIED_PRACTICE_LOG")
public class CertifiedPracticeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "practice_log_seq")
    @SequenceGenerator(
            name = "practice_log_seq",
            sequenceName = "CERTIFIED_PRACTICE_LOG_SEQ",
            allocationSize = 1
    )
    @Column(name = "PRACTICE_LOG_ID")
    private Long practiceLogId;

    @Column(name = "FARMER_ID", nullable = false)
    private Long farmerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORY", nullable = false)
    private SustainabilityCategory category;

    @Column(name = "PRACTICE_NAME", nullable = false, length = 150)
    private String practiceName;

    @Column(name = "DESCRIPTION", length = 500)
    private String description;

    @Column(name = "EVIDENCE", length = 500)
    private String evidence;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private PracticeStatus status;

    @Column(name = "REJECTION_REASON", length = 500)
    private String rejectionReason;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "VERIFIED_AT")
    private LocalDateTime verifiedAt;

    @Column(name = "VERIFIED_BY")
    private Long verifiedBy;

    public CertifiedPracticeLog() {
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

    public Long getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(Long verifiedBy) {
        this.verifiedBy = verifiedBy;
    }
}