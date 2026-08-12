package com.farmxp.learning.dto;

import com.farmxp.learning.enums.GameType;

public class GameResponse {

    private Long gameId;
    private Long moduleId;
    private String title;
    private String description;
    private GameType gameType;
    private Integer passingScore;
    private Integer displayOrder;

    public GameResponse() {
    }

    public GameResponse(
            Long gameId,
            Long moduleId,
            String title,
            String description,
            GameType gameType,
            Integer passingScore,
            Integer displayOrder) {

        this.gameId = gameId;
        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.gameType = gameType;
        this.passingScore = passingScore;
        this.displayOrder = displayOrder;
    }

    public Long getGameId() {
        return gameId;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public GameType getGameType() {
        return gameType;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }
}