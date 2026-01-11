-- =====================================================
-- RLS (Row Level Security) Policies for Campus Connect
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- Users can read and update their own profile
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles FOR
SELECT USING (auth.uid () = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
    USING (auth.uid () = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
WITH
    CHECK (auth.uid () = id);

-- =====================================================
-- 2. MENTORS TABLE
-- Mentors can update their own record (by email)
-- Everyone can read mentor profiles
-- =====================================================

-- Enable RLS
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read mentor profiles (public)
CREATE POLICY "Mentors are publicly readable" ON mentors FOR
SELECT USING (true);

-- Allow mentors to update their own record (matched by email)
CREATE POLICY "Mentors can update own record" ON mentors
FOR UPDATE
    USING (email = auth.email ());

-- =====================================================
-- 3. BOOKINGS TABLE
-- Users can see their own bookings
-- Admin can see all bookings
-- =====================================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookings, admin can read all
-- Replace 'nityaprofessional6402@gmail.com' with your admin email
CREATE POLICY "Users can read own bookings or admin reads all" ON bookings FOR
SELECT USING (
        user_email = auth.email ()
        OR auth.email () = 'nityaprofessional6402@gmail.com'
    );

-- Allow insert when booking
CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT
WITH
    CHECK (true);

-- =====================================================
-- 4. AVAILABILITY TABLE
-- Everyone can read availability (to see open slots)
-- Mentors can update their own availability
-- =====================================================

-- Enable RLS
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read availability
CREATE POLICY "Availability is publicly readable" ON availability FOR
SELECT USING (true);

-- Allow mentors to insert their own availability
CREATE POLICY "Mentors can insert own availability" ON availability FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM mentors
            WHERE
                id = mentor_id
                AND email = auth.email ()
        )
    );

-- Allow mentors to delete their own availability
CREATE POLICY "Mentors can delete own availability" ON availability FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM mentors
        WHERE
            id = mentor_id
            AND email = auth.email ()
    )
);

-- Allow anyone to update availability (for reservations during payment)
CREATE POLICY "Anyone can update availability" ON availability
FOR UPDATE
    USING (true);

-- =====================================================
-- 5. PAYMENTS TABLE
-- Users can see their own payments
-- =====================================================

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow insert for payments
CREATE POLICY "Anyone can insert payments" ON payments FOR INSERT
WITH
    CHECK (true);

-- Allow update for payments
CREATE POLICY "Anyone can update payments" ON payments
FOR UPDATE
    USING (true);