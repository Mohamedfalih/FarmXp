package com.farmxp.notification.controller;

import com.farmxp.notification.dto.NotificationRequest;
import com.farmxp.notification.dto.NotificationResponse;
import com.farmxp.notification.security.JwtService;
import com.farmxp.notification.service.NotificationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;

    public NotificationController(
            NotificationService notificationService,
            JwtService jwtService) {

        this.notificationService =
                notificationService;

        this.jwtService = jwtService;
    }

    /*
     * ADMIN / INTERNAL
     * Create notification
     */
    @PostMapping
    public ResponseEntity<NotificationResponse>
    createNotification(
            @Valid @RequestBody NotificationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        notificationService
                                .createNotification(request)
                );
    }

    /*
     * Get notifications for logged-in user
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications(
            @RequestHeader("Authorization")
            String authorizationHeader) {

        Long userId =
                extractUserId(authorizationHeader);

        return ResponseEntity.ok(
                notificationService
                        .getNotificationsByUser(userId)
        );
    }

    /*
     * Get unread notifications
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications(
            @RequestHeader("Authorization")
            String authorizationHeader) {

        Long userId =
                extractUserId(authorizationHeader);

        return ResponseEntity.ok(
                notificationService
                        .getUnreadNotifications(userId)
        );
    }

    /*
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Long>
    getUnreadCount(
            @RequestHeader("Authorization")
            String authorizationHeader) {

        Long userId =
                extractUserId(authorizationHeader);

        return ResponseEntity.ok(
                notificationService
                        .getUnreadCount(userId)
        );
    }

    /*
     * Mark one notification as read
     */
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(notificationId)
        );
    }

    /*
     * Mark all notifications as read
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void>
    markAllAsRead(
            @RequestHeader("Authorization")
            String authorizationHeader) {

        Long userId =
                extractUserId(authorizationHeader);

        notificationService
                .markAllAsRead(userId);

        return ResponseEntity.noContent().build();
    }

    /*
     * Delete notification
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void>
    deleteNotification(
            @PathVariable Long notificationId) {

        notificationService
                .deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }

    private Long extractUserId(
            String authorizationHeader) {

        if (authorizationHeader == null
                || !authorizationHeader.startsWith(
                        "Bearer ")) {

            throw new RuntimeException(
                    "Invalid Authorization header"
            );
        }

        String token =
                authorizationHeader
                        .substring(7)
                        .trim();

        return jwtService.extractUserId(token);
    }
}