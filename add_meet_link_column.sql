-- Add meet_link column to mentors table
-- Run this in Supabase SQL Editor

ALTER TABLE mentors ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Example: Update a mentor's meet link
-- UPDATE mentors SET meet_link = 'https://meet.google.com/xxx-xxxx-xxx' WHERE id = 'mentor-id';

-- Verify the column was added
SELECT id, name, meet_link FROM mentors;