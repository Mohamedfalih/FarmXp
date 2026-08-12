package com.farmxp.market.controller;

import com.farmxp.market.dto.MarketBuyerRequest;
import com.farmxp.market.dto.MarketBuyerResponse;
import com.farmxp.market.enums.BuyerStatus;
import com.farmxp.market.service.MarketBuyerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market/buyers")
public class MarketBuyerController {

    private final MarketBuyerService buyerService;

    public MarketBuyerController(
            MarketBuyerService buyerService) {

        this.buyerService = buyerService;
    }

    @PostMapping
    public ResponseEntity<MarketBuyerResponse> createBuyer(
            @Valid @RequestBody MarketBuyerRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(buyerService.createBuyer(request));
    }

    @GetMapping
    public ResponseEntity<List<MarketBuyerResponse>> getAllBuyers() {

        return ResponseEntity.ok(
                buyerService.getAllBuyers());
    }

    @GetMapping("/active")
    public ResponseEntity<List<MarketBuyerResponse>> getActiveBuyers() {

        return ResponseEntity.ok(
                buyerService.getActiveBuyers());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<MarketBuyerResponse>>
    getBuyersByDistrict(
            @PathVariable String district) {

        return ResponseEntity.ok(
                buyerService.getBuyersByDistrict(district));
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<MarketBuyerResponse>>
    getBuyersByState(
            @PathVariable String state) {

        return ResponseEntity.ok(
                buyerService.getBuyersByState(state));
    }

    @GetMapping("/{buyerId}")
    public ResponseEntity<MarketBuyerResponse> getBuyerById(
            @PathVariable Long buyerId) {

        return ResponseEntity.ok(
                buyerService.getBuyerById(buyerId));
    }

    @PutMapping("/{buyerId}")
    public ResponseEntity<MarketBuyerResponse> updateBuyer(
            @PathVariable Long buyerId,
            @Valid @RequestBody MarketBuyerRequest request) {

        return ResponseEntity.ok(
                buyerService.updateBuyer(buyerId, request));
    }

    @PatchMapping("/{buyerId}/status")
    public ResponseEntity<MarketBuyerResponse> updateStatus(
            @PathVariable Long buyerId,
            @RequestParam BuyerStatus status) {

        return ResponseEntity.ok(
                buyerService.updateStatus(buyerId, status));
    }

    @DeleteMapping("/{buyerId}")
    public ResponseEntity<Void> deleteBuyer(
            @PathVariable Long buyerId) {

        buyerService.deleteBuyer(buyerId);

        return ResponseEntity.noContent().build();
    }
}