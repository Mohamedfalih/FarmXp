package com.farmxp.sustainability.dto;

public class LeaderboardResponse {

    private int rank;
    private Long farmerId;
    private String farmerName;
    private String state;
    private int score;
    private int maxScore;
    private int xp;

    public LeaderboardResponse() {
    }

    public LeaderboardResponse(
            int rank,
            Long farmerId,
            String farmerName,
            String state,
            int score,
            int maxScore,
            int xp) {

        this.rank = rank;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
        this.state = state;
        this.score = score;
        this.maxScore = maxScore;
        this.xp = xp;
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

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
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

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }
}