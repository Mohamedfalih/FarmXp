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

@Service
public class VerificationService {

    private final CertifiedPracticeLogRepository repository;

    public VerificationService(
            CertifiedPracticeLogRepository repository) {

        this.repository = repository;
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

        if (Boolean.TRUE.equals(request.getApproved())) {

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

        String message =
                Boolean.TRUE.equals(request.getApproved())
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
                entity.getEvidence()
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
}