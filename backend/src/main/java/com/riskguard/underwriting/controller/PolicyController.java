package com.riskguard.underwriting.controller;

import com.riskguard.underwriting.entity.Policy;
import com.riskguard.underwriting.repository.PolicyRepository;
import com.riskguard.audit.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AuditService auditService;

    @PostMapping
    public ResponseEntity<Policy> createPolicy(@RequestBody Policy policy) {
        Policy saved = policyRepository.save(policy);
        auditService.log(
                "CREATE_POLICY",
                "Policy",
                saved.getPolicyId(),
                null,
                "policyNumber=" + (saved.getPolicyNumber() != null ? saved.getPolicyNumber() : "")
                        + ";status=" + (saved.getStatus() != null ? saved.getStatus().name() : "")
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Policy>> getAllPolicies() {
        return ResponseEntity.ok(policyRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(@PathVariable Long id) {
        Optional<Policy> policy = policyRepository.findById(id);
        return policy.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Policy>> getPoliciesByCustomer(@PathVariable Long customerId) {
        List<Policy> policies = policyRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(policies);
    }

    @GetMapping("/number/{policyNumber}")
    public ResponseEntity<Policy> getPolicyByNumber(@PathVariable String policyNumber) {
        Optional<Policy> policy = policyRepository.findByPolicyNumber(policyNumber);
        return policy.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Policy> updatePolicy(@PathVariable Long id, @RequestBody Policy policy) {
        Optional<Policy> existing = policyRepository.findById(id);
        if (existing.isPresent()) {
            policy.setPolicyId(id);
            Policy updated = policyRepository.save(policy);
            auditService.log(
                    "UPDATE_POLICY",
                    "Policy",
                    updated.getPolicyId(),
                    null,
                    "policyNumber=" + (updated.getPolicyNumber() != null ? updated.getPolicyNumber() : "")
                            + ";status=" + (updated.getStatus() != null ? updated.getStatus().name() : "")
            );
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        if (policyRepository.existsById(id)) {
            policyRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
