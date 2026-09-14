-- Translated titles and descriptions for community uploads.
-- Run this in the Supabase SQL Editor, after upload_file_versions.sql.

-- 1. Per-locale overrides of the uploader's own title/description, curated by
--    admins: {"en": {"title": "...", "description": "..."}, "zh": {...}, ...}.
--    A missing locale or field falls back to the original text.
alter table toshiki_tech_yomi_uploads
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- 2. One column holding the title in every language, so a search in any of the
--    four site languages finds the upload.
alter table toshiki_tech_yomi_uploads
  add column if not exists search_title text generated always as (
    coalesce(title, '')
    || ' ' || coalesce(translations -> 'en' ->> 'title', '')
    || ' ' || coalesce(translations -> 'zh' ->> 'title', '')
    || ' ' || coalesce(translations -> 'ja' ->> 'title', '')
    || ' ' || coalesce(translations -> 'zh-tw' ->> 'title', '')
  ) stored;

-- 3. Translations are admin-curated: add them to the columns the guard keeps
--    uploaders from rewriting directly.
create or replace function toshiki_tech_yomi_uploads_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
begin
  -- Service role, or no request JWT at all (SQL editor, migrations).
  if jwt_role not in ('anon', 'authenticated') then
    return new;
  end if;

  if exists (
    select 1 from toshiki_tech_yomi_profiles
    where id = auth.uid() and role = 'admin'
  ) then
    return new;
  end if;

  if new.user_id is distinct from old.user_id
    or new.status is distinct from old.status
    or new.file_kind is distinct from old.file_kind
    or new.yomi_storage_path is distinct from old.yomi_storage_path
    or new.yomi_file_name is distinct from old.yomi_file_name
    or new.audio_storage_path is distinct from old.audio_storage_path
    or new.audio_file_name is distinct from old.audio_file_name
    or new.file_version is distinct from old.file_version
    or new.file_updated_at is distinct from old.file_updated_at
    or new.pending_storage_path is distinct from old.pending_storage_path
    or new.pending_file_name is distinct from old.pending_file_name
    or new.pending_audio_storage_path is distinct from old.pending_audio_storage_path
    or new.pending_audio_file_name is distinct from old.pending_audio_file_name
    or new.pending_note is distinct from old.pending_note
    or new.pending_submitted_at is distinct from old.pending_submitted_at
    or new.file_update_rejected_at is distinct from old.file_update_rejected_at
    or new.translations is distinct from old.translations
    or new.is_hidden is distinct from old.is_hidden
    or new.is_free_import is distinct from old.is_free_import
    or new.sort_order is distinct from old.sort_order
    -- Deleting is allowed; restoring something an admin removed is not.
    or (old.is_removed and not new.is_removed)
  then
    raise exception 'Not allowed to change these fields of an upload'
      using errcode = '42501';
  end if;

  return new;
end;
$$;
