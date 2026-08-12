package com.farmxp.notification.dto;

import com.farmxp.notification.entity.Notification;
import com.farmxp.notification.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(

        Long notificationId,

        Long userId,

        String title,

        String message,

        NotificationType notificationType,

        Boolean read,

        LocalDateTime createdAt

) {

    public static NotificationResponse fromEntity(
            Notification notification) {

        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getUserId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getNotificationType(),
                notification.getRead(),
                notification.getCreatedAt()
        );
    }
}