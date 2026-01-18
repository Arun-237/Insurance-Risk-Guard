package com.riskguard.underwriting.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "underwriting_decisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnderwritingDecision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long decisionId;

    private Long customerId;
    private Long assessmentId;

    @Enumerated(EnumType.STRING)
    private DecisionStatus status;

    private String reason;
    private String underwriterNotes;
    private LocalDate decisionDate;
    private LocalDateTime sentToUnderwritingDate;
    private String decidedBy;
    private LocalDate approvalDate;

    public enum DecisionStatus {
        APPROVED, DECLINED, PENDING, ON_HOLD
    }
}
