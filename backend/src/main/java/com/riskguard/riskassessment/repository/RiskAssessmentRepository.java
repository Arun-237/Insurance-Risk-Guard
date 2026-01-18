package com.riskguard.riskassessment.repository;

import com.riskguard.riskassessment.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    List<RiskAssessment> findByCustomerId(Long customerId);
    List<RiskAssessment> findByResult(RiskAssessment.AssessmentResult result);
    List<RiskAssessment> findByRiskLevel(RiskAssessment.RiskLevel riskLevel);
}
