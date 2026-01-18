package com.riskguard.premium.service;

import org.springframework.stereotype.Service;

@Service
public class PremiumService {
    // Base rate as percentage of coverage per year
    private static final double BASE_RATE = 0.005; // 0.5%

    public double computePremium(double coverageAmount, double riskScore) {
        double riskFactor;
        if (riskScore <= 25) riskFactor = 0.8;
        else if (riskScore <= 50) riskFactor = 1.0;
        else if (riskScore <= 75) riskFactor = 1.3;
        else riskFactor = 1.7;
        // premium = baseRate * coverage * riskFactor
        return Math.round(BASE_RATE * coverageAmount * riskFactor * 100.0) / 100.0;
    }
}
