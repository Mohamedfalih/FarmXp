package com.farmxp.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class FarmerProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    private String state;

    private String district;

    private String village;

    private String farmName;

    @NotNull(message = "Farm size is required")
    @PositiveOrZero(message = "Farm size cannot be negative")
    private Double farmSize;

    private String farmSizeUnit;

    private String soilType;

    private String irrigationType;

    public FarmerProfileRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public Double getFarmSize() {
        return farmSize;
    }

    public void setFarmSize(Double farmSize) {
        this.farmSize = farmSize;
    }

    public String getFarmSizeUnit() {
        return farmSizeUnit;
    }

    public void setFarmSizeUnit(String farmSizeUnit) {
        this.farmSizeUnit = farmSizeUnit;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getIrrigationType() {
        return irrigationType;
    }

    public void setIrrigationType(String irrigationType) {
        this.irrigationType = irrigationType;
    }
}