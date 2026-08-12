package com.farmxp.sustainability.service;

import com.farmxp.sustainability.dto.LeaderboardResponse;
import com.farmxp.sustainability.entity.CertifiedPracticeLog;
import com.farmxp.sustainability.enums.PracticeStatus;
import com.farmxp.sustainability.enums.SustainabilityCategory;
import com.farmxp.sustainability.repository.CertifiedPracticeLogRepository;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private static final int MAX_CATEGORY_SCORE = 25;
    private static final int MAX_SCORE = 100;

    private final CertifiedPracticeLogRepository practiceRepository;

    public LeaderboardService(
            CertifiedPracticeLogRepository practiceRepository) {

        this.practiceRepository = practiceRepository;
    }

    public List<LeaderboardResponse> getLeaderboard() {

        List<CertifiedPracticeLog> verifiedPractices =
                practiceRepository.findByStatus(
                        PracticeStatus.VERIFIED
                );

        /*
         * Group verified practices by farmer.
         */
        Map<Long, List<CertifiedPracticeLog>> farmerPractices =
                verifiedPractices.stream()
                        .collect(
                                Collectors.groupingBy(
                                        CertifiedPracticeLog::getFarmerId
                                )
                        );

        List<LeaderboardResponse> leaderboard =
                farmerPractices.entrySet()
                        .stream()
                        .map(entry -> {

                            Long farmerId = entry.getKey();

                            List<CertifiedPracticeLog> practices =
                                    entry.getValue();

                            int score = calculateScore(
                                    practices
                            );

                            return new LeaderboardResponse(
                                    0,
                                    farmerId,
                                    score,
                                    MAX_SCORE
                            );
                        })
                        .sorted(
                                Comparator
                                        .comparing(
                                                LeaderboardResponse::getScore
                                        )
                                        .reversed()
                                        .thenComparing(
                                                LeaderboardResponse::getFarmerId
                                        )
                        )
                        .collect(Collectors.toList());

        /*
         * Assign ranks after sorting.
         */
        int rank = 1;

        for (LeaderboardResponse response : leaderboard) {
            response.setRank(rank++);
        }

        return leaderboard;
    }

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