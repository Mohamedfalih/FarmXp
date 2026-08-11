package com.farmxp.sustainability.service;

import com.farmxp.sustainability.dto.SustainabilityMetricRequest;
import com.farmxp.sustainability.dto.SustainabilityMetricResponse;
import com.farmxp.sustainability.entity.SustainabilityMetric;
import com.farmxp.sustainability.exception.ResourceNotFoundException;
import com.farmxp.sustainability.repository.SustainabilityMetricRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SustainabilityMetricService {

    private final SustainabilityMetricRepository repository;

    public SustainabilityMetricService(
            SustainabilityMetricRepository repository) {

        this.repository = repository;
    }

    public SustainabilityMetricResponse createMetric(
            Long farmerId,
            SustainabilityMetricRequest request) {

        SustainabilityMetric metric =
                new SustainabilityMetric();

        metric.setFarmerId(farmerId);
        metric.setMetricType(request.getMetricType());
        metric.setBaselineValue(request.getBaselineValue());
        metric.setCurrentValue(request.getCurrentValue());
        metric.setUnit(request.getUnit());
        metric.setRecordedDate(request.getRecordedDate());
        metric.setNotes(request.getNotes());

        return convertToResponse(
                repository.save(metric)
        );
    }

    public List<SustainabilityMetricResponse> getMetrics(
            Long farmerId) {

        return repository
                .findByFarmerId(farmerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public SustainabilityMetricResponse getMetric(
            Long farmerId,
            Long metricId) {

        SustainabilityMetric metric =
                repository.findById(metricId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Metric not found"
                                )
                        );

        if (!metric.getFarmerId().equals(farmerId)) {
            throw new ResourceNotFoundException(
                    "Metric not found"
            );
        }

        return convertToResponse(metric);
    }

    private SustainabilityMetricResponse convertToResponse(
            SustainabilityMetric entity) {

        SustainabilityMetricResponse response =
                new SustainabilityMetricResponse();

        response.setMetricId(
                entity.getMetricId()
        );

        response.setFarmerId(
                entity.getFarmerId()
        );

        response.setMetricType(
                entity.getMetricType()
        );

        response.setBaselineValue(
                entity.getBaselineValue()
        );

        response.setCurrentValue(
                entity.getCurrentValue()
        );

        response.setReductionPercentage(
                calculateReduction(
                        entity.getBaselineValue(),
                        entity.getCurrentValue()
                )
        );

        response.setUnit(
                entity.getUnit()
        );

        response.setRecordedDate(
                entity.getRecordedDate()
        );

        response.setNotes(
                entity.getNotes()
        );

        return response;
    }

    private Double calculateReduction(
            Double baseline,
            Double current) {

        if (baseline == null
                || baseline == 0) {

            return 0.0;
        }

        return ((baseline - current) / baseline) * 100;
    }
}