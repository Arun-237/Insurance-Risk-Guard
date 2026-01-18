package com.riskguard.analytics.repository;

import com.riskguard.analytics.entity.RiskReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskReportRepository extends JpaRepository<RiskReport, Long> {
    List<RiskReport> findByReportType(String reportType);
}
