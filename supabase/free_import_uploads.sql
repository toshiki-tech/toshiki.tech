-- Let an admin mark a community upload as importable without Pro, so new users
-- can try real material before paying. Run this in the Supabase SQL Editor.

alter table toshiki_tech_yomi_uploads
  add column if not exists is_free_import boolean not null default false;

-- The app asks for these when building its "free to try" shelf.
create index if not exists idx_toshiki_tech_yomi_uploads_free_import
  on toshiki_tech_yomi_uploads (is_free_import)
  where is_free_import;
