package com.riskguard.underwriting.repository;

import com.riskguard.underwriting.entity.UnderwritingDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnderwritingDecisionRepository extends JpaRepository<UnderwritingDecision, Long> {
    List<UnderwritingDecision> findByCustomerId(Long customerId);
    List<UnderwritingDecision> findByStatus(UnderwritingDecision.DecisionStatus status);
}
