package com.farmxp.market.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MarketMatchRequest(

        @NotNull(message = "Farmer ID is required")
        Long farmerId,

        @NotNull(message = "Buyer ID is required")
        Long buyerId,

        @NotBlank(message = "Crop name is required")
        String cropName,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        Double quantity,

        String unit,

        @Positive(message = "Offer price must be positive")
        Double offerPrice
) {
}