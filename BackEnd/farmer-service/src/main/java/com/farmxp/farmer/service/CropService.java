package com.farmxp.farmer.service;

import com.farmxp.farmer.dto.CropRequest;
import com.farmxp.farmer.dto.CropResponse;
import com.farmxp.farmer.entity.Crop;
import com.farmxp.farmer.entity.FarmerProfile;
import com.farmxp.farmer.exception.ResourceNotFoundException;
import com.farmxp.farmer.repository.CropRepository;
import com.farmxp.farmer.repository.FarmerProfileRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final FarmerProfileRepository
            farmerProfileRepository;

    public CropService(
            CropRepository cropRepository,
            FarmerProfileRepository
                    farmerProfileRepository) {

        this.cropRepository = cropRepository;
        this.farmerProfileRepository =
                farmerProfileRepository;
    }

    // ==========================================
    // CREATE CROP
    // ==========================================

    @Transactional
    public CropResponse createCrop(
            Long userId,
            CropRequest request) {

        FarmerProfile farmerProfile =
                getFarmerProfile(userId);

        Crop crop = new Crop();

        crop.setFarmerProfile(farmerProfile);
        crop.setCropName(request.getCropName());
        crop.setVariety(request.getVariety());
        crop.setArea(request.getArea());
        crop.setAreaUnit(request.getAreaUnit());
        crop.setSeason(request.getSeason());
        crop.setPlantingDate(
                request.getPlantingDate()
        );
        crop.setExpectedHarvestDate(
                request.getExpectedHarvestDate()
        );

        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            crop.setStatus("ACTIVE");

        } else {

            crop.setStatus(request.getStatus());
        }

        Crop savedCrop =
                cropRepository.save(crop);

        return toResponse(savedCrop);
    }

    public List<CropResponse> getMyCrops(
            Long userId) {

        FarmerProfile farmerProfile =
                farmerProfileRepository
                        .findByUserId(userId)
                        .orElse(null);
                        
        if (farmerProfile == null) {
            return List.of();
        }

        Long farmerId =
                farmerProfile.getFarmerId();

        return cropRepository
                .findByFarmerProfileFarmerId(farmerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // GET SINGLE CROP
    // ==========================================

    public CropResponse getCrop(
            Long userId,
            Long cropId) {

        FarmerProfile farmerProfile =
                getFarmerProfile(userId);

        Long farmerId =
                farmerProfile.getFarmerId();

        Crop crop =
                cropRepository
                        .findByCropIdAndFarmerProfileFarmerId(
                                cropId,
                                farmerId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Crop not found"
                                )
                        );

        return toResponse(crop);
    }

    // ==========================================
    // UPDATE CROP
    // ==========================================

    @Transactional
    public CropResponse updateCrop(
            Long userId,
            Long cropId,
            CropRequest request) {

        FarmerProfile farmerProfile =
                getFarmerProfile(userId);

        Long farmerId =
                farmerProfile.getFarmerId();

        Crop crop =
                cropRepository
                        .findByCropIdAndFarmerProfileFarmerId(
                                cropId,
                                farmerId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Crop not found"
                                )
                        );

        crop.setCropName(request.getCropName());
        crop.setVariety(request.getVariety());
        crop.setArea(request.getArea());
        crop.setAreaUnit(request.getAreaUnit());
        crop.setSeason(request.getSeason());
        crop.setPlantingDate(
                request.getPlantingDate()
        );
        crop.setExpectedHarvestDate(
                request.getExpectedHarvestDate()
        );

        if (request.getStatus() != null &&
                !request.getStatus().isBlank()) {

            crop.setStatus(request.getStatus());
        }

        Crop updatedCrop =
                cropRepository.save(crop);

        return toResponse(updatedCrop);
    }

    // ==========================================
    // DELETE CROP
    // ==========================================

    @Transactional
    public void deleteCrop(
            Long userId,
            Long cropId) {

        FarmerProfile farmerProfile =
                getFarmerProfile(userId);

        Long farmerId =
                farmerProfile.getFarmerId();

        Crop crop =
                cropRepository
                        .findByCropIdAndFarmerProfileFarmerId(
                                cropId,
                                farmerId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Crop not found"
                                )
                        );

        cropRepository.delete(crop);
    }

    // ==========================================
    // GET FARMER PROFILE
    // ==========================================

    private FarmerProfile getFarmerProfile(
            Long userId) {

        return farmerProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Farmer profile not found"
                        )
                );
    }

    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private CropResponse toResponse(
            Crop crop) {

        return new CropResponse(
                crop.getCropId(),
                crop.getFarmerProfile()
                        .getFarmerId(),
                crop.getCropName(),
                crop.getVariety(),
                crop.getArea(),
                crop.getAreaUnit(),
                crop.getSeason(),
                crop.getPlantingDate(),
                crop.getExpectedHarvestDate(),
                crop.getStatus()
        );
    }
}