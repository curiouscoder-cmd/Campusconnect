-- Sync existing auth.users to profiles table

-- Insert missing users into profiles
INSERT INTO
    public.profiles (id, email, full_name, role)
SELECT au.id, au.email, COALESCE(
        au.raw_user_meta_data ->> 'full_name', 'User'
    ) as full_name, 'user' as role
FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
WHERE
    p.id IS NULL
ON CONFLICT (id) DO NOTHING;

SELECT COUNT(*) as auth_users_count FROM auth.users;

SELECT COUNT(*) as profiles_count FROM public.profiles;

-- These two counts should match after running this script