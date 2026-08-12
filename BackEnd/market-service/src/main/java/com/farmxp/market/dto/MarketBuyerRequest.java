package com.farmxp.market.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MarketBuyerRequest(

        @NotBlank(message = "Business name is required")
        String businessName,

        @NotBlank(message = "Contact person is required")
        String contactPerson,

        @Email(message = "Invalid email")
        String email,

        String phone,
        String address,
        String district,
        String state,
        String buyerType,
        String requiredCrops
) {
}