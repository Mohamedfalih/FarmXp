package com.farmxp.market.dto;

import com.farmxp.market.enums.BuyerStatus;

import java.time.LocalDateTime;

public record MarketBuyerResponse(
        Long buyerId,
        String businessName,
        String contactPerson,
        String email,
        String phone,
        String address,
        String district,
        String state,
        String buyerType,
        String requiredCrops,
        BuyerStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}