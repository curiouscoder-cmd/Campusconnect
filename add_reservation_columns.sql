-- Add reservation columns to availability table
-- Run this in Supabase SQL Editor

-- Add is_reserved column (if not exists)
ALTER TABLE availability
ADD COLUMN IF NOT EXISTS is_reserved BOOLEAN DEFAULT false;

-- Add reserved_by column (if not exists)
ALTER TABLE availability ADD COLUMN IF NOT EXISTS reserved_by UUID;

-- Add reserved_until column (if not exists)
ALTER TABLE availability
ADD COLUMN IF NOT EXISTS reserved_until TIMESTAMPTZ;

-- Add index for faster reservation queries
CREATE INDEX IF NOT EXISTS idx_availability_reserved ON availability (is_reserved, reserved_until);