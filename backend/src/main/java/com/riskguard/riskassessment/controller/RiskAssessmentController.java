package com.riskguard.riskassessment.controller;

import com.riskguard.riskassessment.entity.RiskAssessment;
import com.riskguard.riskassessment.repository.RiskAssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/risk-assessments")
public class RiskAssessmentController {

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @PostMapping
    public ResponseEntity<RiskAssessment> createAssessment(@RequestBody RiskAssessment assessment) {
        RiskAssessment saved = riskAssessmentRepository.save(assessment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<RiskAssessment>> getAllAssessments() {
        return ResponseEntity.ok(riskAssessmentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskAssessment> getAssessmentById(@PathVariable Long id) {
        Optional<RiskAssessment> assessment = riskAssessmentRepository.findById(id);
        return assessment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RiskAssessment>> getAssessmentsByCustomer(@PathVariable Long customerId) {
        List<RiskAssessment> assessments = riskAssessmentRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/result/{result}")
    public ResponseEntity<List<RiskAssessment>> getAssessmentsByResult(@PathVariable String result) {
        RiskAssessment.AssessmentResult assessmentResult = RiskAssessment.AssessmentResult.valueOf(result.toUpperCase());
        List<RiskAssessment> assessments = riskAssessmentRepository.findByResult(assessmentResult);
        return ResponseEntity.ok(assessments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiskAssessment> updateAssessment(@PathVariable Long id, @RequestBody RiskAssessment assessment) {
        Optional<RiskAssessment> existing = riskAssessmentRepository.findById(id);
        if (existing.isPresent()) {
            assessment.setAssessmentId(id);
            RiskAssessment updated = riskAssessmentRepository.save(assessment);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RiskAssessment> updateAssessmentStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<RiskAssessment> existing = riskAssessmentRepository.findById(id);
        if (existing.isPresent()) {
            RiskAssessment assessment = existing.get();
            try {
                assessment.setStatus(RiskAssessment.AssessmentStatus.valueOf(status.toUpperCase()));
                RiskAssessment updated = riskAssessmentRepository.save(assessment);
                return ResponseEntity.ok(updated);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
