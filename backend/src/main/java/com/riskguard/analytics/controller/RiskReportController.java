package com.riskguard.analytics.controller;

import com.riskguard.analytics.entity.RiskReport;
import com.riskguard.analytics.repository.RiskReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/risk-reports")
public class RiskReportController {

    @Autowired
    private RiskReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<RiskReport> createReport(@RequestBody RiskReport report) {
        RiskReport saved = reportRepository.save(report);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<RiskReport>> getAllReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskReport> getReportById(@PathVariable Long id) {
        Optional<RiskReport> report = reportRepository.findById(id);
        return report.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<RiskReport>> getReportsByType(@PathVariable String reportType) {
        List<RiskReport> reports = reportRepository.findByReportType(reportType);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiskReport> updateReport(@PathVariable Long id, @RequestBody RiskReport report) {
        Optional<RiskReport> existing = reportRepository.findById(id);
        if (existing.isPresent()) {
            report.setReportId(id);
            RiskReport updated = reportRepository.save(report);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
