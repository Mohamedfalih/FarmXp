package com.farmxp.farmer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.farmxp.farmer.dto.FarmerProfileRequest;
import com.farmxp.farmer.dto.FarmerProfileResponse;
import com.farmxp.farmer.dto.AdminFarmerDetailResponse;
import com.farmxp.farmer.entity.FarmerProfile;
import com.farmxp.farmer.repository.FarmerProfileRepository;
import com.farmxp.farmer.client.SustainabilityServiceClient;
import com.farmxp.farmer.client.LearningServiceClient;
import com.farmxp.farmer.client.AuthServiceClient;
import com.farmxp.farmer.repository.CropRepository;
import com.farmxp.farmer.entity.Crop;

@Service
public class FarmerService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final SustainabilityServiceClient sustainabilityClient;
    private final LearningServiceClient learningClient;
    private final AuthServiceClient authServiceClient;
    private final CropRepository cropRepository;

    public FarmerService(
            FarmerProfileRepository farmerProfileRepository,
            SustainabilityServiceClient sustainabilityClient,
            LearningServiceClient learningClient,
            AuthServiceClient authServiceClient,
            CropRepository cropRepository) {

        this.farmerProfileRepository = farmerProfileRepository;
        this.sustainabilityClient = sustainabilityClient;
        this.learningClient = learningClient;
        this.authServiceClient = authServiceClient;
        this.cropRepository = cropRepository;
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
        profile.setSoilType(request.getSoilType());
        profile.setIrrigationType(request.getIrrigationType());

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
    // GET ALL PROFILES
    // ==========================================

    public List<FarmerProfileResponse> getAllProfiles() {
        List<FarmerProfile> profiles = farmerProfileRepository.findAll();
        return profiles.stream().map(this::convertToResponse).toList();
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
        profile.setSoilType(request.getSoilType());
        profile.setIrrigationType(request.getIrrigationType());

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
    // DELETE PROFILE
    // ==========================================

    public void deleteProfile(Long userId) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        // Delete from farmer-service DB
        farmerProfileRepository.delete(profile);

        // Delete from auth-service
        try {
            authServiceClient.deleteMe();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user account from auth-service", e);
        }
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
                profile.getFarmSizeUnit(),
                profile.getTotalXp(),
                profile.getSoilType(),
                profile.getIrrigationType()
        );
    }
    
    public List<com.farmxp.farmer.dto.AdminFarmerListResponse> getAllFarmers() {
        List<FarmerProfile> profiles = farmerProfileRepository.findAll();
        
        return profiles.stream().map(profile -> {
            com.farmxp.farmer.dto.AdminFarmerListResponse response = new com.farmxp.farmer.dto.AdminFarmerListResponse();
            response.setFarmerId(profile.getFarmerId());
            response.setUserId(profile.getUserId());
            response.setFullName(profile.getFullName());
            response.setDistrict(profile.getDistrict());
            response.setVillage(profile.getVillage());
            response.setStatus("ACTIVE"); // Mock or fetch actual status if available

            try {
                List<Crop> crops = cropRepository.findByFarmerProfileFarmerId(profile.getFarmerId());
                if (crops != null && !crops.isEmpty()) {
                    response.setPrimaryCrop(crops.get(0).getCropName());
                } else {
                    response.setPrimaryCrop("Not specified");
                }
            } catch (Exception e) {
                response.setPrimaryCrop("Not specified");
            }

            try {
                com.farmxp.farmer.dto.SustainabilityScoreResponse scoreResponse = sustainabilityClient.getFarmerScore(profile.getUserId());
                if (scoreResponse != null && scoreResponse.getTotalScore() != null) {
                    response.setSustainabilityScore(scoreResponse.getTotalScore());
                } else {
                    response.setSustainabilityScore(0);
                }
            } catch (Exception e) {
                response.setSustainabilityScore(0);
            }
            
            return response;
        }).toList();
    }

    public FarmerProfileResponse getFarmerById(
            Long farmerId) {

        FarmerProfile profile =
                farmerProfileRepository.findById(
                        farmerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Farmer not found"));

        return convertToResponse(profile);
    }

    public AdminFarmerDetailResponse getAdminFarmerDetails(Long farmerId) {
        FarmerProfile profile = farmerProfileRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        AdminFarmerDetailResponse response = new AdminFarmerDetailResponse();
        response.setProfile(convertToResponse(profile));

        try {
            response.setSustainability(sustainabilityClient.getFarmerScore(profile.getUserId()));
        } catch (Exception e) {
            // Service might be down or no score yet
        }

        try {
            response.setLearning(learningClient.getFarmerSummary(profile.getUserId()));
        } catch (Exception e) {
            // Service might be down or no learning yet
        }

        try {
            AuthServiceClient.AuthUserResponse authUser = authServiceClient.getUser(profile.getUserId());
            response.setEmail(authUser.getEmail());
            response.setJoinedDate(authUser.getCreatedAt());
        } catch (Exception e) {
            // Auth service might be down
        }

        try {
            List<Crop> crops = cropRepository.findByFarmerProfileFarmerId(farmerId);
            if (crops != null && !crops.isEmpty()) {
                response.setPrimaryCrop(crops.get(0).getCropName());
                response.setFarmingType("Crop Farming");
            } else {
                response.setFarmingType("Not specified");
            }
        } catch (Exception e) {
            // ignore
        }

        return response;
    }

    // ==========================================
    // ADD XP (INTERNAL API)
    // ==========================================
    public void addXp(Long farmerId, Integer xpAmount) {
        if (xpAmount == null || xpAmount <= 0) return;
        
        FarmerProfile profile = farmerProfileRepository.findByUserId(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
                
        int currentXp = profile.getTotalXp() != null ? profile.getTotalXp() : 0;
        profile.setTotalXp(currentXp + xpAmount);
        
        farmerProfileRepository.save(profile);
    }
}