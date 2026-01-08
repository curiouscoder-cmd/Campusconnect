-- 1. Create the storage bucket if it doesn't exist
insert into
    storage.buckets (id, name, public)
values ('mentors', 'mentors', true)
on conflict (id) do nothing;

-- 2. Make sure you have a profile and set it to admin
-- This handles cases where the user exists in Auth but not in Profiles yet
insert into
    public.profiles (id, email, full_name, role)
select
    id,
    email,
    raw_user_meta_data ->> 'full_name',
    'admin'
from auth.users
where
    email = 'nityaprofessional6402@gmail.com'
on conflict (id) do
update
set role = 'admin';

-- 3. Reset and Recreate Storage Policies to be sure
drop policy if exists "Admins can upload mentor images" on storage.objects;

create policy "Admins can upload mentor images" on storage.objects for insert
with
    check (
        bucket_id = 'mentors'
        and exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

drop policy if exists "Public Access" on storage.objects;

create policy "Public Access" on storage.objects for
select using (bucket_id = 'mentors');

drop policy if exists "Admins can update mentor images" on storage.objects;

create policy "Admins can update mentor images" on storage.objects
for update
    using (
        bucket_id = 'mentors'
        and exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

drop policy if exists "Admins can delete mentor images" on storage.objects;

create policy "Admins can delete mentor images" on storage.objects for delete using (
    bucket_id = 'mentors'
    and exists (
        select 1
        from profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);