package com.farmxp.learning.service;

import com.farmxp.learning.dto.*;
import com.farmxp.learning.entity.Game;
import com.farmxp.learning.entity.Module;
import com.farmxp.learning.entity.Progress;
import com.farmxp.learning.enums.ProgressStatus;
import com.farmxp.learning.exception.ResourceNotFoundException;
import com.farmxp.learning.repository.GameRepository;
import com.farmxp.learning.repository.ProgressRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.farmxp.learning.client.FarmerServiceClient;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final ModuleService moduleService;
    private final GameService gameService;
    private final GameRepository gameRepository;
    private final QuestionService questionService;
    private final FarmerServiceClient farmerServiceClient;

    public ProgressService(
            ProgressRepository progressRepository,
            ModuleService moduleService,
            GameService gameService,
            GameRepository gameRepository,
            QuestionService questionService,
            FarmerServiceClient farmerServiceClient) {

        this.progressRepository = progressRepository;
        this.moduleService = moduleService;
        this.gameService = gameService;
        this.gameRepository = gameRepository;
        this.questionService = questionService;
        this.farmerServiceClient = farmerServiceClient;
    }

    // =========================================================
    // START GAME
    // =========================================================

    public ProgressResponse startGame(
            Long farmerId,
            Long moduleId,
            Long gameId) {

        Module module =
                moduleService.getModuleEntity(moduleId);

        Game game =
                gameService.getGameEntity(gameId);

        // Check whether game belongs to module
        if (!game.getModule().getModuleId()
                .equals(moduleId)) {

            throw new ResourceNotFoundException(
                    "Game does not belong to this module"
            );
        }

        Optional<Progress> existing =
                progressRepository
                        .findByFarmerIdAndModuleModuleIdAndGameGameId(
                                farmerId,
                                moduleId,
                                gameId
                        );

        Progress progress;

        if (existing.isPresent()) {

            progress = existing.get();

        } else {

            progress = new Progress();

            progress.setFarmerId(farmerId);
            progress.setModule(module);
            progress.setGame(game);

            progress.setStatus(
                    ProgressStatus.IN_PROGRESS
            );

            progress.setScore(0);

            progress.setTotalMarks(
                    calculateTotalMarks(gameId)
            );

            progress.setStartedAt(
                    LocalDateTime.now()
            );
        }

        // If somehow NOT_STARTED, move to IN_PROGRESS
        if (progress.getStatus()
                == ProgressStatus.NOT_STARTED) {

            progress.setStatus(
                    ProgressStatus.IN_PROGRESS
            );

            progress.setStartedAt(
                    LocalDateTime.now()
            );
        }

        try {
            return toResponse(
                    progressRepository.saveAndFlush(progress)
            );
        } catch (DataIntegrityViolationException e) {
            // Race condition: another thread already inserted it.
            // Retrieve the existing record instead.
            Progress inserted = progressRepository
                    .findByFarmerIdAndModuleModuleIdAndGameGameId(
                            farmerId, moduleId, gameId)
                    .orElseThrow(() -> new RuntimeException("Concurrent progress creation failed"));
            return toResponse(inserted);
        }
    }

    // =========================================================
    // SUBMIT GAME
    // =========================================================

    public ProgressResponse submitGame(
            Long farmerId,
            Long moduleId,
            Long gameId,
            List<AnswerRequest> answers) {

        Module module =
                moduleService.getModuleEntity(moduleId);

        Game game =
                gameService.getGameEntity(gameId);

        // Check whether game belongs to module
        if (!game.getModule().getModuleId()
                .equals(moduleId)) {

            throw new ResourceNotFoundException(
                    "Game does not belong to this module"
            );
        }

        Progress progress =
                progressRepository
                        .findByFarmerIdAndModuleModuleIdAndGameGameId(
                                farmerId,
                                moduleId,
                                gameId
                        )
                        .orElseGet(() -> {

                            Progress p =
                                    new Progress();

                            p.setFarmerId(farmerId);
                            p.setModule(module);
                            p.setGame(game);

                            p.setStatus(
                                    ProgressStatus.IN_PROGRESS
                            );

                            p.setStartedAt(
                                    LocalDateTime.now()
                            );

                            p.setTotalMarks(
                                    calculateTotalMarks(gameId)
                            );

                            return p;
                        });

        // =====================================================
        // CALCULATE SCORE
        // =====================================================

        int score = 0;

        for (AnswerRequest answer : answers) {

            AnswerResponse result =
                    questionService.checkAnswer(
                            answer
                    );

            score += result.getMarksObtained();
        }

        // =====================================================
        // COMPLETE PROGRESS
        // =====================================================

        int totalMarks =
                calculateTotalMarks(gameId);

        boolean wasCompletedBefore = isModuleCompleted(farmerId, moduleId);

        progress.setScore(score);
        progress.setTotalMarks(totalMarks);
        progress.setStatus(ProgressStatus.COMPLETED);
        progress.setCompletedAt(LocalDateTime.now());

        ProgressResponse response;
        try {
            response = toResponse(progressRepository.saveAndFlush(progress));
        } catch (DataIntegrityViolationException e) {
            Progress inserted = progressRepository
                    .findByFarmerIdAndModuleModuleIdAndGameGameId(
                            farmerId, moduleId, gameId)
                    .orElseThrow(() -> new RuntimeException("Concurrent progress creation failed"));
            
            inserted.setScore(score);
            inserted.setTotalMarks(totalMarks);
            inserted.setStatus(ProgressStatus.COMPLETED);
            inserted.setCompletedAt(LocalDateTime.now());
            
            response = toResponse(progressRepository.saveAndFlush(inserted));
        }

        boolean isCompletedNow = isModuleCompleted(farmerId, moduleId);
        if (!wasCompletedBefore && isCompletedNow) {
            try {
                Integer reward = module.getXpReward() != null ? module.getXpReward() : 0;
                farmerServiceClient.addXp(farmerId, reward);
            } catch (Exception e) {
                // Ignore cross-service call failure
            }
        }

        return response;
    }

    // =========================================================
    // COMPLETE MODULE (NO QUIZ)
    // =========================================================

    public ProgressResponse completeModule(
            Long farmerId,
            Long moduleId) {

        Module module =
                moduleService.getModuleEntity(moduleId);

        // Check if a progress without game already exists
        Progress progress =
                progressRepository
                        .findByFarmerIdAndModuleModuleIdAndGameGameId(
                                farmerId,
                                moduleId,
                                null
                        )
                        .orElseGet(() -> {
                            Progress p = new Progress();
                            p.setFarmerId(farmerId);
                            p.setModule(module);
                            p.setGame(null);
                            p.setStartedAt(LocalDateTime.now());
                            return p;
                        });

        boolean wasCompletedBefore = progress.getStatus() == ProgressStatus.COMPLETED;

        progress.setStatus(ProgressStatus.COMPLETED);
        
        Integer reward = module.getXpReward() != null ? module.getXpReward() : 0;
        progress.setScore(reward);
        progress.setTotalMarks(reward);
        
        if (progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
        }

        ProgressResponse response;
        try {
            response = toResponse(progressRepository.saveAndFlush(progress));
        } catch (DataIntegrityViolationException e) {
            Progress inserted = progressRepository
                    .findByFarmerIdAndModuleModuleIdAndGameGameId(
                            farmerId, moduleId, null)
                    .orElseThrow(() -> new RuntimeException("Concurrent progress creation failed"));
            
            wasCompletedBefore = inserted.getStatus() == ProgressStatus.COMPLETED;
            inserted.setStatus(ProgressStatus.COMPLETED);
            inserted.setScore(reward);
            inserted.setTotalMarks(reward);
            
            response = toResponse(progressRepository.saveAndFlush(inserted));
        }

        if (!wasCompletedBefore) {
            try {
                farmerServiceClient.addXp(farmerId, reward);
            } catch (Exception e) {
                // Ignore cross-service call failure
            }
        }

        return response;
    }

    // =========================================================
    // GET MY PROGRESS
    // =========================================================

    public List<ProgressResponse> getMyProgress(
            Long farmerId) {

        return progressRepository
                .findByFarmerId(farmerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET MODULE PROGRESS
    // =========================================================

    public List<ModuleProgressResponse>
    getModuleProgress(Long farmerId) {

        /*
         * IMPORTANT:
         *
         * moduleService.getPublishedModules()
         * returns List<ModuleResponse>, NOT List<Module>.
         *
         * Therefore we use ModuleResponse here.
         */

        List<ModuleResponse> modules =
                moduleService.getPublishedModules();

        List<ModuleProgressResponse> response =
                new ArrayList<>();

        for (ModuleResponse module : modules) {

            Long moduleId =
                    module.getModuleId();

            List<Game> games =
                    gameRepository
                            .findByModuleModuleIdOrderByDisplayOrderAsc(
                                    moduleId
                            );

            List<Progress> progress =
                    progressRepository
                            .findByFarmerIdAndModuleModuleId(
                                    farmerId,
                                    moduleId
                            );

            // =================================================
            // TOTAL GAMES
            // =================================================

            int totalGames =
                    games.size();

            // =================================================
            // COMPLETED GAMES
            // =================================================

            int completedGames =
                    (int) progress.stream()
                            .filter(p ->
                                    p.getGame() != null
                                    && p.getStatus()
                                    == ProgressStatus.COMPLETED
                            )
                            .count();

            // =================================================
            // MODULE STATUS & PERCENTAGE
            // =================================================

            double percentage;
            ProgressStatus status;

            if (totalGames == 0) {
                
                boolean isCompletedWithoutGame = progress.stream()
                        .anyMatch(p -> p.getGame() == null && p.getStatus() == ProgressStatus.COMPLETED);
                
                if (isCompletedWithoutGame) {
                    percentage = 100.0;
                    status = ProgressStatus.COMPLETED;
                    completedGames = 1; // logical count for summary math
                    totalGames = 1;     // logical count for summary math
                } else {
                    percentage = 0.0;
                    status = ProgressStatus.NOT_STARTED;
                }
                
            } else {

                percentage = (completedGames * 100.0) / totalGames;

                if (completedGames == 0) {
                    status = ProgressStatus.NOT_STARTED;
                } else if (completedGames == totalGames) {
                    status = ProgressStatus.COMPLETED;
                } else {
                    status = ProgressStatus.IN_PROGRESS;
                }
            }

            // =================================================
            // CREATE RESPONSE
            // =================================================

            response.add(
                    new ModuleProgressResponse(
                            moduleId,
                            module.getTitle(),
                            status,
                            completedGames,
                            totalGames,
                            percentage
                    )
            );
        }

        return response;
    }

    private boolean isModuleCompleted(Long farmerId, Long moduleId) {
        List<Game> games = gameRepository.findByModuleModuleIdOrderByDisplayOrderAsc(moduleId);
        List<Progress> progressList = progressRepository.findByFarmerIdAndModuleModuleId(farmerId, moduleId);
        
        int totalGames = games.size();
        if (totalGames == 0) {
            return progressList.stream().anyMatch(p -> p.getGame() == null && p.getStatus() == ProgressStatus.COMPLETED);
        }
        
        long completedGames = progressList.stream()
                .filter(p -> p.getGame() != null && p.getStatus() == ProgressStatus.COMPLETED)
                .count();
                
        return completedGames == totalGames;
    }

    // =========================================================
    // LEARNING SUMMARY
    // =========================================================

    public LearningSummaryResponse
    getLearningSummary(Long farmerId) {

        List<ModuleProgressResponse> modules =
                getModuleProgress(farmerId);

        // =====================================================
        // TOTAL MODULES
        // =====================================================

        int totalModules =
                modules.size();

        // =====================================================
        // COMPLETED MODULES
        // =====================================================

        int completedModules =
                (int) modules.stream()
                        .filter(m ->
                                m.getStatus()
                                == ProgressStatus.COMPLETED
                        )
                        .count();

        // =====================================================
        // COMPLETION PERCENTAGE
        // =====================================================

        double completion =
                totalModules == 0
                        ? 0
                        : completedModules * 100.0
                        / totalModules;

        // =====================================================
        // TOTAL GAMES
        // =====================================================

        int totalGames =
                modules.stream()
                        .mapToInt(
                                ModuleProgressResponse
                                        ::getTotalGames
                        )
                        .sum();

        // =====================================================
        // COMPLETED GAMES
        // =====================================================

        int completedGames =
                modules.stream()
                        .mapToInt(
                                ModuleProgressResponse
                                        ::getCompletedGames
                        )
                        .sum();

        // =====================================================
        // IN PROGRESS MODULES
        // =====================================================

        int inProgressModules =
                (int) modules.stream()
                        .filter(m ->
                                m.getStatus()
                                == ProgressStatus.IN_PROGRESS
                        )
                        .count();

        // =====================================================
        // TOTAL XP IS NOW MAINTAINED BY FARMER_SERVICE
        // =====================================================
        // We will set totalXp to 0 here since it's no longer the source of truth.
        // It will be dropped from LearningSummaryResponse once frontend is updated to use FarmerProfile directly.
        int totalXp = 0;

        // =====================================================
        // RESPONSE
        // =====================================================

        return new LearningSummaryResponse(
                farmerId,
                totalModules,
                completedModules,
                completion,
                completedGames,
                totalGames,
                totalXp,
                inProgressModules
        );
    }

    // =========================================================
    // CALCULATE TOTAL MARKS
    // =========================================================

    private int calculateTotalMarks(
            Long gameId) {

        return questionService
                .getQuestions(gameId)
                .stream()
                .mapToInt(
                        QuestionResponse::getMarks
                )
                .sum();
    }

    // =========================================================
    // CONVERT PROGRESS ENTITY -> RESPONSE
    // =========================================================

    private ProgressResponse toResponse(
            Progress progress) {

        return new ProgressResponse(
                progress.getProgressId(),
                progress.getFarmerId(),

                progress.getModule()
                        .getModuleId(),

                progress.getGame() == null
                        ? null
                        : progress.getGame()
                                .getGameId(),

                progress.getStatus(),

                progress.getScore(),

                progress.getTotalMarks(),

                progress.getStartedAt(),

                progress.getCompletedAt()
        );
    }
}