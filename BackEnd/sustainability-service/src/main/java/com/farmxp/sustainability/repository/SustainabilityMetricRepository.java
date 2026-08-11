package com.farmxp.sustainability.repository;

import com.farmxp.sustainability.entity.SustainabilityMetric;
import com.farmxp.sustainability.enums.MetricType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SustainabilityMetricRepository
        extends JpaRepository<SustainabilityMetric, Long> {

    List<SustainabilityMetric> findByFarmerId(Long farmerId);

    List<SustainabilityMetric> findByFarmerIdAndMetricType(
            Long farmerId,
            MetricType metricType);
}