-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles (Admins)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text, -- Added name field
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Posts (Feed Content)
create type post_type as enum ('short_form', 'essay', 'long_form');

create table posts (
  id uuid default uuid_generate_v4() primary key,
  slug text unique,
  title text,
  content text, -- Rich text or simple text
  type post_type default 'short_form',
  media_url text, -- For TikTok/Video links
  published_at timestamp with time zone,
  allow_comments boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for posts
alter table posts enable row level security;

create policy "Posts are viewable by everyone."
  on posts for select
  using ( true );

create policy "Admins can insert posts."
  on posts for insert
  with check ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

create policy "Admins can update posts."
  on posts for update
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

create policy "Admins can delete posts."
  on posts for delete
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- About Page (Single Row)
create table about_page (
  id int primary key default 1,
  bio text,
  image_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint single_row check (id = 1)
);

-- Enable RLS for about_page
alter table about_page enable row level security;

create policy "About page is viewable by everyone."
  on about_page for select
  using ( true );

create policy "Admins can update about page."
  on about_page for update
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

create policy "Admins can insert about page."
  on about_page for insert
  with check ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Reading List
create type reading_status as enum ('Reading', 'Finished');

create table reading_list (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  author text,
  link text,
  status reading_status default 'Reading',
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for reading_list
alter table reading_list enable row level security;

create policy "Reading list is viewable by everyone."
  on reading_list for select
  using ( true );

create policy "Admins can manage reading list."
  on reading_list for all
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Events
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date timestamp with time zone not null,
  location text,
  description text,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for events
alter table events enable row level security;

create policy "Events are viewable by everyone."
  on events for select
  using ( true );

create policy "Admins can manage events."
  on events for all
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Subscribers
create table subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for subscribers
alter table subscribers enable row level security;

-- Only admins can view subscribers
create policy "Admins can view subscribers."
  on subscribers for select
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Anyone can subscribe (insert)
create policy "Anyone can subscribe."
  on subscribers for insert
  with check ( true );

-- Comments
create table comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_name text not null,
  content text not null,
  deleted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for comments
alter table comments enable row level security;

create policy "Comments are viewable by everyone (unless deleted)."
  on comments for select
  using ( deleted = false );

create policy "Admins can view all comments."
  on comments for select
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

create policy "Anyone can comment."
  on comments for insert
  with check ( true );

create policy "Admins can update (soft delete) comments."
  on comments for update
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, is_admin)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', -- Extract name from metadata
    false
  );
  return new;
end;
$$ language plpgsql security definer;

  for each row execute procedure public.handle_new_user();

-- Storage Policies (Run these in Supabase SQL Editor)
-- Ensure the bucket exists
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

-- Enable RLS on objects
alter table storage.objects enable row level security;

-- Allow public read access to post-media
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'post-media' );

-- Allow admins to upload to post-media
create policy "Admin Upload"
on storage.objects for insert
with check (
  bucket_id = 'post-media'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
    and is_admin = true
  )
);

-- Migration: Add name column to existing profiles (Run in SQL Editor)
alter table public.profiles add column if not exists name text;
