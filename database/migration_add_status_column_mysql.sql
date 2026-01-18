-- Migration: Add status column to risk_assessments table (MySQL)
-- This script adds the status column to track whether assessments have been sent to underwriting

USE riskguard;

-- Add status column if it doesn't exist
ALTER TABLE risk_assessments
ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING' AFTER flagged_for_manual_review;

PRINT 'Column status added to risk_assessments table successfully!';
