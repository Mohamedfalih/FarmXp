package com.farmxp.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmxp.notification.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId);

    List<Notification> findByUserIdInOrderByCreatedAtDesc(
            List<Long> userIds);

    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(
            Long userId);

    List<Notification> findByUserIdInAndReadFalseOrderByCreatedAtDesc(
            List<Long> userIds);

    long countByUserIdAndReadFalse(
            Long userId);

    long countByUserIdInAndReadFalse(
            List<Long> userIds);
}