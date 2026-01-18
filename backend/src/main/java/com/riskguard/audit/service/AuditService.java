package com.riskguard.audit.service;

import com.riskguard.audit.entity.AuditLog;
import com.riskguard.audit.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String action, String entityType, Long entityId, String actor, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .actor(actor)
                .timestamp(LocalDateTime.now())
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}
