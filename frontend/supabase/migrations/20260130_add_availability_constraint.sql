-- Add unique constraint to availability table to prevent duplicate slots
-- This matches the logic we wanted to use with upsert

-- First, remove any existing duplicates (keeping the most recently updated or created one, or arbitrary)
-- Since we are adding a constraint, we must ensure data is clean first.
DELETE FROM availability a USING availability b
WHERE
    a.id > b.id
    AND a.mentor_id = b.mentor_id
    AND a.date = b.date
    AND a.start_time = b.start_time;

-- Now add the unique constraint
ALTER TABLE availability
ADD CONSTRAINT availability_mentor_id_date_start_time_key UNIQUE (mentor_id, date, start_time);