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

@Service
public class PracticeService {

    private final CertifiedPracticeLogRepository repository;

    public PracticeService(
            CertifiedPracticeLogRepository repository) {

        this.repository = repository;
    }

    public PracticeLogResponse createPractice(
            Long farmerId,
            PracticeLogRequest request) {

        CertifiedPracticeLog practice =
                new CertifiedPracticeLog();

        practice.setFarmerId(farmerId);
        practice.setCategory(request.getCategory());
        practice.setPracticeName(request.getPracticeName());
        practice.setDescription(request.getDescription());
        practice.setEvidence(request.getEvidence());
        practice.setStatus(PracticeStatus.PENDING);
        practice.setCreatedAt(LocalDateTime.now());

        return convertToResponse(
                repository.save(practice)
        );
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