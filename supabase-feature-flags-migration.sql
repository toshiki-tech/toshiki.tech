-- Stores runtime-toggleable feature flags for the YomiPlay community / app.
-- Replaces the hard-coded SHOW_POINTS_FEATURE / ALLOW_PRO_REDEMPTION /
-- SHOW_COMMUNITY_DOWNLOAD constants so admins can flip them from the admin
-- panel without a redeploy.

create table if not exists toshiki_tech_yomi_feature_flags (
  key text primary key,
  enabled boolean not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references toshiki_tech_yomi_profiles(id) on delete set null
);

-- Seed all known flags as enabled. Existing rows are left untouched so a
-- re-run of this migration does not overwrite admin choices.
insert into toshiki_tech_yomi_feature_flags (key, enabled) values
  ('points_feature', true),
  ('pro_redemption', true),
  ('community_download', true)
on conflict (key) do nothing;

-- Touch updated_at whenever a row changes.
create or replace function set_toshiki_tech_yomi_feature_flags_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_toshiki_tech_yomi_feature_flags_updated_at
  on toshiki_tech_yomi_feature_flags;
create trigger trg_toshiki_tech_yomi_feature_flags_updated_at
  before update on toshiki_tech_yomi_feature_flags
  for each row execute function set_toshiki_tech_yomi_feature_flags_updated_at();

-- RLS: anyone (including anon) can read; only admins can write.
alter table toshiki_tech_yomi_feature_flags enable row level security;

drop policy if exists "Feature flags readable by all"
  on toshiki_tech_yomi_feature_flags;
create policy "Feature flags readable by all"
  on toshiki_tech_yomi_feature_flags for select
  using (true);

drop policy if exists "Admins can update feature flags"
  on toshiki_tech_yomi_feature_flags;
create policy "Admins can update feature flags"
  on toshiki_tech_yomi_feature_flags for update
  using (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Admins can insert feature flags"
  on toshiki_tech_yomi_feature_flags;
create policy "Admins can insert feature flags"
  on toshiki_tech_yomi_feature_flags for insert
  with check (
    exists (
      select 1 from toshiki_tech_yomi_profiles
      where id = auth.uid() and role = 'admin'
    )
  );
