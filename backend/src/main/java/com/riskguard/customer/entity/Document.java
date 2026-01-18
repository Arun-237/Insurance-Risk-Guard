package com.riskguard.customer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String documentType;
    private String documentName;
    private String filePath;
    private Long fileSize;
    private Boolean verified;
    private LocalDate uploadedAt;

    public enum DocumentType {
        ID_PROOF, MEDICAL_REPORT, DRIVING_LICENSE, BANK_STATEMENT
    }
}
