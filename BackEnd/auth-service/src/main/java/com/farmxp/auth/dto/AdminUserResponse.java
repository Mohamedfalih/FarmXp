package com.farmxp.auth.dto;

public class AdminUserResponse {

    private Long userId;
    private String username;
    private String email;
    private String phone;
    private String role;
    private Boolean active;
    private String createdAt;

    public AdminUserResponse() {
    }

    public AdminUserResponse(
            Long userId,
            String username,
            String email,
            String phone,
            String role,
            Boolean active,
            String createdAt) {

        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }

    public Boolean getActive() {
        return active;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}