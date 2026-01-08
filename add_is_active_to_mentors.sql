-- Add is_active column to mentors table
-- Run this ONCE in Supabase SQL Editor

-- Add the column with default value of true
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;

-- Set all existing mentors to active
UPDATE public.mentors
SET
    is_active = true
WHERE
    is_active IS NULL
    OR is_active = false;

-- Verify
SELECT id, name, is_active FROM public.mentors;