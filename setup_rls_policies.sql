-- =====================================================
-- COMPLETE RLS Policies for Campus Connect
-- Run this in Supabase SQL Editor
-- SECURE: No INSERT policies = Only API (service role) can insert
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE - Users can manage their own profile
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop if exists to avoid conflicts
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE
    USING (auth.uid () = id);

CREATE POLICY "Users can read own profile" ON profiles FOR
SELECT USING (auth.uid () = id);

-- =====================================================
-- 2. MENTORS TABLE - Public read, mentors can update own
-- =====================================================
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentors can update own record" ON mentors;

DROP POLICY IF EXISTS "Mentors are publicly readable" ON mentors;

CREATE POLICY "Mentors can update own record" ON mentors
FOR UPDATE
    USING (
        email = (auth.jwt () ->> 'email')
    );

CREATE POLICY "Mentors are publicly readable" ON mentors FOR
SELECT USING (true);

-- =====================================================
-- 3. BOOKINGS TABLE - SECURE (No INSERT policy)
-- Service role (API) bypasses RLS to insert after payment
-- =====================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read all bookings" ON bookings;

DROP POLICY IF EXISTS "Users view own bookings" ON bookings;

DROP POLICY IF EXISTS "Mentors view their bookings" ON bookings;

DROP POLICY IF EXISTS "Admin view all bookings" ON bookings;

DROP POLICY IF EXISTS "Admin update bookings" ON bookings;

-- Users can view their own bookings
CREATE POLICY "Users view own bookings" ON bookings FOR
SELECT USING (
        user_email = (auth.jwt () ->> 'email')
    );

-- Mentors can view bookings for their sessions
CREATE POLICY "Mentors view their bookings" ON bookings FOR
SELECT USING (
        mentor_id IN (
            SELECT id
            FROM mentors
            WHERE
                email = (auth.jwt () ->> 'email')
        )
    );

-- Admin can view all bookings
CREATE POLICY "Admin view all bookings" ON bookings FOR
SELECT USING (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- Admin can update bookings (e.g., cancel)
CREATE POLICY "Admin update bookings" ON bookings
FOR UPDATE
    USING (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- NO INSERT POLICY HERE = Frontend CANNOT insert
-- API uses service_role key which bypasses RLS

-- =====================================================
-- 4. PAYMENTS TABLE - SECURE (No INSERT/UPDATE policy)
-- Only API (service role) can create/update payments
-- =====================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin view payments" ON payments;

-- Only admin can view payments
CREATE POLICY "Admin view payments" ON payments FOR
SELECT USING (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- NO INSERT/UPDATE POLICY = Frontend CANNOT modify
-- API uses service_role key which bypasses RLS

-- =====================================================
-- 5. AVAILABILITY TABLE - Public read, mentors manage own
-- =====================================================
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view availability" ON availability;

DROP POLICY IF EXISTS "Mentors manage own availability" ON availability;

DROP POLICY IF EXISTS "Admin manage availability" ON availability;

-- Anyone can view available slots
CREATE POLICY "Public view availability" ON availability FOR
SELECT USING (true);

-- Mentors can manage their own slots
CREATE POLICY "Mentors manage own availability" ON availability FOR ALL USING (
    mentor_id IN (
        SELECT id
        FROM mentors
        WHERE
            email = (auth.jwt () ->> 'email')
    )
)
WITH
    CHECK (
        mentor_id IN (
            SELECT id
            FROM mentors
            WHERE
                email = (auth.jwt () ->> 'email')
        )
    );

-- Admin can manage all availability
CREATE POLICY "Admin manage availability" ON availability FOR ALL USING (
    (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
)
WITH
    CHECK (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- =====================================================
-- 6. NSAT_REFERRALS TABLE - Anyone can submit
-- =====================================================
ALTER TABLE nsat_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert nsat_referrals" ON nsat_referrals;

DROP POLICY IF EXISTS "Admin view nsat_referrals" ON nsat_referrals;

DROP POLICY IF EXISTS "Admin update nsat_referrals" ON nsat_referrals;

-- Anyone can submit a referral (free session request)
CREATE POLICY "Anyone can insert nsat_referrals" ON nsat_referrals FOR INSERT
WITH
    CHECK (true);

-- Only admin can view all referrals
CREATE POLICY "Admin view nsat_referrals" ON nsat_referrals FOR
SELECT USING (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- Only admin can update (approve/reject)
CREATE POLICY "Admin update nsat_referrals" ON nsat_referrals
FOR UPDATE
    USING (
        (auth.jwt () ->> 'email') = 'nityaprofessional6402@gmail.com'
    );

-- =====================================================
-- VERIFY: List all policies
-- =====================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE
    schemaname = 'public'
ORDER BY tablename, policyname;