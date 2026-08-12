package com.farmxp.sustainability.dto;

public class LeaderboardResponse {

    private int rank;
    private Long farmerId;
    private int score;
    private int maxScore;

    public LeaderboardResponse() {
    }

    public LeaderboardResponse(
            int rank,
            Long farmerId,
            int score,
            int maxScore) {

        this.rank = rank;
        this.farmerId = farmerId;
        this.score = score;
        this.maxScore = maxScore;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }
}