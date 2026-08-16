package com.farmxp.farmer.dto;

public class FarmerProfileResponse {

    private Long farmerId;
    private Long userId;
    private String fullName;
    private String phone;
    private String state;
    private String district;
    private String village;
    private String farmName;
    private Double farmSize;
    private String farmSizeUnit;
    private Integer totalXp;
    private String soilType;
    private String irrigationType;

    public FarmerProfileResponse(
            Long farmerId,
            Long userId,
            String fullName,
            String phone,
            String state,
            String district,
            String village,
            String farmName,
            Double farmSize,
            String farmSizeUnit,
            Integer totalXp,
            String soilType,
            String irrigationType) {

        this.farmerId = farmerId;
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.state = state;
        this.district = district;
        this.village = village;
        this.farmName = farmName;
        this.farmSize = farmSize;
        this.farmSizeUnit = farmSizeUnit;
        this.totalXp = totalXp;
        this.soilType = soilType;
        this.irrigationType = irrigationType;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getState() {
        return state;
    }

    public String getDistrict() {
        return district;
    }

    public String getVillage() {
        return village;
    }

    public String getFarmName() {
        return farmName;
    }

    public Double getFarmSize() {
        return farmSize;
    }

    public String getFarmSizeUnit() {
        return farmSizeUnit;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public String getSoilType() {
        return soilType;
    }

    public String getIrrigationType() {
        return irrigationType;
    }
}