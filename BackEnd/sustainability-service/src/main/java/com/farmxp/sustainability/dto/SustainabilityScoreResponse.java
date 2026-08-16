package com.farmxp.sustainability.dto;

import java.util.List;

public class SustainabilityScoreResponse {

    private Long farmerId;
    private Integer totalScore;
    private Integer maxScore;
    private List<CategoryScoreResponse> categoryScores;
    private Integer verifiedPractices;
    private Integer pendingPractices;
    private List<RecentPractice> recentPractices;

    public SustainabilityScoreResponse() {
    }

    public SustainabilityScoreResponse(
            Long farmerId,
            Integer totalScore,
            Integer maxScore,
            List<CategoryScoreResponse> categoryScores,
            Integer verifiedPractices,
            Integer pendingPractices) {

        this.farmerId = farmerId;
        this.totalScore = totalScore;
        this.maxScore = maxScore;
        this.categoryScores = categoryScores;
        this.verifiedPractices = verifiedPractices;
        this.pendingPractices = pendingPractices;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public List<CategoryScoreResponse> getCategoryScores() {
        return categoryScores;
    }

    public void setCategoryScores(List<CategoryScoreResponse> categoryScores) {
        this.categoryScores = categoryScores;
    }

    public Integer getVerifiedPractices() {
        return verifiedPractices;
    }

    public void setVerifiedPractices(Integer verifiedPractices) {
        this.verifiedPractices = verifiedPractices;
    }

    public Integer getPendingPractices() {
        return pendingPractices;
    }

    public void setPendingPractices(Integer pendingPractices) {
        this.pendingPractices = pendingPractices;
    }

    public List<RecentPractice> getRecentPractices() {
        return recentPractices;
    }

    public void setRecentPractices(List<RecentPractice> recentPractices) {
        this.recentPractices = recentPractices;
    }

    public static class RecentPractice {
        private Long id;
        private String name;
        private String date;
        private String status;

        public RecentPractice() {}

        public RecentPractice(Long id, String name, String date, String status) {
            this.id = id;
            this.name = name;
            this.date = date;
            this.status = status;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}