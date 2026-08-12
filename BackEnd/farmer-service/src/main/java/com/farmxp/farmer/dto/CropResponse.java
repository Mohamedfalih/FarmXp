package com.farmxp.farmer.dto;

public class CropResponse {

    private Long cropId;
    private Long farmerId;
    private String cropName;
    private String variety;
    private Double area;
    private String areaUnit;
    private String season;
    private String plantingDate;
    private String expectedHarvestDate;
    private String status;

    public CropResponse() {
    }

    public CropResponse(
            Long cropId,
            Long farmerId,
            String cropName,
            String variety,
            Double area,
            String areaUnit,
            String season,
            String plantingDate,
            String expectedHarvestDate,
            String status) {

        this.cropId = cropId;
        this.farmerId = farmerId;
        this.cropName = cropName;
        this.variety = variety;
        this.area = area;
        this.areaUnit = areaUnit;
        this.season = season;
        this.plantingDate = plantingDate;
        this.expectedHarvestDate =
                expectedHarvestDate;
        this.status = status;
    }

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
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