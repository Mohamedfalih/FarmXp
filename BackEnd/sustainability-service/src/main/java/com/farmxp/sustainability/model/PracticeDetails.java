package com.farmxp.sustainability.model;

import com.farmxp.sustainability.enums.SustainabilityCategory;

public class PracticeDetails {

    private SustainabilityCategory category;
    private String practiceName;
    private Integer points;

    public PracticeDetails() {
    }

    public PracticeDetails(
            SustainabilityCategory category,
            String practiceName,
            Integer points) {

        this.category = category;
        this.practiceName = practiceName;
        this.points = points;
    }

    public SustainabilityCategory getCategory() {
        return category;
    }

    public void setCategory(SustainabilityCategory category) {
        this.category = category;
    }

    public String getPracticeName() {
        return practiceName;
    }

    public void setPracticeName(String practiceName) {
        this.practiceName = practiceName;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}