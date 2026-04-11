-- YomiPlay Points System Schema
-- Run this in the Supabase SQL Editor

-- 1. Add points and pro status to profiles
alter table toshiki_tech_yomi_profiles add column if not exists points integer default 0;
alter table toshiki_tech_yomi_profiles add column if not exists is_pro boolean default false;

-- 2. Points configuration (admin-managed)
create table toshiki_tech_yomi_points_config (
  key text primary key,
  value integer not null,
  label text not null,
  description text
);

-- Default config values
insert into toshiki_tech_yomi_points_config (key, value, label, description) values
  ('upload_yomi', 10, 'Upload .yomi', 'Points earned when a .yomi upload is approved'),
  ('upload_zip', 20, 'Upload ZIP', 'Points earned when a ZIP upload is approved'),
  ('download_received', 1, 'Download received', 'Points earned when your content is downloaded'),
  ('daily_login', 2, 'Daily login', 'Points earned for daily login'),
  ('pro_threshold', 500, 'Pro threshold', 'Points required to apply for Pro membership');

-- RLS for points config
alter table toshiki_tech_yomi_points_config enable row level security;

create policy "Anyone can read points config"
  on toshiki_tech_yomi_points_config for select using (true);

create policy "Admins can update points config"
  on toshiki_tech_yomi_points_config for update using (
    exists (select 1 from toshiki_tech_yomi_profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Points log (transaction history)
create table toshiki_tech_yomi_points_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references toshiki_tech_yomi_profiles(id) on delete cascade,
  action text not null,
  points integer not null,
  description text,
  created_at timestamptz default now()
);

create index idx_points_log_user on toshiki_tech_yomi_points_log(user_id);

alter table toshiki_tech_yomi_points_log enable row level security;

create policy "Users can view own points log"
  on toshiki_tech_yomi_points_log for select using (auth.uid() = user_id);

create policy "System can insert points log"
  on toshiki_tech_yomi_points_log for insert with check (auth.uid() = user_id);

create policy "Admins can view all points log"
  on toshiki_tech_yomi_points_log for select using (
    exists (select 1 from toshiki_tech_yomi_profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Pro membership requests
create table toshiki_tech_yomi_pro_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references toshiki_tech_yomi_profiles(id) on delete cascade,
  points_at_request integer not null,
  status text not null default 'pending',
  admin_note text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create index idx_pro_requests_user on toshiki_tech_yomi_pro_requests(user_id);
create index idx_pro_requests_status on toshiki_tech_yomi_pro_requests(status);

alter table toshiki_tech_yomi_pro_requests enable row level security;

create policy "Users can view own pro requests"
  on toshiki_tech_yomi_pro_requests for select using (auth.uid() = user_id);

create policy "Users can insert own pro requests"
  on toshiki_tech_yomi_pro_requests for insert with check (auth.uid() = user_id);

create policy "Admins can view all pro requests"
  on toshiki_tech_yomi_pro_requests for select using (
    exists (select 1 from toshiki_tech_yomi_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update pro requests"
  on toshiki_tech_yomi_pro_requests for update using (
    exists (select 1 from toshiki_tech_yomi_profiles where id = auth.uid() and role = 'admin')
  );
