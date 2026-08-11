package com.farmxp.sustainability.entity;

import com.farmxp.sustainability.enums.MetricType;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "SUSTAINABILITY_METRIC")
public class SustainabilityMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "metric_seq")
    @SequenceGenerator(
            name = "metric_seq",
            sequenceName = "SUSTAINABILITY_METRIC_SEQ",
            allocationSize = 1
    )
    @Column(name = "METRIC_ID")
    private Long metricId;

    @Column(name = "FARMER_ID", nullable = false)
    private Long farmerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "METRIC_TYPE", nullable = false)
    private MetricType metricType;

    @Column(name = "BASELINE_VALUE", nullable = false)
    private Double baselineValue;

    @Column(name = "CURRENT_VALUE", nullable = false)
    private Double currentValue;

    @Column(name = "UNIT", nullable = false, length = 50)
    private String unit;

    @Column(name = "RECORDED_DATE", nullable = false)
    private LocalDate recordedDate;

    @Column(name = "NOTES", length = 500)
    private String notes;

    public SustainabilityMetric() {
    }

    public Long getMetricId() {
        return metricId;
    }

    public void setMetricId(Long metricId) {
        this.metricId = metricId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
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