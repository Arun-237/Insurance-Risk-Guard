package com.riskguard.audit.controller;

import com.riskguard.audit.entity.AuditLog;
import com.riskguard.audit.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    @GetMapping("/entity/{entityType}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByEntity(@PathVariable String entityType) {
        List<AuditLog> logs = auditLogRepository.findAll().stream()
                .filter(log -> log.getEntityType().equalsIgnoreCase(entityType))
                .toList();
        return ResponseEntity.ok(logs);
    }
}
