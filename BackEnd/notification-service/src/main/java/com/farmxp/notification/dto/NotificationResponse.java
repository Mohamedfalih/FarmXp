package com.farmxp.notification.dto;

import java.time.LocalDateTime;

import com.farmxp.notification.entity.Notification;
import com.farmxp.notification.enums.NotificationType;

public record NotificationResponse(

        String notificationId,

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
                NotificationType.valueOf(
                        notification.getNotificationType()
                ),
                notification.getRead(),
                notification.getCreatedAt()
        );
    }
}