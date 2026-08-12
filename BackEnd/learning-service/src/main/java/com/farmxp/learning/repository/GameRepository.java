package com.farmxp.learning.repository;

import com.farmxp.learning.entity.Game;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository
        extends JpaRepository<Game, Long> {

    List<Game> findByModuleModuleIdOrderByDisplayOrderAsc(Long moduleId);

    long countByModuleModuleId(Long moduleId);
}