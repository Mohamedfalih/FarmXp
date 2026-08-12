package com.farmxp.learning.repository;

import com.farmxp.learning.entity.Progress;
import com.farmxp.learning.enums.ProgressStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository
        extends JpaRepository<Progress, Long> {

    List<Progress> findByFarmerId(Long farmerId);

    List<Progress> findByFarmerIdAndModuleModuleId(Long farmerId, Long moduleId);

    Optional<Progress>
    findByFarmerIdAndModuleModuleIdAndGameGameId(Long farmerId, Long moduleId, Long gameId);

    long countByFarmerIdAndStatus(Long farmerId, ProgressStatus status);

    long countByFarmerIdAndGameIsNotNullAndStatus(Long farmerId, ProgressStatus status);
}