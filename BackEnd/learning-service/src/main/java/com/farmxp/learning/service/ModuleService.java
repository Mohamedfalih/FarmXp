package com.farmxp.learning.service;

import com.farmxp.learning.dto.ModuleRequest;
import com.farmxp.learning.dto.ModuleResponse;
import com.farmxp.learning.entity.Module;
import com.farmxp.learning.enums.ModuleStatus;
import com.farmxp.learning.exception.ResourceNotFoundException;
import com.farmxp.learning.repository.ModuleRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(
            ModuleRepository moduleRepository) {

        this.moduleRepository = moduleRepository;
    }

    @Transactional
    public ModuleResponse createModule(
            ModuleRequest request) {

        Module module = new Module();

        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setThumbnailUrl(request.getThumbnailUrl());
        module.setStatus(request.getStatus());
        module.setDisplayOrder(request.getDisplayOrder());

        return toResponse(
                moduleRepository.save(module)
        );
    }

    public List<ModuleResponse> getPublishedModules() {

        return moduleRepository
                .findByStatusOrderByDisplayOrderAsc(
                        ModuleStatus.PUBLISHED
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ModuleResponse> getAllModules() {

        return moduleRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ModuleResponse getModule(Long moduleId) {

        return toResponse(
                getModuleEntity(moduleId)
        );
    }

    @Transactional
    public ModuleResponse updateModule(
            Long moduleId,
            ModuleRequest request) {

        Module module =
                getModuleEntity(moduleId);

        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setThumbnailUrl(request.getThumbnailUrl());
        module.setStatus(request.getStatus());
        module.setDisplayOrder(request.getDisplayOrder());

        return toResponse(
                moduleRepository.save(module)
        );
    }

    @Transactional
    public void deleteModule(Long moduleId) {

        Module module =
                getModuleEntity(moduleId);

        moduleRepository.delete(module);
    }

    public Module getModuleEntity(Long moduleId) {

        return moduleRepository.findById(moduleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Learning module not found"
                        ));
    }

    private ModuleResponse toResponse(
            Module module) {

        return new ModuleResponse(
                module.getModuleId(),
                module.getTitle(),
                module.getDescription(),
                module.getThumbnailUrl(),
                module.getStatus(),
                module.getDisplayOrder(),
                module.getCreatedAt()
        );
    }
}