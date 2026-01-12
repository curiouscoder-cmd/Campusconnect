-- NSAT Referrals Table
-- Run this in Supabase SQL Editor

CREATE TABLE nsat_referrals (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    nsat_registration_id TEXT,
    screenshot_url TEXT,
    preferred_date DATE,
    preferred_time TEXT,
    preferred_mentor_id UUID REFERENCES mentors (id),
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'approved',
            'rejected',
            'booked'
        )
    ),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    booked_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE nsat_referrals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for form submission)
CREATE POLICY "Anyone can submit NSAT referral" ON nsat_referrals FOR INSERT
WITH
    CHECK (true);

-- Only admin can read all referrals
CREATE POLICY "Admin can read all referrals" ON nsat_referrals FOR
SELECT USING (
        auth.email () = 'nityaprofessional6402@gmail.com'
    );

-- Only admin can update referrals
CREATE POLICY "Admin can update referrals" ON nsat_referrals
FOR UPDATE
    USING (
        auth.email () = 'nityaprofessional6402@gmail.com'
    );