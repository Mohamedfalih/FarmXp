package com.farmxp.sustainability.service;

import com.farmxp.sustainability.dto.PracticeLogResponse;
import com.farmxp.sustainability.dto.PracticeVerificationRequest;
import com.farmxp.sustainability.dto.PracticeVerificationResponse;
import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.exception.ResourceNotFoundException;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import com.farmxp.sustainability.client.NotificationServiceClient;
import com.farmxp.sustainability.client.FarmerServiceClient;
import com.farmxp.sustainability.dto.FarmerProfileResponse;
import java.util.Map;

@Service
public class VerificationService {

    private final CertifiedPracticeLogRepository repository;
    private final NotificationServiceClient notificationClient;
    private final FarmerServiceClient farmerServiceClient;

    public VerificationService(
            CertifiedPracticeLogRepository repository,
            NotificationServiceClient notificationClient,
            FarmerServiceClient farmerServiceClient) {

        this.repository = repository;
        this.notificationClient = notificationClient;
        this.farmerServiceClient = farmerServiceClient;
    }

    public List<PracticeLogResponse> getPendingPractices() {

        return repository
                .findByStatus(PracticeStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public PracticeVerificationResponse verifyPractice(
            Long practiceId,
            Long adminId,
            PracticeVerificationRequest request) {

        CertifiedPracticeLog practice =
                repository.findById(practiceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Practice not found"
                                )
                        );

        if (practice.getStatus()
                != PracticeStatus.PENDING) {

            throw new RuntimeException(
                    "Practice has already been processed"
            );
        }

        boolean isApproved = Boolean.TRUE.equals(request.getApproved());

        if (isApproved) {

            practice.setStatus(
                    PracticeStatus.VERIFIED
            );

            practice.setRejectionReason(null);

        } else {

            practice.setStatus(
                    PracticeStatus.REJECTED
            );

            practice.setRejectionReason(
                    request.getRejectionReason()
            );
        }

        practice.setVerifiedBy(adminId);
        practice.setVerifiedAt(
                LocalDateTime.now()
        );

        repository.save(practice);
        
        try {
            String title = isApproved ? "Practice Verified" : "Practice Rejected";
            String msg = isApproved 
                ? "Your practice '" + practice.getPracticeName() + "' has been successfully verified."
                : "Your practice '" + practice.getPracticeName() + "' was rejected. Reason: " + request.getRejectionReason();
            
            notificationClient.createNotification(Map.of(
                    "userId", practice.getFarmerId(),
                    "title", title,
                    "message", msg,
                    "type", "SYSTEM",
                    "actionUrl", "/farmer/practice-logs"
            ));
        } catch (Exception e) {
            // Ignore
        }

        String message =
                isApproved
                        ? "Practice verified successfully"
                        : "Practice rejected successfully";

        return new PracticeVerificationResponse(
                practice.getPracticeLogId(),
                practice.getStatus(),
                message
        );
    }

    private PracticeLogResponse convertToResponse(
            CertifiedPracticeLog entity) {

        PracticeLogResponse response =
                new PracticeLogResponse();

        response.setPracticeLogId(
                entity.getPracticeLogId()
        );

        response.setFarmerId(
                entity.getFarmerId()
        );

        try {
            FarmerProfileResponse farmerProfile = farmerServiceClient.getFarmer(entity.getFarmerId());
            if (farmerProfile != null) {
                response.setFarmerName(farmerProfile.getFullName());
            } else {
                response.setFarmerName("Unknown Farmer");
            }
        } catch (Exception e) {
            response.setFarmerName("Unknown Farmer");
        }

        response.setCategory(
                entity.getCategory()
        );

        response.setPracticeName(
                entity.getPracticeName()
        );

        response.setDescription(
                entity.getDescription()
        );

        response.setEvidence(
                resolveEvidence(entity.getEvidence())
        );

        response.setStatus(
                entity.getStatus()
        );

        response.setRejectionReason(
                entity.getRejectionReason()
        );

        response.setCreatedAt(
                entity.getCreatedAt()
        );

        response.setVerifiedAt(
                entity.getVerifiedAt()
        );

        return response;
    }
    
    public List<PracticeLogResponse> getPracticesByStatus(
            PracticeStatus status) {

        return repository
                .findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private String resolveEvidence(String evidence) {
        if (evidence != null && !evidence.trim().isEmpty() && !evidence.startsWith("http") && !evidence.startsWith("data:")) {
            String lower = evidence.toLowerCase();
            if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif") || lower.endsWith(".webp")) {
                try {
                    java.nio.file.Path path = java.nio.file.Paths.get(evidence);
                    if (java.nio.file.Files.exists(path) && !java.nio.file.Files.isDirectory(path)) {
                        if (java.nio.file.Files.size(path) <= 5 * 1024 * 1024) {
                            byte[] bytes = java.nio.file.Files.readAllBytes(path);
                            String mimeType = java.nio.file.Files.probeContentType(path);
                            if (mimeType == null) {
                                if (lower.endsWith(".png")) mimeType = "image/png";
                                else if (lower.endsWith(".gif")) mimeType = "image/gif";
                                else if (lower.endsWith(".webp")) mimeType = "image/webp";
                                else mimeType = "image/jpeg";
                            }
                            String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
                            return "data:" + mimeType + ";base64," + base64;
                        }
                    }
                } catch (Exception e) {
                    // Ignore, leave as text
                }
            }
        }
        return evidence;
    }
}