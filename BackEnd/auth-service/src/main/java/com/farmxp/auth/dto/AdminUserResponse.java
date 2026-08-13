package com.farmxp.auth.dto;

public class AdminUserResponse {

    private Long userId;
    private String username;
    private String email;
    private String role;
    private Boolean active;

    public AdminUserResponse() {
    }

    public AdminUserResponse(
            Long userId,
            String username,
            String email,
            String role,
            Boolean active) {

        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.active = active;
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

    public String getRole() {
        return role;
    }

    public Boolean getActive() {
        return active;
    }
}