package com.farmxp.notification.controller;

import com.farmxp.notification.dto.NotificationResponse;
import com.farmxp.notification.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications/my")
public class MyNotificationController {

    private final NotificationService service;

    public MyNotificationController(
            NotificationService service) {

        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications(
            Authentication authentication) {

        Long userId =
                Long.parseLong(
                        authentication.getName());

        return ResponseEntity.ok(
                service.getUserNotifications(
                        userId)
        );
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnread(
            Authentication authentication) {

        Long userId =
                Long.parseLong(
                        authentication.getName());

        return ResponseEntity.ok(
                service.getUnreadNotifications(
                        userId)
        );
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>>
    getUnreadCount(
            Authentication authentication) {

        Long userId =
                Long.parseLong(
                        authentication.getName());

        return ResponseEntity.ok(
                Map.of(
                        "unreadCount",
                        service.countUnreadNotifications(
                                userId)
                )
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>>
    readAll(
            Authentication authentication) {

        Long userId =
                Long.parseLong(
                        authentication.getName());

        service.markAllAsRead(userId);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "All notifications marked as read"
                )
        );
    }
}