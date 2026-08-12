package com.farmxp.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CropRequest {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    private String variety;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than zero")
    private Double area;

    @NotBlank(message = "Area unit is required")
    private String areaUnit;

    @NotBlank(message = "Season is required")
    private String season;

    private String plantingDate;

    private String expectedHarvestDate;

    private String status;

    public CropRequest() {
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(String plantingDate) {
        this.plantingDate = plantingDate;
    }

    public String getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setExpectedHarvestDate(
            String expectedHarvestDate) {

        this.expectedHarvestDate =
                expectedHarvestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}