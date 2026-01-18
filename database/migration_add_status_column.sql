-- Migration: Add status column to risk_assessments table
-- This script adds the status column to track whether assessments have been sent to underwriting

USE riskguard;
GO

-- Add status column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'risk_assessments' AND COLUMN_NAME = 'status'
)
BEGIN
    ALTER TABLE risk_assessments
    ADD status NVARCHAR(50) DEFAULT 'PENDING';
    
    PRINT 'Column status added to risk_assessments table successfully!';
END
ELSE
BEGIN
    PRINT 'Column status already exists in risk_assessments table.';
END

GO
