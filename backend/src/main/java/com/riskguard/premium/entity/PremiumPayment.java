package com.riskguard.premium.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "premium_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private Long policyId;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentMethod;
    private String transactionId;
    private LocalDate paymentDate;
    private LocalDate dueDate;
    private LocalDate processedDate;
    private String remarks;

    public enum PaymentStatus {
        PAID, UNPAID, PENDING, FAILED, CANCELLED
    }
}
