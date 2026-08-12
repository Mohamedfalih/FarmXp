package com.farmxp.market.service;

import com.farmxp.market.dto.MarketBuyerRequest;
import com.farmxp.market.dto.MarketBuyerResponse;
import com.farmxp.market.entity.MarketBuyer;
import com.farmxp.market.enums.BuyerStatus;
import com.farmxp.market.exception.ResourceNotFoundException;
import com.farmxp.market.repository.MarketBuyerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketBuyerService {

    private final MarketBuyerRepository buyerRepository;

    public MarketBuyerService(
            MarketBuyerRepository buyerRepository) {

        this.buyerRepository = buyerRepository;
    }

    public MarketBuyerResponse createBuyer(
            MarketBuyerRequest request) {

        MarketBuyer buyer = new MarketBuyer();

        buyer.setBusinessName(request.businessName());
        buyer.setContactPerson(request.contactPerson());
        buyer.setEmail(request.email());
        buyer.setPhone(request.phone());
        buyer.setAddress(request.address());
        buyer.setDistrict(request.district());
        buyer.setState(request.state());
        buyer.setBuyerType(request.buyerType());
        buyer.setRequiredCrops(request.requiredCrops());
        buyer.setStatus(BuyerStatus.ACTIVE);

        return toResponse(buyerRepository.save(buyer));
    }

    public List<MarketBuyerResponse> getAllBuyers() {

        return buyerRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MarketBuyerResponse getBuyerById(Long buyerId) {

        MarketBuyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Buyer not found with ID: " + buyerId));

        return toResponse(buyer);
    }

    public List<MarketBuyerResponse> getActiveBuyers() {

        return buyerRepository
                .findByStatus(BuyerStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MarketBuyerResponse> getBuyersByDistrict(
            String district) {

        return buyerRepository
                .findByDistrictIgnoreCase(district)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MarketBuyerResponse> getBuyersByState(
            String state) {

        return buyerRepository
                .findByStateIgnoreCase(state)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MarketBuyerResponse updateBuyer(
            Long buyerId,
            MarketBuyerRequest request) {

        MarketBuyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Buyer not found with ID: " + buyerId));

        buyer.setBusinessName(request.businessName());
        buyer.setContactPerson(request.contactPerson());
        buyer.setEmail(request.email());
        buyer.setPhone(request.phone());
        buyer.setAddress(request.address());
        buyer.setDistrict(request.district());
        buyer.setState(request.state());
        buyer.setBuyerType(request.buyerType());
        buyer.setRequiredCrops(request.requiredCrops());

        return toResponse(buyerRepository.save(buyer));
    }

    public MarketBuyerResponse updateStatus(
            Long buyerId,
            BuyerStatus status) {

        MarketBuyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Buyer not found with ID: " + buyerId));

        buyer.setStatus(status);

        return toResponse(buyerRepository.save(buyer));
    }

    public void deleteBuyer(Long buyerId) {

        if (!buyerRepository.existsById(buyerId)) {
            throw new ResourceNotFoundException(
                    "Buyer not found with ID: " + buyerId);
        }

        buyerRepository.deleteById(buyerId);
    }

    private MarketBuyerResponse toResponse(MarketBuyer buyer) {

        return new MarketBuyerResponse(
                buyer.getBuyerId(),
                buyer.getBusinessName(),
                buyer.getContactPerson(),
                buyer.getEmail(),
                buyer.getPhone(),
                buyer.getAddress(),
                buyer.getDistrict(),
                buyer.getState(),
                buyer.getBuyerType(),
                buyer.getRequiredCrops(),
                buyer.getStatus(),
                buyer.getCreatedAt(),
                buyer.getUpdatedAt()
        );
    }
}