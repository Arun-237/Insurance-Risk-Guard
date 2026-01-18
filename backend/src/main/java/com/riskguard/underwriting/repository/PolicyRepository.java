package com.riskguard.underwriting.repository;

import com.riskguard.underwriting.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByCustomerId(Long customerId);
    Optional<Policy> findByPolicyNumber(String policyNumber);
    List<Policy> findByStatus(Policy.PolicyStatus status);
}
