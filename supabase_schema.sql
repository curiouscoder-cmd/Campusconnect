-- Create profiles table to extend auth.users
create table public.profiles (
    id uuid references auth.users not null primary key,
    email text,
    full_name text,
    role text default 'user', -- 'admin' or 'user'
    created_at timestamp with time zone default timezone ('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

\
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);

create policy "Users can insert their own profile." on profiles for insert
with
    check (auth.uid () = id);

create policy "Users can update own profile." on profiles
for update
    using (auth.uid () = id);

-- Create mentors table
create table public.mentors (
    id uuid default gen_random_uuid () primary key,
    name text not null,
    role text not null, -- e.g., "2nd Year Student"
    college text not null,
    college_id text not null, -- e.g., "nst"
    price text not null, -- e.g., "₹99"
    image text not null,
    bio text,
    expertise text [], -- Array of strings
    created_at timestamp with time zone default timezone ('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone ('utc'::text, now()) not null
);

-- Enable RLS for mentors
alter table public.mentors enable row level security;

-- Policies for mentors
create policy "Mentors are viewable by everyone." on mentors for
select using (true);

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

create policy "Admins can delete mentors." on mentors for delete using (
    exists (
        select 1
        from profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- Create bookings table
create table public.bookings (
    id uuid default gen_random_uuid () primary key,
    user_id uuid references auth.users,
    mentor_id uuid references public.mentors,
    date text not null, -- ISO date string
    start_time text not null,
    end_time text not null,
    session_type text not null, -- "Quick Chat", "Deep Dive"
    price integer not null,
    status text default 'pending', -- pending, confirmed, completed, cancelled
    meeting_link text,
    created_at timestamp with time zone default timezone ('utc'::text, now()) not null
);

-- Enable RLS for bookings
alter table public.bookings enable row level security;

create policy "Users can view their own bookings." on bookings for
select using (auth.uid () = user_id);

create policy "Admins can view all bookings." on bookings for
select using (
        exists (
            select 1
            from profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Users can insert their own bookings." on bookings for insert
with
    check (auth.uid () = user_id);

-- Create a function to handle new user signup
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

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP (Run this part if you haven't already for Storage)
-- Insert a bucket for mentor images
insert into
    storage.buckets (id, name, public)
values ('mentors', 'mentors', true)
on conflict (id) do nothing;

-- Storage Policies
-- Allow public read access
create policy "Public Access" on storage.objects for
select using (bucket_id = 'mentors');

-- Allow admins to upload (checking profile role)
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