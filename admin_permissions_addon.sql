
create table if not exists public.profiles (
    id uuid references auth.users not null primary key,
    email text,
    full_name text,
    role text default 'user',
    created_at timestamp with time zone default timezone ('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;

drop policy if exists "Users can insert their own profile." on profiles;

drop policy if exists "Users can update own profile." on profiles;

create policy "Public profiles are viewable by everyone." on profiles for
select using (true);

create policy "Users can insert their own profile." on profiles for insert
with
    check (auth.uid () = id);

create policy "Users can update own profile." on profiles
for update
    using (auth.uid () = id);

-- 2. Enable RLS on MENTORS table (if not already enabled)
alter table public.mentors enable row level security;

-- Drop existing mentor policies if any (to avoid conflicts)
drop policy if exists "Mentors are viewable by everyone." on mentors;

drop policy if exists "Admins can insert mentors." on mentors;

drop policy if exists "Admins can update mentors." on mentors;

drop policy if exists "Admins can delete mentors." on mentors;

-- Create policies for mentors
-- Everyone can view mentors (public)
create policy "Mentors are viewable by everyone." on mentors for
select using (true);

-- Only admins can insert new mentors
create policy "Admins can insert mentors." on mentors for insert
with
    check (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

-- Only admins can update mentors
create policy "Admins can update mentors." on mentors
for update
    using (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

-- Only admins can delete mentors
create policy "Admins can delete mentors." on mentors for delete using (
    exists (
        select 1
        from profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 3. STORAGE BUCKET for mentor images
insert into
    storage.buckets (id, name, public)
values ('mentors', 'mentors', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;

drop policy if exists "Admins can upload mentor images" on storage.objects;

drop policy if exists "Admins can update mentor images" on storage.objects;

drop policy if exists "Admins can delete mentor images" on storage.objects;

-- Public can view images
create policy "Public Access" on storage.objects for
select using (bucket_id = 'mentors');

-- Admins can upload images
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

-- Admins can update images
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

-- Admins can delete images
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

-- 4. SET YOUR USER AS ADMIN
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

-- 5. TRIGGER for new user signups (creates profile automatically)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
