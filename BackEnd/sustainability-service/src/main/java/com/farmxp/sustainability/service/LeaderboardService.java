package com.farmxp.sustainability.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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

    public LeaderboardService(
            CertifiedPracticeLogRepository practiceRepository) {

        this.practiceRepository = practiceRepository;
    }

    public List<LeaderboardResponse> getLeaderboard(
            LeaderboardPeriod period) {

        List<CertifiedPracticeLog> verifiedPractices;

        if (period == LeaderboardPeriod.WEEK) {

            LocalDateTime start =
                    LocalDateTime.now()
                            .minusDays(7);

            verifiedPractices =
                    practiceRepository
                            .findByStatusAndVerifiedAtAfter(
                                    PracticeStatus.VERIFIED,
                                    start
                            );

        } else if (period == LeaderboardPeriod.MONTH) {

            LocalDateTime start =
                    LocalDateTime.now()
                            .minusDays(30);

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

        Map<Long, List<CertifiedPracticeLog>>
                farmerPractices =
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

        int rank = 1;

        for (LeaderboardResponse response :
                leaderboard) {

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