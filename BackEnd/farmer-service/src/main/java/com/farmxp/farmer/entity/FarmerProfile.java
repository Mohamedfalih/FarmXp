package com.farmxp.farmer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "FARMER_PROFILE")
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FARMER_ID")
    private Long farmerId;

    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @Column(name = "FULL_NAME", nullable = false)
    private String fullName;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "STATE")
    private String state;

    @Column(name = "DISTRICT")
    private String district;

    @Column(name = "VILLAGE")
    private String village;

    @Column(name = "FARM_NAME")
    private String farmName;

    @Column(name = "FARM_SIZE")
    private Double farmSize;

    @Column(name = "FARM_SIZE_UNIT")
    private String farmSizeUnit;

    @Column(name = "TOTAL_XP", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "SOIL_TYPE")
    private String soilType;

    @Column(name = "IRRIGATION_TYPE")
    private String irrigationType;

    public FarmerProfile() {
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
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