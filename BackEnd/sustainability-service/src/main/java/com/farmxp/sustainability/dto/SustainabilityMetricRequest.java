package com.farmxp.sustainability.dto;

import com.farmxp.sustainability.enums.MetricType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class SustainabilityMetricRequest {

    @NotNull(message = "Metric type is required")
    private MetricType metricType;

    @NotNull(message = "Baseline value is required")
    @PositiveOrZero(message = "Baseline value cannot be negative")
    private Double baselineValue;

    @NotNull(message = "Current value is required")
    @PositiveOrZero(message = "Current value cannot be negative")
    private Double currentValue;

    private String unit;

    @NotNull(message = "Recorded date is required")
    private LocalDate recordedDate;

    private String notes;

    public SustainabilityMetricRequest() {
    }

    public MetricType getMetricType() {
        return metricType;
    }

    public void setMetricType(MetricType metricType) {
        this.metricType = metricType;
    }

    public Double getBaselineValue() {
        return baselineValue;
    }

    public void setBaselineValue(Double baselineValue) {
        this.baselineValue = baselineValue;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Double currentValue) {
        this.currentValue = currentValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDate getRecordedDate() {
        return recordedDate;
    }

    public void setRecordedDate(LocalDate recordedDate) {
        this.recordedDate = recordedDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}