-- RiskGuard SQL Server Database Schema
-- Run this script on SQL Server to create the database and tables

-- Create Database
CREATE DATABASE riskguard;
GO

USE riskguard;
GO

-- Create Customers Table
CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    date_of_birth DATE,
    contact_info NVARCHAR(255),
    email NVARCHAR(255),
    phone NVARCHAR(20),
    insurance_type NVARCHAR(50),
    address NVARCHAR(500),
    city NVARCHAR(100),
    state NVARCHAR(100),
    zip_code NVARCHAR(20),
    document_verified BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create Documents Table
CREATE TABLE documents (
    document_id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL,
    document_type NVARCHAR(100),
    document_name NVARCHAR(255),
    file_path NVARCHAR(500),
    file_size BIGINT,
    verified BIT DEFAULT 0,
    uploaded_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create Risk Assessments Table
CREATE TABLE risk_assessments (
    assessment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL,
    risk_score DECIMAL(5,2),
    risk_level NVARCHAR(50),
    rules_applied NVARCHAR(MAX),
    explanation NVARCHAR(MAX),
    result NVARCHAR(50),
    flagged_for_manual_review BIT DEFAULT 0,
    status NVARCHAR(50) DEFAULT 'PENDING',
    assessment_date DATETIME2 DEFAULT GETDATE(),
    updated_date DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create Underwriting Decisions Table
CREATE TABLE underwriting_decisions (
    decision_id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL,
    assessment_id BIGINT,
    status NVARCHAR(50),
    reason NVARCHAR(MAX),
    underwriter_notes NVARCHAR(MAX),
    decision_date DATETIME2 DEFAULT GETDATE(),
    sent_to_underwriting_date DATETIME2 DEFAULT GETDATE(),
    decided_by NVARCHAR(255),
    approval_date DATETIME2,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (assessment_id) REFERENCES risk_assessments(assessment_id)
);

-- Create Policies Table
CREATE TABLE policies (
    policy_id BIGINT PRIMARY KEY IDENTITY(1,1),
    customer_id BIGINT NOT NULL,
    decision_id BIGINT,
    policy_number NVARCHAR(100) UNIQUE,
    coverage_amount DECIMAL(15,2),
    premium_amount DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status NVARCHAR(50),
    policy_document NVARCHAR(500),
    issue_date DATETIME2 DEFAULT GETDATE(),
    last_modified_date DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (decision_id) REFERENCES underwriting_decisions(decision_id)
);

-- Create Premium Payments Table
CREATE TABLE premium_payments (
    payment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    policy_id BIGINT NOT NULL,
    amount DECIMAL(15,2),
    status NVARCHAR(50),
    payment_method NVARCHAR(100),
    transaction_id NVARCHAR(100),
    payment_date DATE,
    due_date DATE,
    processed_date DATETIME2,
    remarks NVARCHAR(MAX),
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id)
);

-- Create Risk Reports Table
CREATE TABLE risk_reports (
    report_id BIGINT PRIMARY KEY IDENTITY(1,1),
    report_name NVARCHAR(255),
    report_type NVARCHAR(100),
    average_risk_score DECIMAL(5,2),
    approval_rate DECIMAL(5,2),
    total_assessments BIGINT,
    approved_count BIGINT,
    declined_count BIGINT,
    review_required_count BIGINT,
    generated_date DATETIME2 DEFAULT GETDATE(),
    generated_by NVARCHAR(255),
    report_content NVARCHAR(MAX)
);

-- Create Indexes
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_customer_insurance_type ON customers(insurance_type);
CREATE INDEX idx_assessment_customer ON risk_assessments(customer_id);
CREATE INDEX idx_assessment_result ON risk_assessments(result);
CREATE INDEX idx_policy_customer ON policies(customer_id);
CREATE INDEX idx_policy_number ON policies(policy_number);
CREATE INDEX idx_payment_policy ON premium_payments(policy_id);

PRINT 'Database and tables created successfully!';
