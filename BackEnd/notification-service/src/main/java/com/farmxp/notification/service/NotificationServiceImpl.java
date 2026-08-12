package com.farmxp.notification.service;

import com.farmxp.notification.dto.NotificationRequest;
import com.farmxp.notification.dto.NotificationResponse;
import com.farmxp.notification.entity.Notification;
import com.farmxp.notification.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(
            NotificationRequest request) {

        Notification notification =
                new Notification(
                        request.userId(),
                        request.title(),
                        request.message(),
                        request.notificationType()
                );

        Notification saved =
                notificationRepository.save(notification);

        return NotificationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUser(
            Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
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

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(
            Long notificationId) {

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

    @Override
    @Transactional
    public void markAllAsRead(
            Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                                userId
                        );

        for (Notification notification : notifications) {

            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional
    public void deleteNotification(
            Long notificationId) {

        if (!notificationRepository.existsById(
                notificationId)) {

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