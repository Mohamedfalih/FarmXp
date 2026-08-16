package com.farmxp.sustainability.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.farmxp.sustainability.client.FarmerServiceClient;
import com.farmxp.sustainability.client.LearningServiceClient;
import com.farmxp.sustainability.dto.FarmerProfileResponse;
import com.farmxp.sustainability.dto.LeaderboardResponse;
import com.farmxp.sustainability.dto.LearningSummaryResponse;
import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.LeaderboardPeriod;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

@Service
public class LeaderboardService {

    private static final int MAX_SCORE = 100;

    private final CertifiedPracticeLogRepository practiceRepository;
    private final FarmerServiceClient farmerServiceClient;
    private final LearningServiceClient learningServiceClient;

    public LeaderboardService(
            CertifiedPracticeLogRepository practiceRepository,
            FarmerServiceClient farmerServiceClient,
            LearningServiceClient learningServiceClient) {

        this.practiceRepository = practiceRepository;
        this.farmerServiceClient = farmerServiceClient;
        this.learningServiceClient = learningServiceClient;
    }

    // =====================================================
    // GET LEADERBOARD
    // =====================================================

    public List<LeaderboardResponse> getLeaderboard(
            LeaderboardPeriod period,
            String state) {

        List<CertifiedPracticeLog> verifiedPractices;

        // =====================================================
        // PERIOD FILTER
        // =====================================================

        if (period == LeaderboardPeriod.WEEK) {

            LocalDateTime start =
                    LocalDateTime.now().minusDays(7);

            verifiedPractices =
                    practiceRepository
                            .findByStatusAndVerifiedAtAfter(
                                    PracticeStatus.VERIFIED,
                                    start
                            );

        } else if (period == LeaderboardPeriod.MONTH) {

            LocalDateTime start =
                    LocalDateTime.now().minusDays(30);

            verifiedPractices =
                    practiceRepository
                            .findByStatusAndVerifiedAtAfter(
                                    PracticeStatus.VERIFIED,
                                    start
                            );

        } else {

            verifiedPractices =
                    practiceRepository.findByStatus(
                            PracticeStatus.VERIFIED
                    );
        }

        // =====================================================
        // GROUP PRACTICES BY FARMER
        // =====================================================

        Map<Long, List<CertifiedPracticeLog>>
                farmerPractices =
                verifiedPractices.stream()
                        .collect(
                                Collectors.groupingBy(
                                        CertifiedPracticeLog::getFarmerId
                                )
                        );

        // =====================================================
        // CREATE LEADERBOARD FROM ALL FARMERS
        // =====================================================

        List<FarmerProfileResponse> allFarmers = farmerServiceClient.getAllFarmers();

        List<LeaderboardResponse> leaderboard =
                allFarmers.stream()

                        // -------------------------------------------------
                        // STATE FILTER
                        // -------------------------------------------------
                        .filter(farmer ->
                                matchesState(
                                        farmer,
                                        state
                                )
                        )

                        // -------------------------------------------------
                        // CREATE RESPONSE
                        // -------------------------------------------------
                        .map(farmer -> {

                            Long farmerId = farmer.getFarmerId();
                            List<CertifiedPracticeLog> practices = farmerPractices.getOrDefault(farmerId, List.of());

                            int score = calculateScore(farmerId, practices);
                            
                            int xp = 0;
                            String farmerName = "Farmer";
                            String farmerState = "Unknown";
                            
                            if (farmer.getTotalXp() != null) {
                                xp = farmer.getTotalXp();
                            }
                            if (farmer.getFullName() != null) {
                                farmerName = farmer.getFullName();
                            }
                            if (farmer.getState() != null) {
                                farmerState = farmer.getState();
                            }

                            return new LeaderboardResponse(
                                    0,
                                    farmerId,
                                    farmerName,
                                    farmerState,
                                    score,
                                    MAX_SCORE,
                                    xp
                            );
                        })

                        // -------------------------------------------------
                        // SORT BY XP DESCENDING
                        // -------------------------------------------------
                        .sorted(
                                Comparator
                                        .comparing(LeaderboardResponse::getXp)
                                        .reversed()
                                        .thenComparing(LeaderboardResponse::getFarmerId)
                        )

                        .collect(Collectors.toList());

        // =====================================================
        // ASSIGN RANK
        // =====================================================

        int rank = 1;

        for (LeaderboardResponse response : leaderboard) {
            response.setRank(rank++);
        }

        return leaderboard;
    }

    // =====================================================
    // STATE FILTER
    // =====================================================

    private boolean matchesState(
            FarmerProfileResponse farmer,
            String state) {

        if (state == null || state.isBlank()) {
            return true;
        }

        if (farmer == null || farmer.getState() == null) {
            return false;
        }
        
        return farmer.getState().equalsIgnoreCase(state.trim());
    }

    // =====================================================
    // SCORE CALCULATION
    // =====================================================

    private int calculateScore(Long farmerId, List<CertifiedPracticeLog> verifiedPracticesPeriodFiltered) {

        // 1. Consistency 35%
        // Use VERIFIED practice activity over the last 12 months.
        LocalDateTime oneYearAgo = LocalDateTime.now().minusMonths(12);
        
        List<CertifiedPracticeLog> allVerifiedPractices = practiceRepository
                .findByFarmerIdAndStatus(farmerId, PracticeStatus.VERIFIED);
                
        Set<YearMonth> activeMonths = allVerifiedPractices.stream()
                .filter(p -> p.getVerifiedAt() != null && p.getVerifiedAt().isAfter(oneYearAgo))
                .map(p -> YearMonth.from(p.getVerifiedAt()))
                .collect(Collectors.toSet());
                
        double consistencyPoints = (activeMonths.size() / 12.0) * 35.0;

        // 2. Category Diversity 30%
        // Using the period-filtered verified practices if required, or all verified practices.
        // The prompt says: "Category Diversity: (unique verified categories / 4) × 30"
        Set<SustainabilityCategory> categories = allVerifiedPractices.stream()
                .map(CertifiedPracticeLog::getCategory)
                .collect(Collectors.toSet());
                
        double categoryPoints = (categories.size() / 4.0) * 30.0;

        // 3. Verification Rate 20%
        // (verified practices / total submitted practices) × 20
        List<CertifiedPracticeLog> allSubmitted = practiceRepository.findByFarmerId(farmerId);
        double verificationPoints = 0.0;
        if (!allSubmitted.isEmpty()) {
            verificationPoints = ((double) allVerifiedPractices.size() / allSubmitted.size()) * 20.0;
        }

        // 4. Module Completion 15%
        double modulePoints = 0.0;
        try {
            LearningSummaryResponse learningSummary = learningServiceClient.getLearningSummary(farmerId);
            if (learningSummary != null && learningSummary.getOverallCompletionPercentage() != null) {
                modulePoints = (learningSummary.getOverallCompletionPercentage() / 100.0) * 15.0;
            }
        } catch (Exception e) {
            // If learning service is down or fails, default to 0
        }

        double totalScore = consistencyPoints + categoryPoints + verificationPoints + modulePoints;

        return (int) Math.min(Math.round(totalScore), MAX_SCORE);
    }
}