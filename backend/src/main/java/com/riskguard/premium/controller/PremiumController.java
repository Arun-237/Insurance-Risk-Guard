package com.riskguard.premium.controller;

import com.riskguard.premium.service.PremiumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/premium")
public class PremiumController {

    @Autowired
    private PremiumService premiumService;

    @GetMapping("/calculate")
    public ResponseEntity<Double> calculatePremium(
            @RequestParam("coverageAmount") double coverageAmount,
            @RequestParam("riskScore") double riskScore) {
        double premium = premiumService.computePremium(coverageAmount, riskScore);
        return ResponseEntity.ok(premium);
    }
}
