package com.farmxp.farmer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmxp.farmer.entity.FarmerProfile;

public interface FarmerProfileRepository
        extends JpaRepository<FarmerProfile, Long> {

    Optional<FarmerProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}