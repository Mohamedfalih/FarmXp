package com.farmxp.farmer.dto;

public class AdminFarmerListResponse {
    private Long farmerId;
    private Long userId;
    private String fullName;
    private String district;
    private String village;
    private String primaryCrop;
    private Integer sustainabilityScore;
    private String status;

    public AdminFarmerListResponse() {}

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getPrimaryCrop() { return primaryCrop; }
    public void setPrimaryCrop(String primaryCrop) { this.primaryCrop = primaryCrop; }

    public Integer getSustainabilityScore() { return sustainabilityScore; }
    public void setSustainabilityScore(Integer sustainabilityScore) { this.sustainabilityScore = sustainabilityScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
