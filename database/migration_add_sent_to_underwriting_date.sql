-- Migration: Add sent_to_underwriting_date column to underwriting_decisions table
-- This tracks when a customer was sent to underwriting with proper date/time

USE riskguard;

-- Add column if it doesn't exist
ALTER TABLE underwriting_decisions
ADD COLUMN sent_to_underwriting_date DATETIME DEFAULT CURRENT_TIMESTAMP AFTER decision_date;

-- Create index for sorting by date
CREATE INDEX idx_sent_to_underwriting_date ON underwriting_decisions(sent_to_underwriting_date DESC);

PRINT 'Column sent_to_underwriting_date added to underwriting_decisions table successfully!';
