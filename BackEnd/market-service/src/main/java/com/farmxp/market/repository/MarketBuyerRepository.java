package com.farmxp.market.repository;

import com.farmxp.market.entity.MarketBuyer;
import com.farmxp.market.enums.BuyerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketBuyerRepository
        extends JpaRepository<MarketBuyer, Long> {

    List<MarketBuyer> findByStatus(BuyerStatus status);

    List<MarketBuyer> findByDistrictIgnoreCase(String district);

    List<MarketBuyer> findByStateIgnoreCase(String state);
}