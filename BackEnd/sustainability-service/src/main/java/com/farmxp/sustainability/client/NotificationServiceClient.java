package com.farmxp.sustainability.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationServiceClient {

    @PostMapping("/api/notifications")
    Object createNotification(@RequestBody Map<String, Object> request);

    @PostMapping("/api/notifications/bulk")
    void createBulkNotification(@RequestBody Map<String, Object> request);
}
