package com.farmxp.sustainability.controller;

import com.farmxp.sustainability.dto.LeaderboardResponse;
import com.farmxp.sustainability.enums.LeaderboardPeriod;
import com.farmxp.sustainability.service.LeaderboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sustainability/leaderboard")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService) {

        this.leaderboardService =
                leaderboardService;
    }

    // =====================================================
    // EXISTING API
    // =====================================================

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>>
    getLeaderboard(
            @RequestParam(
                    defaultValue = "ALL"
            )
            LeaderboardPeriod period) {

        return ResponseEntity.ok(
                leaderboardService
                        .getLeaderboard(period)
        );
    }
}