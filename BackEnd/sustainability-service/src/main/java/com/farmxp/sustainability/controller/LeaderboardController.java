package com.farmxp.sustainability.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmxp.sustainability.dto.LeaderboardResponse;
import com.farmxp.sustainability.enums.LeaderboardPeriod;
import com.farmxp.sustainability.service.LeaderboardService;

@RestController
@RequestMapping("/api/sustainability/leaderboard")
//@CrossOrigin(origins = "http://localhost:5173")
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
                    defaultValue = "ALL")
            LeaderboardPeriod period,

            @RequestParam(
                    required = false)
            String state) {

        return ResponseEntity.ok(
                leaderboardService.getLeaderboard(
                        period,
                        state)
        );
    }
}