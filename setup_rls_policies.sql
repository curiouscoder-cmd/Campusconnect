-- =====================================================
-- MINIMAL RLS Policies for Campus Connect
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE - Users can update their own profile
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
    USING (auth.uid () = id);

CREATE POLICY "Users can read own profile" ON profiles FOR
SELECT USING (auth.uid () = id);

-- =====================================================
-- 2. MENTORS TABLE - Mentors can update their own record
-- =====================================================
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can update own record" ON mentors
FOR UPDATE
    USING (email = auth.email ());

CREATE POLICY "Mentors are publicly readable" ON mentors FOR
SELECT USING (true);

-- =====================================================
-- 3. BOOKINGS TABLE - Admin can see all bookings
-- =====================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read all bookings" ON bookings FOR
SELECT USING (
        auth.email () = 'nityaprofessional6402@gmail.com'
    );

CREATE POLICY "Anyone can insert bookings" ON bookings FOR INSERT
WITH
    CHECK (true);