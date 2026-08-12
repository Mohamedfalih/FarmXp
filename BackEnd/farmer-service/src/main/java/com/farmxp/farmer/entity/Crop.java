package com.farmxp.farmer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CROP")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CROP_ID")
    private Long cropId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "FARMER_ID",
            nullable = false
    )
    private FarmerProfile farmerProfile;

    @Column(name = "CROP_NAME", nullable = false)
    private String cropName;

    @Column(name = "VARIETY")
    private String variety;

    @Column(name = "AREA")
    private Double area;

    @Column(name = "AREA_UNIT")
    private String areaUnit;

    @Column(name = "SEASON")
    private String season;

    @Column(name = "PLANTING_DATE")
    private String plantingDate;

    @Column(name = "EXPECTED_HARVEST_DATE")
    private String expectedHarvestDate;

    @Column(name = "STATUS")
    private String status;

    public Crop() {
    }

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public FarmerProfile getFarmerProfile() {
        return farmerProfile;
    }

    public void setFarmerProfile(
            FarmerProfile farmerProfile) {

        this.farmerProfile = farmerProfile;
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