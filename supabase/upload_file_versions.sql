-- Let an uploader publish a new version of the file behind a community upload.
-- Run this in the Supabase SQL Editor.

-- 1. Versioning of the live file. file_updated_at stays null until the first
--    replacement, so the app can tell "never updated" from "updated".
alter table toshiki_tech_yomi_uploads
  add column if not exists file_version integer not null default 1,
  add column if not exists file_updated_at timestamptz;

-- 2. A new version that still waits for review. The live file keeps being served
--    until an admin approves it; pending_submitted_at marks that one exists
--    (either path may be null when only the other file is being replaced).
alter table toshiki_tech_yomi_uploads
  add column if not exists pending_storage_path text,
  add column if not exists pending_file_name text,
  add column if not exists pending_audio_storage_path text,
  add column if not exists pending_audio_file_name text,
  add column if not exists pending_note text,
  add column if not exists pending_submitted_at timestamptz,
  add column if not exists file_update_rejected_at timestamptz;

create index if not exists idx_toshiki_tech_yomi_uploads_pending_file
  on toshiki_tech_yomi_uploads (pending_submitted_at)
  where pending_submitted_at is not null;

-- 3. Only admins and the server (service role) may touch the file, review and
--    moderation columns. Uploaders update their own rows straight from the
--    browser to delete them, so without this guard they could point an approved
--    upload at a different file and skip review entirely.
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

drop trigger if exists toshiki_tech_yomi_uploads_guard on toshiki_tech_yomi_uploads;
create trigger toshiki_tech_yomi_uploads_guard
  before update on toshiki_tech_yomi_uploads
  for each row execute function toshiki_tech_yomi_uploads_guard();
