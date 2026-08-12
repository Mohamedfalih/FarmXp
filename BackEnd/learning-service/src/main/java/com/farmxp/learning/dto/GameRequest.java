package com.farmxp.learning.dto;

import com.farmxp.learning.enums.GameType;

import jakarta.validation.constraints.*;

public class GameRequest {

    @NotBlank(message = "Game title is required")
    private String title;

    private String description;

    @NotNull(message = "Game type is required")
    private GameType gameType;

    @NotNull(message = "Passing score is required")
    @PositiveOrZero(message = "Passing score cannot be negative")
    private Integer passingScore;

    @NotNull(message = "Display order is required")
    @PositiveOrZero(message = "Display order cannot be negative")
    private Integer displayOrder;

    public GameRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public GameType getGameType() {
        return gameType;
    }

    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}