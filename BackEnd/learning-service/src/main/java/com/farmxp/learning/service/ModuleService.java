package com.farmxp.learning.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmxp.learning.dto.GameResponse;
import com.farmxp.learning.dto.LearningModuleContentResponse;
import com.farmxp.learning.dto.ModuleRequest;
import com.farmxp.learning.dto.ModuleResponse;
import com.farmxp.learning.entity.Module;
import com.farmxp.learning.enums.ModuleStatus;
import com.farmxp.learning.exception.ResourceNotFoundException;
import com.farmxp.learning.repository.ModuleRepository;
import com.farmxp.learning.repository.GameRepository;
import com.farmxp.learning.client.NotificationServiceClient;
import java.util.Map;

@Service
public class ModuleService {
	
	private final GameRepository gameRepository;
    private final ModuleRepository moduleRepository;
    private final NotificationServiceClient notificationClient;

    public ModuleService(
            ModuleRepository moduleRepository,
            GameRepository gameRepository,
            NotificationServiceClient notificationClient) {

        this.moduleRepository = moduleRepository;
        this.gameRepository = gameRepository;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public ModuleResponse createModule(ModuleRequest request) {

        Module module = new Module();

        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setThumbnailUrl(request.getThumbnailUrl());
        module.setCategory(request.getCategory());
        module.setIcon(request.getIcon());
        module.setVideoUrl(request.getVideoUrl());
        module.setDurationMinutes(request.getDurationMinutes());
        module.setXpReward(request.getXpReward());
        module.setObjectives(request.getObjectives());
        module.setStatus(request.getStatus());
        module.setDisplayOrder(request.getDisplayOrder());

        Module savedModule = moduleRepository.save(module);

        if (savedModule.getStatus() == ModuleStatus.PUBLISHED) {
            try {
                notificationClient.createSystemNotification(Map.of(
                        "title", "New Learning Module",
                        "message", "A new module '" + savedModule.getTitle() + "' is now available.",
                        "type", "SYSTEM",
                        "actionUrl", "/farmer/learning"
                ));
            } catch (Exception e) {
                // Ignore
            }
        }

        return toResponse(savedModule);
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

        ModuleStatus oldStatus = module.getStatus();
        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setThumbnailUrl(request.getThumbnailUrl());
        module.setCategory(request.getCategory());
        module.setIcon(request.getIcon());
        module.setVideoUrl(request.getVideoUrl());
        module.setDurationMinutes(request.getDurationMinutes());
        module.setXpReward(request.getXpReward());
        module.setObjectives(request.getObjectives());
        module.setStatus(request.getStatus());
        module.setDisplayOrder(request.getDisplayOrder());

        Module savedModule = moduleRepository.save(module);

        if (oldStatus != ModuleStatus.PUBLISHED && savedModule.getStatus() == ModuleStatus.PUBLISHED) {
            try {
                notificationClient.createSystemNotification(Map.of(
                        "title", "New Learning Module",
                        "message", "A new module '" + savedModule.getTitle() + "' is now available.",
                        "type", "SYSTEM",
                        "actionUrl", "/farmer/learning"
                ));
            } catch (Exception e) {
                // Ignore
            }
        }

        return toResponse(savedModule);
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

    private ModuleResponse toResponse(Module module) {

        return new ModuleResponse(
                module.getModuleId(),
                module.getTitle(),
                module.getDescription(),
                module.getThumbnailUrl(),
                module.getCategory(),
                module.getIcon(),
                module.getVideoUrl(),
                module.getDurationMinutes(),
                module.getXpReward(),
                module.getObjectives(),
                module.getStatus(),
                module.getDisplayOrder(),
                module.getCreatedAt()
        );
    }
    
    public LearningModuleContentResponse
    getModuleContent(Long moduleId) {

        Module module =
                getModuleEntity(moduleId);

        List<GameResponse> games =
                gameRepository
                        .findByModuleModuleIdOrderByDisplayOrderAsc(
                                moduleId
                        )
                        .stream()
                        .map(game -> new GameResponse(
                                game.getGameId(),
                                game.getModule().getModuleId(),
                                game.getTitle(),
                                game.getDescription(),
                                game.getGameType(),
                                game.getPassingScore(),
                                game.getDisplayOrder()
                        ))
                        .toList();

        return new LearningModuleContentResponse(
                toResponse(module),
                games
        );
    }
}