package com.farmxp.market.entity;

import com.farmxp.market.enums.BuyerStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MARKET_BUYER")
public class MarketBuyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BUYER_ID")
    private Long buyerId;

    @Column(name = "BUSINESS_NAME", nullable = false, length = 150)
    private String businessName;

    @Column(name = "CONTACT_PERSON", nullable = false, length = 100)
    private String contactPerson;

    @Column(name = "EMAIL", length = 150)
    private String email;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "ADDRESS", length = 500)
    private String address;

    @Column(name = "DISTRICT", length = 100)
    private String district;

    @Column(name = "STATE", length = 100)
    private String state;

    @Column(name = "BUYER_TYPE", length = 100)
    private String buyerType;

    @Column(name = "REQUIRED_CROPS", length = 500)
    private String requiredCrops;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private BuyerStatus status;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public MarketBuyer() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = BuyerStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }

    public String getRequiredCrops() {
        return requiredCrops;
    }

    public void setRequiredCrops(String requiredCrops) {
        this.requiredCrops = requiredCrops;
    }

    public BuyerStatus getStatus() {
        return status;
    }

    public void setStatus(BuyerStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}