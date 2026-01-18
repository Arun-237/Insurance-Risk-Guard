package com.riskguard.underwriting.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long policyId;

    private Long customerId;
    private Long decisionId;

    private String policyNumber;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    private String policyDocument;
    private LocalDate issueDate;
    private LocalDate lastModifiedDate;

    public enum PolicyStatus {
        ACTIVE, INACTIVE, EXPIRED, CANCELLED
    }
}
