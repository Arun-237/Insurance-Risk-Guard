-- Sample Data for RiskGuard Database

USE riskguard;
GO

-- Insert Sample Customers
INSERT INTO customers (name, date_of_birth, email, phone, insurance_type, address, city, state, zip_code, document_verified) VALUES
('John Doe', '1985-05-15', 'john.doe@email.com', '555-0101', 'HEALTH', '123 Main St', 'New York', 'NY', '10001', 1),
('Jane Smith', '1990-03-22', 'jane.smith@email.com', '555-0102', 'LIFE', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 1),
('Bob Johnson', '1978-07-10', 'bob.johnson@email.com', '555-0103', 'MOTOR', '789 Pine Rd', 'Chicago', 'IL', '60601', 0),
('Alice Williams', '1992-11-30', 'alice.w@email.com', '555-0104', 'HEALTH', '321 Elm St', 'Houston', 'TX', '77001', 1),
('Charlie Brown', '1988-02-14', 'charlie.b@email.com', '555-0105', 'LIFE', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 1);

-- Insert Sample Risk Assessments
INSERT INTO risk_assessments (customer_id, risk_score, risk_level, rules_applied, result, flagged_for_manual_review) VALUES
(1, 45.5, 'LOW', 'Age: OK, Health: OK, Claims: None', 'APPROVED', 0),
(2, 65.3, 'MEDIUM', 'Age: OK, Health: Minor Issue', 'REVIEW_REQUIRED', 1),
(3, 78.9, 'HIGH', 'Age: OK, Driving Record: Poor', 'REVIEW_REQUIRED', 1),
(4, 35.2, 'LOW', 'Age: OK, Health: OK, Claims: None', 'APPROVED', 0),
(5, 88.7, 'CRITICAL', 'Age: High, Health: Serious Issues', 'DECLINED', 1);

-- Insert Sample Underwriting Decisions
INSERT INTO underwriting_decisions (customer_id, assessment_id, status, reason, decided_by, approval_date) VALUES
(1, 1, 'APPROVED', 'Low risk profile', 'John Underwriter', GETDATE()),
(2, 2, 'PENDING', 'Awaiting additional documents', 'Jane Reviewer', NULL),
(3, 3, 'ON_HOLD', 'Requires clarification on driving history', 'Bob Reviewer', NULL),
(4, 4, 'APPROVED', 'Excellent health record', 'John Underwriter', GETDATE()),
(5, 5, 'DECLINED', 'Pre-existing conditions exclude coverage', 'Jane Reviewer', GETDATE());

-- Insert Sample Policies
INSERT INTO policies (customer_id, decision_id, policy_number, coverage_amount, premium_amount, start_date, end_date, status) VALUES
(1, 1, 'POL-001-2024', 500000.00, 2500.00, '2024-01-01', '2025-01-01', 'ACTIVE'),
(2, 2, 'POL-002-2024', 750000.00, 3500.00, '2024-01-15', '2025-01-15', 'INACTIVE'),
(4, 4, 'POL-004-2024', 1000000.00, 4200.00, '2024-02-01', '2025-02-01', 'ACTIVE');

-- Insert Sample Premium Payments
INSERT INTO premium_payments (policy_id, amount, status, payment_method, transaction_id, payment_date, due_date) VALUES
(1, 2500.00, 'PAID', 'Credit Card', 'TXN-001', '2024-01-05', '2024-01-10'),
(2, 3500.00, 'UNPAID', 'Bank Transfer', NULL, NULL, '2024-01-20'),
(3, 4200.00, 'PAID', 'Credit Card', 'TXN-003', '2024-02-05', '2024-02-10');

PRINT 'Sample data inserted successfully!';
