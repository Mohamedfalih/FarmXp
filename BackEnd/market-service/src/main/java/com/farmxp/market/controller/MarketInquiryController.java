package com.farmxp.market.controller;

import com.farmxp.market.dto.MarketInquiryRequest;
import com.farmxp.market.entity.MarketInquiry;
import com.farmxp.market.service.MarketInquiryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market/inquiries")
public class MarketInquiryController {

    private final MarketInquiryService service;

    public MarketInquiryController(
            MarketInquiryService service) {

        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MarketInquiry> create(
            Authentication authentication,
            @Valid @RequestBody
            MarketInquiryRequest request) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.create(
                                farmerId,
                                request)
                );
    }

    @GetMapping("/my")
    public ResponseEntity<List<MarketInquiry>>
    getMy(Authentication authentication) {

        Long farmerId =
                Long.parseLong(
                        authentication.getName());

        return ResponseEntity.ok(
                service.getMyInquiries(farmerId)
        );
    }

    @GetMapping("/{inquiryId}")
    public ResponseEntity<MarketInquiry>
    getById(
            @PathVariable Long inquiryId) {

        return ResponseEntity.ok(
                service.getById(inquiryId)
        );
    }
}