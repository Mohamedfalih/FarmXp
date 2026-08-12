package com.farmxp.learning.entity;

import com.farmxp.learning.enums.ProgressStatus;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table( name = "LEARNING_PROGRESS", uniqueConstraints = { 
                @UniqueConstraint(
                        name = "UK_PROGRESS_FARMER_MODULE_GAME",
                        columnNames = {
                                "farmer_id",
                                "module_id",
                                "game_id"
                        }
                )
        }
)
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "progress_seq")
    @SequenceGenerator(
            name = "progress_seq",
            sequenceName = "LEARNING_PROGRESS_SEQ",
            allocationSize = 1
    )
    @Column(name = "progress_id")
    private Long progressId;

    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status;

    private Integer score;

    private Integer totalMarks;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    public Progress() {
    }

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = ProgressStatus.NOT_STARTED;
        }
    }

    public Long getProgressId() {
        return progressId;
    }

    public void setProgressId(Long progressId) {
        this.progressId = progressId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public ProgressStatus getStatus() {
        return status;
    }

    public void setStatus(ProgressStatus status) {
        this.status = status;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}