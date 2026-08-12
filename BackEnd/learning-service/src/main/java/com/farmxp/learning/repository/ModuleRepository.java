package com.farmxp.learning.repository;

import com.farmxp.learning.entity.Module;
import com.farmxp.learning.enums.ModuleStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository
        extends JpaRepository<Module, Long> {

    List<Module> findByStatusOrderByDisplayOrderAsc(ModuleStatus status);

    List<Module> findAllByOrderByDisplayOrderAsc();
}