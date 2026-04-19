-- Adds content category + admin-curated tags to yomi uploads.
-- Run once against the Supabase project.

alter table toshiki_tech_yomi_uploads
  add column if not exists category text,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_toshiki_tech_yomi_uploads_category
  on toshiki_tech_yomi_uploads (category)
  where not is_removed;

create index if not exists idx_toshiki_tech_yomi_uploads_tags
  on toshiki_tech_yomi_uploads using gin (tags);

create index if not exists idx_toshiki_tech_yomi_uploads_download_count
  on toshiki_tech_yomi_uploads (download_count desc)
  where not is_removed;

create index if not exists idx_toshiki_tech_yomi_uploads_updated_at
  on toshiki_tech_yomi_uploads (updated_at desc)
  where not is_removed;

create or replace function set_toshiki_tech_yomi_uploads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_toshiki_tech_yomi_uploads_updated_at
  on toshiki_tech_yomi_uploads;
create trigger trg_toshiki_tech_yomi_uploads_updated_at
  before update on toshiki_tech_yomi_uploads
  for each row execute function set_toshiki_tech_yomi_uploads_updated_at();
