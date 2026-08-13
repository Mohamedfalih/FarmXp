package com.farmxp.sustainability.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.farmxp.sustainability.client.FarmerServiceClient;
import com.farmxp.sustainability.dto.FarmerProfileResponse;
import com.farmxp.sustainability.dto.LeaderboardResponse;
import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.LeaderboardPeriod;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

@Service
public class LeaderboardService {

    private static final int MAX_CATEGORY_SCORE = 25;
    private static final int MAX_SCORE = 100;

    private final CertifiedPracticeLogRepository practiceRepository;
    private final FarmerServiceClient farmerServiceClient;

    public LeaderboardService(
            CertifiedPracticeLogRepository practiceRepository,
            FarmerServiceClient farmerServiceClient) {

        this.practiceRepository = practiceRepository;
        this.farmerServiceClient = farmerServiceClient;
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
        // CREATE LEADERBOARD
        // =====================================================

        List<LeaderboardResponse> leaderboard =
                farmerPractices.entrySet()
                        .stream()

                        // -------------------------------------------------
                        // STATE FILTER
                        // -------------------------------------------------
                        .filter(entry ->
                                matchesState(
                                        entry.getKey(),
                                        state
                                )
                        )

                        // -------------------------------------------------
                        // CREATE RESPONSE
                        // -------------------------------------------------
                        .map(entry -> {

                            Long farmerId =
                                    entry.getKey();

                            List<CertifiedPracticeLog>
                                    practices =
                                    entry.getValue();

                            int score =
                                    calculateScore(
                                            practices
                                    );

                            return new LeaderboardResponse(
                                    0,
                                    farmerId,
                                    score,
                                    MAX_SCORE
                            );
                        })

                        // -------------------------------------------------
                        // SORT BY SCORE
                        // -------------------------------------------------
                        .sorted(
                                Comparator
                                        .comparing(
                                                LeaderboardResponse
                                                        ::getScore
                                        )
                                        .reversed()

                                        .thenComparing(
                                                LeaderboardResponse
                                                        ::getFarmerId
                                        )
                        )

                        .collect(
                                Collectors.toList()
                        );

        // =====================================================
        // ASSIGN RANK
        // =====================================================

        int rank = 1;

        for (LeaderboardResponse response :
                leaderboard) {

            response.setRank(rank++);
        }

        return leaderboard;
    }

    // =====================================================
    // STATE FILTER
    // =====================================================

    private boolean matchesState(
            Long farmerId,
            String state) {

        // No state filter requested
        if (state == null || state.isBlank()) {
            return true;
        }

        try {

            FarmerProfileResponse farmer =
                    farmerServiceClient.getFarmer(
                            farmerId
                    );

            if (farmer == null
                    || farmer.getState() == null) {

                return false;
            }

            return farmer.getState()
                    .equalsIgnoreCase(
                            state.trim()
                    );

        } catch (Exception e) {

            /*
             * If Farmer Service is unavailable,
             * don't include this farmer in a
             * state-filtered leaderboard.
             */
            return false;
        }
    }

    // =====================================================
    // SCORE CALCULATION
    // =====================================================

    private int calculateScore(
            List<CertifiedPracticeLog> practices) {

        Set<SustainabilityCategory> categories =
                practices.stream()
                        .map(
                                CertifiedPracticeLog::getCategory
                        )
                        .collect(
                                Collectors.toSet()
                        );

        int score =
                categories.size()
                        * MAX_CATEGORY_SCORE;

        return Math.min(
                score,
                MAX_SCORE
        );
    }
}