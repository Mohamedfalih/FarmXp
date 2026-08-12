package com.farmxp.scheme.repository;

import com.farmxp.scheme.entity.Scheme;
import com.farmxp.scheme.enums.SchemeStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepository
        extends JpaRepository<Scheme, Long> {

    List<Scheme>
    findByStatusOrderByLastDateAsc(
            SchemeStatus status
    );

    List<Scheme>
    findByStateIgnoreCaseAndStatusOrderByLastDateAsc(
            String state,
            SchemeStatus status
    );

    List<Scheme>
    findAllByOrderByCreatedAtDesc();
}