-- Community support for .yomibook (memorization deck) uploads.
-- Run this in the Supabase SQL Editor.

-- 1. Distinguish subtitle uploads from memorization-deck uploads.
--    Existing rows are all subtitles, hence the 'yomi' default.
alter table toshiki_tech_yomi_uploads
  add column if not exists file_kind text not null default 'yomi';

create index if not exists idx_toshiki_tech_yomi_uploads_file_kind
  on toshiki_tech_yomi_uploads (file_kind);

-- 2. Points awarded when a .yomibook upload is approved.
insert into toshiki_tech_yomi_points_config (key, value, label, description)
values ('upload_yomibook', 20, 'Upload .yomibook', 'Points earned when a .yomibook upload is approved')
on conflict (key) do nothing;
