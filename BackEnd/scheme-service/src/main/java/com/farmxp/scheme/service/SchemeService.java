package com.farmxp.scheme.service;

import com.farmxp.scheme.dto.SchemeRequest;
import com.farmxp.scheme.dto.SchemeResponse;
import com.farmxp.scheme.entity.Scheme;
import com.farmxp.scheme.enums.SchemeStatus;
import com.farmxp.scheme.exception.ResourceNotFoundException;
import com.farmxp.scheme.repository.SchemeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(
            SchemeRepository schemeRepository) {

        this.schemeRepository = schemeRepository;
    }

    // ==========================================
    // CREATE SCHEME
    // ADMIN ONLY
    // ==========================================

    @Transactional
    public SchemeResponse createScheme(
            SchemeRequest request) {

        Scheme scheme = new Scheme();

        scheme.setTitle(request.getTitle());
        scheme.setDescription(request.getDescription());
        scheme.setEligibility(
                request.getEligibility()
        );
        scheme.setBenefits(
                request.getBenefits()
        );
        scheme.setApplicationUrl(
                request.getApplicationUrl()
        );
        scheme.setDepartment(
                request.getDepartment()
        );
        scheme.setState(
                request.getState()
        );
        scheme.setLastDate(
                request.getLastDate()
        );
        scheme.setStatus(
                request.getStatus()
        );

        return toResponse(
                schemeRepository.save(scheme)
        );
    }

    // ==========================================
    // GET ALL ACTIVE SCHEMES
    // FARMER + ADMIN
    // ==========================================

    public List<SchemeResponse> getActiveSchemes() {

        return schemeRepository
                .findByStatusOrderByLastDateAsc(
                        SchemeStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // GET ALL SCHEMES
    // ADMIN
    // ==========================================

    public List<SchemeResponse> getAllSchemes() {

        return schemeRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // GET SCHEME BY ID
    // FARMER + ADMIN
    // ==========================================

    public SchemeResponse getScheme(
            Long schemeId) {

        return toResponse(
                getSchemeEntity(schemeId)
        );
    }

    // ==========================================
    // GET ACTIVE SCHEMES BY STATE
    // FARMER + ADMIN
    // ==========================================

    public List<SchemeResponse> getSchemesByState(
            String state) {

        return schemeRepository
                .findByStateIgnoreCaseAndStatusOrderByLastDateAsc(
                        state,
                        SchemeStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // UPDATE SCHEME
    // ADMIN ONLY
    // ==========================================

    @Transactional
    public SchemeResponse updateScheme(
            Long schemeId,
            SchemeRequest request) {

        Scheme scheme =
                getSchemeEntity(schemeId);

        scheme.setTitle(request.getTitle());
        scheme.setDescription(
                request.getDescription()
        );
        scheme.setEligibility(
                request.getEligibility()
        );
        scheme.setBenefits(
                request.getBenefits()
        );
        scheme.setApplicationUrl(
                request.getApplicationUrl()
        );
        scheme.setDepartment(
                request.getDepartment()
        );
        scheme.setState(
                request.getState()
        );
        scheme.setLastDate(
                request.getLastDate()
        );
        scheme.setStatus(
                request.getStatus()
        );

        return toResponse(
                schemeRepository.save(scheme)
        );
    }

    // ==========================================
    // DELETE SCHEME
    // ADMIN ONLY
    // ==========================================

    @Transactional
    public void deleteScheme(
            Long schemeId) {

        Scheme scheme =
                getSchemeEntity(schemeId);

        schemeRepository.delete(scheme);
    }

    // ==========================================
    // GET ENTITY
    // ==========================================

    public Scheme getSchemeEntity(
            Long schemeId) {

        return schemeRepository
                .findById(schemeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Government scheme not found"
                        )
                );
    }

    // ==========================================
    // ENTITY -> RESPONSE
    // ==========================================

    private SchemeResponse toResponse(
            Scheme scheme) {

        return new SchemeResponse(
                scheme.getSchemeId(),
                scheme.getTitle(),
                scheme.getDescription(),
                scheme.getEligibility(),
                scheme.getBenefits(),
                scheme.getApplicationUrl(),
                scheme.getDepartment(),
                scheme.getState(),
                scheme.getLastDate(),
                scheme.getStatus(),
                scheme.getCreatedAt(),
                scheme.getUpdatedAt()
        );
    }
}