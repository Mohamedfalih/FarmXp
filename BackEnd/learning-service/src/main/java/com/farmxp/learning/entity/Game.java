package com.farmxp.learning.entity;

import com.farmxp.learning.enums.GameType;

import jakarta.persistence.*;

@Entity
@Table(name = "LEARNING_GAME")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "game_seq")
    @SequenceGenerator(
            name = "game_seq",
            sequenceName = "LEARNING_GAME_SEQ",
            allocationSize = 1
    )
    @Column(name = "game_id")
    private Long gameId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameType gameType;

    @Column(nullable = false)
    private Integer passingScore;

    @Column(nullable = false)
    private Integer displayOrder;

    public Game() {
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
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