package com.farmxp.notification.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.farmxp.notification.entity.Notification;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId);

    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(
            Long userId);

    long countByUserIdAndReadFalse(
            Long userId);
}