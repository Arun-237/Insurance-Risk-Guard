package com.riskguard.premium.controller;

import com.riskguard.premium.entity.PremiumPayment;
import com.riskguard.premium.repository.PremiumPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/premium-payments")
public class PremiumPaymentController {

    @Autowired
    private PremiumPaymentRepository paymentRepository;

    @PostMapping
    public ResponseEntity<PremiumPayment> createPayment(@RequestBody PremiumPayment payment) {
        PremiumPayment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<PremiumPayment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PremiumPayment> getPaymentById(@PathVariable Long id) {
        Optional<PremiumPayment> payment = paymentRepository.findById(id);
        return payment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/policy/{policyId}")
    public ResponseEntity<List<PremiumPayment>> getPaymentsByPolicy(@PathVariable Long policyId) {
        List<PremiumPayment> payments = paymentRepository.findByPolicyId(policyId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PremiumPayment>> getPaymentsByStatus(@PathVariable String status) {
        PremiumPayment.PaymentStatus paymentStatus = PremiumPayment.PaymentStatus.valueOf(status.toUpperCase());
        List<PremiumPayment> payments = paymentRepository.findByStatus(paymentStatus);
        return ResponseEntity.ok(payments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PremiumPayment> updatePayment(@PathVariable Long id, @RequestBody PremiumPayment payment) {
        Optional<PremiumPayment> existing = paymentRepository.findById(id);
        if (existing.isPresent()) {
            payment.setPaymentId(id);
            PremiumPayment updated = paymentRepository.save(payment);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
