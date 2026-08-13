package com.farmxp.learning.dto;

import java.util.List;

public class LearningModuleContentResponse {

    private ModuleResponse module;
    private List<GameResponse> games;

    public LearningModuleContentResponse() {
    }

    public LearningModuleContentResponse(
            ModuleResponse module,
            List<GameResponse> games) {

        this.module = module;
        this.games = games;
    }

    public ModuleResponse getModule() {
        return module;
    }

    public List<GameResponse> getGames() {
        return games;
    }
}