package com.farmxp.sustainability.repository;

import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CertifiedPracticeLogRepository
        extends JpaRepository<CertifiedPracticeLog, Long> {

    List<CertifiedPracticeLog> findByFarmerId(
            Long farmerId);

    List<CertifiedPracticeLog>
    findByFarmerIdAndStatus(
            Long farmerId,
            PracticeStatus status);

    List<CertifiedPracticeLog> findByStatus(
            PracticeStatus status);

    List<CertifiedPracticeLog>
    findByFarmerIdAndCategoryAndStatus(
            Long farmerId,
            SustainabilityCategory category,
            PracticeStatus status);

    // NEW
    List<CertifiedPracticeLog>
    findByStatusAndVerifiedAtAfter(
            PracticeStatus status,
            LocalDateTime date);
}