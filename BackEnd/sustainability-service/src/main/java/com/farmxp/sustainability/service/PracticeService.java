package com.farmxp.sustainability.service;

import com.farmxp.sustainability.dto.PracticeLogRequest;
import com.farmxp.sustainability.dto.PracticeLogResponse;
import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.exception.ResourceNotFoundException;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.farmxp.sustainability.client.AuthServiceClient;
import com.farmxp.sustainability.client.NotificationServiceClient;
import java.util.Map;

@Service
public class PracticeService {

    private final CertifiedPracticeLogRepository repository;
    private final NotificationServiceClient notificationClient;
    private final com.farmxp.sustainability.client.FarmerServiceClient farmerServiceClient;
    private final AuthServiceClient authServiceClient;

    public PracticeService(
            CertifiedPracticeLogRepository repository,
            NotificationServiceClient notificationClient,
            com.farmxp.sustainability.client.FarmerServiceClient farmerServiceClient,
            AuthServiceClient authServiceClient) {

        this.repository = repository;
        this.notificationClient = notificationClient;
        this.farmerServiceClient = farmerServiceClient;
        this.authServiceClient = authServiceClient;
    }

    public PracticeLogResponse createPractice(
            Long farmerId,
            PracticeLogRequest request) {

        try {
            farmerServiceClient.getFarmer(farmerId);
        } catch (Exception e) {
            throw new RuntimeException("Farmer profile is required before submitting practices.");
        }

        CertifiedPracticeLog practice =
                new CertifiedPracticeLog();

        practice.setFarmerId(farmerId);
        practice.setCategory(request.getCategory());
        practice.setPracticeName(request.getPracticeName());
        practice.setDescription(request.getDescription());
        practice.setEvidence(request.getEvidence());
        practice.setStatus(PracticeStatus.PENDING);
        practice.setCreatedAt(LocalDateTime.now());

        CertifiedPracticeLog saved = repository.save(practice);

        try {
            // Notify the farmer
            notificationClient.createNotification(Map.of(
                    "userId", farmerId,
                    "title", "Practice Submitted",
                    "message", "Your practice '" + request.getPracticeName() + "' has been submitted for verification.",
                    "notificationType", "SYSTEM"
            ));

            // Notify all admins
            java.util.List<Long> adminIds = authServiceClient.getUsersByRole("ADMIN");
            if (adminIds != null && !adminIds.isEmpty()) {
                notificationClient.createBulkNotification(Map.of(
                        "userIds", adminIds,
                        "title", "New Practice Submitted",
                        "message", "A new sustainability practice '" + request.getPracticeName() + "' was submitted by farmer " + farmerId + ".",
                        "notificationType", "SYSTEM"
                ));
            }

        } catch (Exception e) {
            System.err.println("Failed to send practice notifications: " + e.getMessage());
        }

        return convertToResponse(saved);
    }

    public List<PracticeLogResponse> getFarmerPractices(
            Long farmerId) {

        return repository
                .findByFarmerId(farmerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public PracticeLogResponse getPractice(
            Long farmerId,
            Long practiceId) {

        CertifiedPracticeLog practice =
                repository.findById(practiceId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Practice not found"
                                )
                        );

        if (!practice.getFarmerId().equals(farmerId)) {
            throw new ResourceNotFoundException(
                    "Practice not found"
            );
        }

        return convertToResponse(practice);
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