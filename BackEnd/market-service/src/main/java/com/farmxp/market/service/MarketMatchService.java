package com.farmxp.market.service;

import com.farmxp.market.dto.MarketMatchRequest;
import com.farmxp.market.dto.MarketMatchResponse;
import com.farmxp.market.entity.MarketBuyer;
import com.farmxp.market.entity.MarketMatch;
import com.farmxp.market.enums.MatchStatus;
import com.farmxp.market.exception.ResourceNotFoundException;
import com.farmxp.market.repository.MarketBuyerRepository;
import com.farmxp.market.repository.MarketMatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketMatchService {

    private final MarketMatchRepository matchRepository;
    private final MarketBuyerRepository buyerRepository;

    public MarketMatchService(
            MarketMatchRepository matchRepository,
            MarketBuyerRepository buyerRepository) {

        this.matchRepository = matchRepository;
        this.buyerRepository = buyerRepository;
    }

    public MarketMatchResponse createMatch(
            MarketMatchRequest request) {

        MarketBuyer buyer = buyerRepository
                .findById(request.buyerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Buyer not found with ID: "
                                        + request.buyerId()));

        MarketMatch match = new MarketMatch();

        match.setFarmerId(request.farmerId());
        match.setBuyer(buyer);
        match.setCropName(request.cropName());
        match.setQuantity(request.quantity());
        match.setUnit(request.unit());
        match.setOfferPrice(request.offerPrice());
        match.setStatus(MatchStatus.PENDING);

        return toResponse(matchRepository.save(match));
    }

    public MarketMatchResponse getMatchById(Long matchId) {

        MarketMatch match = matchRepository
                .findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Market match not found with ID: "
                                        + matchId));

        return toResponse(match);
    }

    public List<MarketMatchResponse> getAllMatches() {

        return matchRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MarketMatchResponse> getMatchesByFarmer(
            Long farmerId) {

        return matchRepository
                .findByFarmerId(farmerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MarketMatchResponse> getMatchesByBuyer(
            Long buyerId) {

        return matchRepository
                .findByBuyerBuyerId(buyerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MarketMatchResponse> getMatchesByStatus(
            MatchStatus status) {

        return matchRepository
                .findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MarketMatchResponse updateStatus(
            Long matchId,
            MatchStatus status) {

        MarketMatch match = matchRepository
                .findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Market match not found with ID: "
                                        + matchId));

        match.setStatus(status);

        return toResponse(matchRepository.save(match));
    }

    public void deleteMatch(Long matchId) {

        if (!matchRepository.existsById(matchId)) {
            throw new ResourceNotFoundException(
                    "Market match not found with ID: " + matchId);
        }

        matchRepository.deleteById(matchId);
    }

    private MarketMatchResponse toResponse(
            MarketMatch match) {

        return new MarketMatchResponse(
                match.getMatchId(),
                match.getFarmerId(),
                match.getBuyer().getBuyerId(),
                match.getBuyer().getBusinessName(),
                match.getCropName(),
                match.getQuantity(),
                match.getUnit(),
                match.getOfferPrice(),
                match.getStatus(),
                match.getCreatedAt(),
                match.getUpdatedAt()
        );
    }
}