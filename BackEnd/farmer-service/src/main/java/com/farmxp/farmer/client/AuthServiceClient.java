package com.farmxp.farmer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @GetMapping("/api/auth/admin/users/{userId}")
    AuthUserResponse getUser(@PathVariable("userId") Long userId);

    @org.springframework.web.bind.annotation.DeleteMapping("/api/auth/me")
    void deleteMe();

    public static class AuthUserResponse {
        private Long userId;
        private String email;
        private String createdAt;

        public AuthUserResponse() {}

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }
}
