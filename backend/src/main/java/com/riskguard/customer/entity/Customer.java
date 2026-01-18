package com.riskguard.customer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    private String name;
    private LocalDate dateOfBirth;
    private String contactInfo;
    private String email;
    private String phone;

    @Enumerated(EnumType.STRING)
    private InsuranceType insuranceType;

    private String address;
    private String city;
    private String state;
    private String zipCode;

    private Boolean documentVerified;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    public enum InsuranceType {
        HEALTH, LIFE, MOTOR
    }
}
