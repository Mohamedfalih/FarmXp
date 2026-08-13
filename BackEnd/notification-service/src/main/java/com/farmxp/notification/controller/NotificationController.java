package com.farmxp.notification.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmxp.notification.dto.NotificationRequest;
import com.farmxp.notification.dto.NotificationResponse;
import com.farmxp.notification.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
//@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    // ==========================================
    // CREATE
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createNotification(
            @Valid @RequestBody NotificationRequest request) {

        try {

            NotificationResponse response =
                    notificationService
                            .createNotification(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // ==========================================
    // GET USER NOTIFICATIONS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>>
    getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUserNotifications(userId)
        );
    }

    // ==========================================
    // GET UNREAD
    // ==========================================

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUnreadNotifications(userId)
        );
    }

    // ==========================================
    // COUNT UNREAD
    // ==========================================

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<?> countUnread(
            @PathVariable Long userId) {

        long count =
                notificationService
                        .countUnreadNotifications(userId);

        return ResponseEntity.ok(
                Map.of(
                        "userId", userId,
                        "unreadCount", count
                )
        );
    }

    // ==========================================
    // MARK AS READ
    // ==========================================

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String notificationId) {

        try {

            NotificationResponse response =
                    notificationService
                            .markAsRead(notificationId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<?> markAllAsRead(
            @PathVariable Long userId) {

        notificationService
                .markAllAsRead(userId);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "All notifications marked as read"
                )
        );
    }

    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable String notificationId) {

        try {

            notificationService
                    .deleteNotification(notificationId);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Notification deleted successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}