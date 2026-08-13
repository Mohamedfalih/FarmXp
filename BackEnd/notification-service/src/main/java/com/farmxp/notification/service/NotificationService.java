package com.farmxp.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.farmxp.notification.dto.NotificationRequest;
import com.farmxp.notification.dto.NotificationResponse;
import com.farmxp.notification.entity.Notification;
import com.farmxp.notification.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    public NotificationResponse createNotification(
            NotificationRequest request) {

        Notification notification =
                new Notification(
                        request.userId(),
                        request.title(),
                        request.message(),
                        request.notificationType().name()
                );

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notification.setRead(false);

        Notification saved =
                notificationRepository.save(notification);

        return NotificationResponse.fromEntity(saved);
    }

    // ==========================================
    // GET ALL USER NOTIFICATIONS
    // ==========================================

    public List<NotificationResponse> getUserNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    // ==========================================
    // GET UNREAD NOTIFICATIONS
    // ==========================================

    public List<NotificationResponse> getUnreadNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                        userId
                )
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    // ==========================================
    // COUNT UNREAD
    // ==========================================

    public long countUnreadNotifications(
            Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

    // ==========================================
    // MARK AS READ
    // ==========================================

    public NotificationResponse markAsRead(
            String notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found: "
                                                + notificationId
                                )
                        );

        notification.setRead(true);

        Notification updated =
                notificationRepository.save(notification);

        return NotificationResponse.fromEntity(updated);
    }

    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    public void markAllAsRead(
            Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                                userId
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }

    // ==========================================
    // DELETE
    // ==========================================

    public void deleteNotification(
            String notificationId) {

        if (!notificationRepository
                .existsById(notificationId)) {

            throw new RuntimeException(
                    "Notification not found: "
                            + notificationId
            );
        }

        notificationRepository.deleteById(
                notificationId
        );
    }
}