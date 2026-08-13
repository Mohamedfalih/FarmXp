package com.farmxp.market.service;

import com.farmxp.market.dto.MarketInquiryRequest;
import com.farmxp.market.entity.MarketInquiry;
import com.farmxp.market.repository.MarketInquiryRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarketInquiryService {

    private final MarketInquiryRepository repository;

    public MarketInquiryService(
            MarketInquiryRepository repository) {

        this.repository = repository;
    }

    public MarketInquiry create(
            Long farmerId,
            MarketInquiryRequest request) {

        MarketInquiry inquiry =
                new MarketInquiry();

        inquiry.setFarmerId(farmerId);
        inquiry.setBuyerId(request.getBuyerId());
        inquiry.setCropType(request.getCropType());
        inquiry.setQuantity(request.getQuantity());
        inquiry.setMessage(request.getMessage());
        inquiry.setCreatedAt(
                LocalDateTime.now());

        return repository.save(inquiry);
    }

    public List<MarketInquiry> getMyInquiries(
            Long farmerId) {

        return repository.findByFarmerId(
                farmerId);
    }

    public MarketInquiry getById(
            Long inquiryId) {

        return repository.findById(inquiryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inquiry not found"));
    }
}