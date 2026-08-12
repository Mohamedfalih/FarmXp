package com.farmxp.learning.dto;

import com.farmxp.learning.enums.ProgressStatus;

import java.time.LocalDateTime;

public class ProgressResponse {

    private Long progressId;
    private Long farmerId;
    private Long moduleId;
    private Long gameId;
    private ProgressStatus status;
    private Integer score;
    private Integer totalMarks;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public ProgressResponse() {
    }

    public ProgressResponse(
            Long progressId,
            Long farmerId,
            Long moduleId,
            Long gameId,
            ProgressStatus status,
            Integer score,
            Integer totalMarks,
            LocalDateTime startedAt,
            LocalDateTime completedAt) {

        this.progressId = progressId;
        this.farmerId = farmerId;
        this.moduleId = moduleId;
        this.gameId = gameId;
        this.status = status;
        this.score = score;
        this.totalMarks = totalMarks;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
    }

    public Long getProgressId() {
        return progressId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public Long getGameId() {
        return gameId;
    }

    public ProgressStatus getStatus() {
        return status;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}