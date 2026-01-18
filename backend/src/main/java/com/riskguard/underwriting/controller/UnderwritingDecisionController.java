package com.riskguard.underwriting.controller;

import com.riskguard.underwriting.entity.UnderwritingDecision;
import com.riskguard.underwriting.repository.UnderwritingDecisionRepository;
import com.riskguard.audit.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/underwriting-decisions")
public class UnderwritingDecisionController {

    @Autowired
    private UnderwritingDecisionRepository decisionRepository;

    @Autowired
    private AuditService auditService;

    @PostMapping
    public ResponseEntity<UnderwritingDecision> createDecision(@RequestBody UnderwritingDecision decision) {
        // Set sent to underwriting date and time
        if (decision.getSentToUnderwritingDate() == null) {
            decision.setSentToUnderwritingDate(LocalDateTime.now());
        }
        UnderwritingDecision saved = decisionRepository.save(decision);
        auditService.log(
                "CREATE_DECISION",
                "UnderwritingDecision",
                saved.getDecisionId(),
                saved.getDecidedBy(),
                "status=" + (saved.getStatus() != null ? saved.getStatus().name() : "null")
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<UnderwritingDecision>> getAllDecisions() {
        return ResponseEntity.ok(decisionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnderwritingDecision> getDecisionById(@PathVariable Long id) {
        Optional<UnderwritingDecision> decision = decisionRepository.findById(id);
        return decision.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<UnderwritingDecision>> getDecisionsByCustomer(@PathVariable Long customerId) {
        List<UnderwritingDecision> decisions = decisionRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(decisions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<UnderwritingDecision>> getDecisionsByStatus(@PathVariable String status) {
        UnderwritingDecision.DecisionStatus decisionStatus = UnderwritingDecision.DecisionStatus.valueOf(status.toUpperCase());
        List<UnderwritingDecision> decisions = decisionRepository.findByStatus(decisionStatus);
        return ResponseEntity.ok(decisions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnderwritingDecision> updateDecision(@PathVariable Long id, @RequestBody UnderwritingDecision decision) {
        Optional<UnderwritingDecision> existing = decisionRepository.findById(id);
        if (existing.isPresent()) {
            decision.setDecisionId(id);
            UnderwritingDecision updated = decisionRepository.save(decision);
            auditService.log(
                    "UPDATE_DECISION",
                    "UnderwritingDecision",
                    updated.getDecisionId(),
                    updated.getDecidedBy(),
                    "status=" + (updated.getStatus() != null ? updated.getStatus().name() : "null")
                            + ";reason=" + (updated.getReason() != null ? updated.getReason() : "")
            );
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDecision(@PathVariable Long id) {
        Optional<UnderwritingDecision> existing = decisionRepository.findById(id);
        if (existing.isPresent()) {
            UnderwritingDecision decision = existing.get();
            auditService.log(
                    "DELETE_DECISION",
                    "UnderwritingDecision",
                    id,
                    "Admin",
                    "Deleted decision for customer=" + decision.getCustomerId()
            );
            decisionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
