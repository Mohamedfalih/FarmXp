package com.farmxp.notification.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmxp.notification.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);
    
    Optional<Notification> findByNotificationIdAndUserId(Long notificationId, Long userId);
    
    boolean existsByNotificationIdAndUserId(Long notificationId, Long userId);

    long countByUserIdAndReadFalse(Long userId);
    
}