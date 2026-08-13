package com.farmxp.market.repository;

import com.farmxp.market.entity.MarketInquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketInquiryRepository
        extends JpaRepository<MarketInquiry, Long> {

    List<MarketInquiry> findByFarmerId(
            Long farmerId);

    List<MarketInquiry> findByBuyerId(
            Long buyerId);
}