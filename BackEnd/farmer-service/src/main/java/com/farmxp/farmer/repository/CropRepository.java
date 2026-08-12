package com.farmxp.farmer.repository;

import com.farmxp.farmer.entity.Crop;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CropRepository
        extends JpaRepository<Crop, Long> {

    List<Crop> findByFarmerProfileFarmerId(
            Long farmerId
    );

    Optional<Crop> findByCropIdAndFarmerProfileFarmerId(
            Long cropId,
            Long farmerId
    );
}