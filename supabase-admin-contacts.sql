-- Allow admins to read and update contact submissions
-- Run this in Supabase SQL Editor

-- Check if RLS is enabled on contacts table (optional, skip if already enabled)
alter table toshiki_tech_contacts enable row level security;

-- Admins can read all contact messages
create policy "Admins can view all contacts"
  on toshiki_tech_contacts for select using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update contact status
create policy "Admins can update contacts"
  on toshiki_tech_contacts for update using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Anyone can insert (for the contact form) — add this if not already present
create policy "Anyone can submit contact form"
  on toshiki_tech_contacts for insert with check (true);
