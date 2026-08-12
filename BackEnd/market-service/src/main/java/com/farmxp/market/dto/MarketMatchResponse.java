package com.farmxp.market.dto;

import com.farmxp.market.enums.MatchStatus;

import java.time.LocalDateTime;

public record MarketMatchResponse(
        Long matchId,
        Long farmerId,
        Long buyerId,
        String businessName,
        String cropName,
        Double quantity,
        String unit,
        Double offerPrice,
        MatchStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}