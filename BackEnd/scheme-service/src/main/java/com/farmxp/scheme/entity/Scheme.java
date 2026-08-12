package com.farmxp.scheme.entity;

import com.farmxp.scheme.enums.SchemeStatus;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "GOVT_SCHEMES")
public class Scheme {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "scheme_seq"
    )
    @SequenceGenerator(
            name = "scheme_seq",
            sequenceName = "GOVT_SCHEMES_SEQ",
            allocationSize = 1
    )
    @Column(name = "SCHEME_ID")
    private Long schemeId;

    @Column(
            name = "TITLE",
            nullable = false,
            length = 200
    )
    private String title;

    @Column(
            name = "DESCRIPTION",
            length = 2000
    )
    private String description;

    @Column(
            name = "ELIGIBILITY",
            length = 2000
    )
    private String eligibility;

    @Column(
            name = "BENEFITS",
            length = 2000
    )
    private String benefits;

    @Column(
            name = "APPLICATION_URL",
            length = 1000
    )
    private String applicationUrl;

    @Column(
            name = "DEPARTMENT",
            length = 200
    )
    private String department;

    @Column(
            name = "STATE",
            length = 100
    )
    private String state;

    @Column(name = "LAST_DATE")
    private LocalDate lastDate;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "STATUS",
            nullable = false,
            length = 20
    )
    private SchemeStatus status;

    @Column(
            name = "CREATED_AT",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public Scheme() {
    }

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;

        if (this.status == null) {
            this.status = SchemeStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        this.updatedAt = LocalDateTime.now();
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