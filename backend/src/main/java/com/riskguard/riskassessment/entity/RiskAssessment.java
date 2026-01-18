package com.riskguard.riskassessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "risk_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assessmentId;

    private Long customerId;
    private Double riskScore;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private String rulesApplied;
    private String explanation;

    @Enumerated(EnumType.STRING)
    private AssessmentResult result;

    private Boolean flaggedForManualReview;
    private LocalDate assessmentDate;
    private LocalDate updatedDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'PENDING'")
    private AssessmentStatus status;

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum AssessmentResult {
        APPROVED, REVIEW_REQUIRED, DECLINED
    }

    public enum AssessmentStatus {
        PENDING, SENT_TO_UNDERWRITING, COMPLETED
    }
}
