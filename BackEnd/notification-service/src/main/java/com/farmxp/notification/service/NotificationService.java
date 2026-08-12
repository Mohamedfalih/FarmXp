package com.farmxp.notification.service;

import com.farmxp.notification.dto.NotificationRequest;
import com.farmxp.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(
            NotificationRequest request
    );

    List<NotificationResponse> getNotificationsByUser(
            Long userId
    );

    List<NotificationResponse> getUnreadNotifications(
            Long userId
    );

    long getUnreadCount(
            Long userId
    );

    NotificationResponse markAsRead(
            Long notificationId
    );

    void markAllAsRead(
            Long userId
    );

    void deleteNotification(
            Long notificationId
    );
}