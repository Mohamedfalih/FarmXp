package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.SustainabilityMetricRequest;
import com.farmxp.sustainability.dto.SustainabilityMetricResponse;
import com.farmxp.sustainability.service.SustainabilityMetricService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sustainability/metrics")
@CrossOrigin(origins = "http://localhost:5173")
public class SustainabilityMetricController {

    private final SustainabilityMetricService metricService;

    public SustainabilityMetricController(
            SustainabilityMetricService metricService) {

        this.metricService = metricService;
    }

    @PostMapping
    public ResponseEntity<SustainabilityMetricResponse>
    createMetric(
            Authentication authentication,
            @Valid @RequestBody
            SustainabilityMetricRequest request) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        SustainabilityMetricResponse response =
                metricService.createMetric(
                        farmerId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<SustainabilityMetricResponse>>
    getMetrics(
            Authentication authentication) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                metricService.getMetrics(farmerId)
        );
    }

    @GetMapping("/{metricId}")
    public ResponseEntity<SustainabilityMetricResponse>
    getMetric(
            Authentication authentication,
            @PathVariable Long metricId) {

        Long farmerId =
                Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                metricService.getMetric(
                        farmerId,
                        metricId
                )
        );
    }
}