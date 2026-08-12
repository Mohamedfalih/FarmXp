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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final ModuleService moduleService;
    private final GameService gameService;
    private final GameRepository gameRepository;
    private final QuestionService questionService;

    public ProgressService(
            ProgressRepository progressRepository,
            ModuleService moduleService,
            GameService gameService,
            GameRepository gameRepository,
            QuestionService questionService) {

        this.progressRepository = progressRepository;
        this.moduleService = moduleService;
        this.gameService = gameService;
        this.gameRepository = gameRepository;
        this.questionService = questionService;
    }

    // =========================================================
    // START GAME
    // =========================================================

    @Transactional
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

        return toResponse(
                progressRepository.save(progress)
        );
    }

    // =========================================================
    // SUBMIT GAME
    // =========================================================

    @Transactional
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

        progress.setScore(score);

        progress.setTotalMarks(totalMarks);

        progress.setStatus(
                ProgressStatus.COMPLETED
        );

        progress.setCompletedAt(
                LocalDateTime.now()
        );

        return toResponse(
                progressRepository.save(progress)
        );
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
            // COMPLETION PERCENTAGE
            // =================================================

            double percentage =
                    totalGames == 0
                            ? 0
                            : (completedGames * 100.0)
                            / totalGames;

            // =================================================
            // MODULE STATUS
            // =================================================

            ProgressStatus status;

            if (completedGames == 0) {

                status =
                        ProgressStatus.NOT_STARTED;

            } else if (completedGames
                    == totalGames) {

                status =
                        ProgressStatus.COMPLETED;

            } else {

                status =
                        ProgressStatus.IN_PROGRESS;
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
        // RESPONSE
        // =====================================================

        return new LearningSummaryResponse(
                farmerId,
                totalModules,
                completedModules,
                completion,
                completedGames,
                totalGames
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