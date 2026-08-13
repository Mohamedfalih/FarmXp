package com.farmxp.auth.controller;

import com.farmxp.auth.dto.AdminCreateRequest;
import com.farmxp.auth.dto.AdminUserResponse;
import com.farmxp.auth.dto.UpdateUserStatusRequest;
import com.farmxp.auth.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthService authService;

    public AdminUserController(
            AuthService authService) {

        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>>
    getAdmins() {

        return ResponseEntity.ok(
                authService.getAdminUsers()
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse>
    getAdmin(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                authService.getAdminUser(userId)
        );
    }

    @PostMapping
    public ResponseEntity<AdminUserResponse>
    createAdmin(
            @Valid @RequestBody
            AdminCreateRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        authService.createAdmin(
                                request)
                );
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<AdminUserResponse>
    updateStatus(
            @PathVariable Long userId,
            @Valid @RequestBody
            UpdateUserStatusRequest request) {

        return ResponseEntity.ok(
                authService.updateUserStatus(
                        userId,
                        request.getActive()
                )
        );
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void>
    deleteAdmin(
            @PathVariable Long userId) {

        authService.deleteAdmin(userId);

        return ResponseEntity.noContent().build();
    }
}