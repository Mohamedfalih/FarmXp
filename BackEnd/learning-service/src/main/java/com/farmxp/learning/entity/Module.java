package com.farmxp.learning.entity;

import com.farmxp.learning.enums.ModuleStatus;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "LEARNING_MODULE")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "module_seq")
    @SequenceGenerator(
            name = "module_seq",
            sequenceName = "LEARNING_MODULE_SEQ",
            allocationSize = 1
    )
    @Column(name = "module_id")
    private Long moduleId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(length = 1000)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModuleStatus status;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Module() {
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = ModuleStatus.DRAFT;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}