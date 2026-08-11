package com.farmxp.sustainability.model;

public class ScoreBreakdown {

    private int waterScore;
    private int soilScore;
    private int pestControlScore;
    private int cropDiversityScore;

    public ScoreBreakdown() {
    }

    public int getWaterScore() {
        return waterScore;
    }

    public void setWaterScore(int waterScore) {
        this.waterScore = waterScore;
    }

    public int getSoilScore() {
        return soilScore;
    }

    public void setSoilScore(int soilScore) {
        this.soilScore = soilScore;
    }

    public int getPestControlScore() {
        return pestControlScore;
    }

    public void setPestControlScore(int pestControlScore) {
        this.pestControlScore = pestControlScore;
    }

    public int getCropDiversityScore() {
        return cropDiversityScore;
    }

    public void setCropDiversityScore(int cropDiversityScore) {
        this.cropDiversityScore = cropDiversityScore;
    }

    public int getTotalScore() {
        return waterScore
                + soilScore
                + pestControlScore
                + cropDiversityScore;
    }
}