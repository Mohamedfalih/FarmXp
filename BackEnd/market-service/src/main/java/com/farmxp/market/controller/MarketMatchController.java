package com.farmxp.market.controller;

import com.farmxp.market.dto.MarketMatchRequest;
import com.farmxp.market.dto.MarketMatchResponse;
import com.farmxp.market.enums.MatchStatus;
import com.farmxp.market.service.MarketMatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market/matches")
public class MarketMatchController {

    private final MarketMatchService matchService;

    public MarketMatchController(
            MarketMatchService matchService) {

        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<MarketMatchResponse> createMatch(
            @Valid @RequestBody MarketMatchRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(matchService.createMatch(request));
    }

    @GetMapping
    public ResponseEntity<List<MarketMatchResponse>> getAllMatches() {

        return ResponseEntity.ok(
                matchService.getAllMatches());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<MarketMatchResponse>>
    getMatchesByFarmer(
            @PathVariable Long farmerId) {

        return ResponseEntity.ok(
                matchService.getMatchesByFarmer(farmerId));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<MarketMatchResponse>>
    getMatchesByBuyer(
            @PathVariable Long buyerId) {

        return ResponseEntity.ok(
                matchService.getMatchesByBuyer(buyerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MarketMatchResponse>>
    getMatchesByStatus(
            @PathVariable MatchStatus status) {

        return ResponseEntity.ok(
                matchService.getMatchesByStatus(status));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<MarketMatchResponse> getMatchById(
            @PathVariable Long matchId) {

        return ResponseEntity.ok(
                matchService.getMatchById(matchId));
    }

    @PatchMapping("/{matchId}/status")
    public ResponseEntity<MarketMatchResponse> updateStatus(
            @PathVariable Long matchId,
            @RequestParam MatchStatus status) {

        return ResponseEntity.ok(
                matchService.updateStatus(matchId, status));
    }

    @DeleteMapping("/{matchId}")
    public ResponseEntity<Void> deleteMatch(
            @PathVariable Long matchId) {

        matchService.deleteMatch(matchId);

        return ResponseEntity.noContent().build();
    }
}