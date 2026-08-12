package com.farmxp.notification.entity;

import com.farmxp.notification.enums.NotificationType;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "notification_seq_generator"
    )
    @SequenceGenerator(
            name = "notification_seq_generator",
            sequenceName = "NOTIFICATION_SEQ",
            allocationSize = 1
    )
    @Column(name = "notification_id")
    private Long notificationId;

    @Column(
            name = "user_id",
            nullable = false
    )
    private Long userId;

    @Column(
            name = "title",
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            name = "message",
            nullable = false,
            length = 1000
    )
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "notification_type",
            nullable = false,
            length = 50
    )
    private NotificationType notificationType;

    @Column(
            name = "is_read",
            nullable = false
    )
    private Boolean read = false;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    public Notification() {
    }

    public Notification(
            Long userId,
            String title,
            String message,
            NotificationType notificationType) {

        this.userId = userId;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (read == null) {
            read = false;
        }
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(
            NotificationType notificationType) {

        this.notificationType = notificationType;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }
}