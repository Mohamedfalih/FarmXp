package com.farmxp.learning.service;

import com.farmxp.learning.dto.GameRequest;
import com.farmxp.learning.dto.GameResponse;
import com.farmxp.learning.entity.Game;
import com.farmxp.learning.entity.Module;
import com.farmxp.learning.exception.ResourceNotFoundException;
import com.farmxp.learning.repository.GameRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final ModuleService moduleService;

    public GameService(
            GameRepository gameRepository,
            ModuleService moduleService) {

        this.gameRepository = gameRepository;
        this.moduleService = moduleService;
    }

    @Transactional
    public GameResponse createGame(
            Long moduleId,
            GameRequest request) {

        Module module =
                moduleService.getModuleEntity(moduleId);

        Game game = new Game();

        game.setModule(module);
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setGameType(request.getGameType());
        game.setPassingScore(request.getPassingScore());
        game.setDisplayOrder(request.getDisplayOrder());

        return toResponse(
                gameRepository.save(game)
        );
    }

    public List<GameResponse> getGamesByModule(
            Long moduleId) {

        moduleService.getModuleEntity(moduleId);

        return gameRepository
                .findByModuleModuleIdOrderByDisplayOrderAsc(
                        moduleId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Game getGameEntity(Long gameId) {

        return gameRepository.findById(gameId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Game not found"
                        ));
    }

    public GameResponse getGame(Long gameId) {

        return toResponse(
                getGameEntity(gameId)
        );
    }

    @Transactional
    public GameResponse updateGame(
            Long gameId,
            GameRequest request) {

        Game game =
                getGameEntity(gameId);

        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setGameType(request.getGameType());
        game.setPassingScore(request.getPassingScore());
        game.setDisplayOrder(request.getDisplayOrder());

        return toResponse(
                gameRepository.save(game)
        );
    }

    @Transactional
    public void deleteGame(Long gameId) {

        Game game =
                getGameEntity(gameId);

        gameRepository.delete(game);
    }

    private GameResponse toResponse(Game game) {

        return new GameResponse(
                game.getGameId(),
                game.getModule().getModuleId(),
                game.getTitle(),
                game.getDescription(),
                game.getGameType(),
                game.getPassingScore(),
                game.getDisplayOrder()
        );
    }
}