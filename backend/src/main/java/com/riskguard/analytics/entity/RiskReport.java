package com.riskguard.analytics.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "risk_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String reportName;
    private String reportType;
    private Double averageRiskScore;
    private Double approvalRate;
    private Long totalAssessments;
    private Long approvedCount;
    private Long declinedCount;
    private Long reviewRequiredCount;
    private LocalDate generatedDate;
    private String generatedBy;
    private String reportContent;
}
