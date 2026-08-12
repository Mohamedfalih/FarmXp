package com.farmxp.farmer.service;

import org.springframework.stereotype.Service;

import com.farmxp.farmer.dto.FarmerProfileRequest;
import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.entity.FarmerProfile;
import com.farmxp.farmer.repository.FarmerProfileRepository;

@Service
public class FarmerService {

    private final FarmerProfileRepository farmerProfileRepository;

    public FarmerService(
            FarmerProfileRepository farmerProfileRepository) {

        this.farmerProfileRepository = farmerProfileRepository;
    }

    // ==========================================
    // CREATE PROFILE
    // ==========================================

    public FarmerProfileResponse createProfile(
            Long userId,
            FarmerProfileRequest request) {

        if (farmerProfileRepository.existsByUserId(userId)) {

            throw new RuntimeException(
                    "Farmer profile already exists"
            );
        }

        FarmerProfile profile = new FarmerProfile();

        profile.setUserId(userId);
        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setVillage(request.getVillage());
        profile.setFarmName(request.getFarmName());
        profile.setFarmSize(request.getFarmSize());
        profile.setFarmSizeUnit(request.getFarmSizeUnit());

        FarmerProfile saved =
                farmerProfileRepository.save(profile);

        return convertToResponse(saved);
    }

    // ==========================================
    // GET PROFILE
    // ==========================================

    public FarmerProfileResponse getProfile(
            Long userId) {

        FarmerProfile profile =
                farmerProfileRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Farmer profile not found"
                                )
                        );

        return convertToResponse(profile);
    }

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    public FarmerProfileResponse updateProfile(
            Long userId,
            FarmerProfileRequest request) {

        FarmerProfile profile =
                farmerProfileRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Farmer profile not found"
                                )
                        );

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setVillage(request.getVillage());
        profile.setFarmName(request.getFarmName());
        profile.setFarmSize(request.getFarmSize());
        profile.setFarmSizeUnit(request.getFarmSizeUnit());

        FarmerProfile updated =
                farmerProfileRepository.save(profile);

        return convertToResponse(updated);
    }
    
	 // ==========================================
	 // CHECK PROFILE EXISTS
	 // ==========================================
	
	 public boolean profileExists(Long userId) {
	
	     return farmerProfileRepository.existsByUserId(userId);
	 }

    // ==========================================
    // ENTITY → RESPONSE DTO
    // ==========================================

    private FarmerProfileResponse convertToResponse(
            FarmerProfile profile) {

        return new FarmerProfileResponse(
                profile.getFarmerId(),
                profile.getUserId(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getState(),
                profile.getDistrict(),
                profile.getVillage(),
                profile.getFarmName(),
                profile.getFarmSize(),
                profile.getFarmSizeUnit()
        );
    }
}