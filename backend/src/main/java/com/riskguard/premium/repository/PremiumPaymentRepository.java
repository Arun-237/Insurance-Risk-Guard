package com.riskguard.premium.repository;

import com.riskguard.premium.entity.PremiumPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PremiumPaymentRepository extends JpaRepository<PremiumPayment, Long> {
    List<PremiumPayment> findByPolicyId(Long policyId);
    List<PremiumPayment> findByStatus(PremiumPayment.PaymentStatus status);
}
