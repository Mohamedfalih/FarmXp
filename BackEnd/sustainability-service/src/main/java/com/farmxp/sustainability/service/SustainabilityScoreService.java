package com.farmxp.sustainability.service;

import com.farmxp.sustainability.dto.CategoryScoreResponse;
import com.farmxp.sustainability.dto.SustainabilityScoreResponse;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SustainabilityScoreService {

    private static final int MAX_CATEGORY_SCORE = 25;

    private final CertifiedPracticeLogRepository practiceRepository;

    public SustainabilityScoreService(
            CertifiedPracticeLogRepository practiceRepository) {

        this.practiceRepository = practiceRepository;
    }

    public SustainabilityScoreResponse getScore(
            Long farmerId) {

        List<CategoryScoreResponse> categoryScores =
                Arrays.stream(
                        SustainabilityCategory.values()
                )
                .map(category -> {

                    long verifiedCount =
                            practiceRepository
                                    .findByFarmerIdAndCategoryAndStatus(
                                            farmerId,
                                            category,
                                            PracticeStatus.VERIFIED
                                    )
                                    .size();

                    int score =
                            verifiedCount > 0
                                    ? MAX_CATEGORY_SCORE
                                    : 0;

                    return new CategoryScoreResponse(
                            category,
                            score,
                            MAX_CATEGORY_SCORE
                    );
                })
                .toList();

        int totalScore =
                categoryScores
                        .stream()
                        .mapToInt(
                                CategoryScoreResponse::getScore
                        )
                        .sum();

        int totalVerified =
                practiceRepository
                        .findByFarmerIdAndStatus(
                                farmerId,
                                PracticeStatus.VERIFIED
                        )
                        .size();

        int totalPending =
                practiceRepository
                        .findByFarmerIdAndStatus(
                                farmerId,
                                PracticeStatus.PENDING
                        )
                        .size();

        SustainabilityScoreResponse response = new SustainabilityScoreResponse(
                farmerId,
                totalScore,
                100,
                categoryScores,
                totalVerified,
                totalPending
        );

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<SustainabilityScoreResponse.RecentPractice> recentPractices = practiceRepository
                .findByFarmerId(farmerId)
                .stream()
                .sorted(java.util.Comparator.comparing(com.farmxp.sustainability.entity.CertifiedPracticeLog::getCreatedAt).reversed())
                .limit(5)
                .map(p -> new SustainabilityScoreResponse.RecentPractice(
                        p.getPracticeLogId(),
                        p.getPracticeName(),
                        p.getCreatedAt().format(formatter),
                        p.getStatus().name()
                ))
                .toList();
        response.setRecentPractices(recentPractices);

        return response;
    }
}