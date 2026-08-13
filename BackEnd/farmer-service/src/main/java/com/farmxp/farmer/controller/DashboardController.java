package com.farmxp.farmer.controller;

import com.farmxp.farmer.dto.DashboardResponse;
import com.farmxp.farmer.service.DashboardService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/farmers/dashboard")

public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService =
                dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse>
    getDashboard(
            Authentication authentication) {

        Long userId =
                Long.parseLong(
                        authentication.getName()
                );

        return ResponseEntity.ok(
                dashboardService.getDashboard(
                        userId
                )
        );
    }
}