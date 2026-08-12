package com.farmxp.market.repository;

import com.farmxp.market.entity.MarketMatch;
import com.farmxp.market.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketMatchRepository
        extends JpaRepository<MarketMatch, Long> {

    List<MarketMatch> findByFarmerId(Long farmerId);

    List<MarketMatch> findByBuyerBuyerId(Long buyerId);

    List<MarketMatch> findByStatus(MatchStatus status);

    List<MarketMatch> findByFarmerIdAndStatus(
            Long farmerId,
            MatchStatus status
    );
}