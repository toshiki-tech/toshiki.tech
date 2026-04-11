-- YomiPlay Community Platform - Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Tables

create table toshiki_tech_yomi_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz default now()
);

create table toshiki_tech_yomi_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references toshiki_tech_yomi_profiles(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null,
  visibility text not null default 'public',
  status text not null default 'pending',
  source_platform text,
  source_show text,
  source_episode text,
  yomi_storage_path text not null,
  audio_storage_path text,
  yomi_file_name text not null,
  audio_file_name text,
  language text not null,
  download_count integer default 0,
  share_token text unique default encode(gen_random_bytes(12), 'hex'),
  is_removed boolean default false,
  removed_reason text,
  created_at timestamptz default now()
);

create table toshiki_tech_yomi_reports (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references toshiki_tech_yomi_uploads(id) on delete cascade,
  reporter_email text not null,
  reason text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- 2. Indexes

create index idx_toshiki_tech_yomi_uploads_status on toshiki_tech_yomi_uploads(status) where not is_removed;
create index idx_toshiki_tech_yomi_uploads_user on toshiki_tech_yomi_uploads(user_id);
create index idx_toshiki_tech_yomi_uploads_share on toshiki_tech_yomi_uploads(share_token);

-- 3. Auto-create profile on user signup

create or replace function handle_new_yomi_user()
returns trigger as $$
begin
  insert into toshiki_tech_yomi_profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_yomi
  after insert on auth.users
  for each row execute function handle_new_yomi_user();

-- 4. RLS Policies

alter table toshiki_tech_yomi_profiles enable row level security;
alter table toshiki_tech_yomi_uploads enable row level security;
alter table toshiki_tech_yomi_reports enable row level security;

-- Profiles: anyone can read, users can update their own
create policy "Public profiles are viewable by everyone"
  on toshiki_tech_yomi_profiles for select using (true);

create policy "Users can update own profile"
  on toshiki_tech_yomi_profiles for update using (auth.uid() = id);

-- Uploads: public approved ones visible to all, own uploads always visible
create policy "Public approved uploads visible to everyone"
  on toshiki_tech_yomi_uploads for select
  using (
    (visibility = 'public' and status = 'approved' and not is_removed)
    or user_id = auth.uid()
  );

create policy "Authenticated users can insert uploads"
  on toshiki_tech_yomi_uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can update own uploads"
  on toshiki_tech_yomi_uploads for update
  using (auth.uid() = user_id);

-- Admin override: allow admins to read and update all uploads
create policy "Admins can view all uploads"
  on toshiki_tech_yomi_uploads for select
  using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all uploads"
  on toshiki_tech_yomi_uploads for update
  using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Reports: anyone can insert, only admins can read
create policy "Anyone can submit a report"
  on toshiki_tech_yomi_reports for insert
  with check (true);

create policy "Admins can view reports"
  on toshiki_tech_yomi_reports for select
  using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. Storage bucket (create via Dashboard: Storage > New Bucket > "toshiki-tech-yomi-files", private)
-- Then add these policies in Storage > Policies:

-- Authenticated users can upload to toshiki-tech-yomi-files
-- create policy "Auth users can upload"
--   on storage.objects for insert
--   with check (bucket_id = 'toshiki-tech-yomi-files' and auth.role() = 'authenticated');

-- Authenticated users can read from toshiki-tech-yomi-files (downloads go through API route)
-- create policy "Auth users can read"
--   on storage.objects for select
--   using (bucket_id = 'toshiki-tech-yomi-files' and auth.role() = 'authenticated');
