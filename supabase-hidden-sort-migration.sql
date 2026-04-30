-- Adds admin-controlled visibility (temporary hide) and custom sort order to
-- yomi uploads. Run once against the Supabase project.

alter table toshiki_tech_yomi_uploads
  add column if not exists is_hidden boolean not null default false,
  add column if not exists sort_order integer not null default 0;

-- Index supporting the public list's combined ordering (sort_order desc,
-- created_at desc) restricted to rows that can actually appear publicly.
create index if not exists idx_toshiki_tech_yomi_uploads_visible
  on toshiki_tech_yomi_uploads (sort_order desc, created_at desc)
  where status = 'approved'
    and visibility = 'public'
    and not is_removed
    and not is_hidden;

-- Tighten the public-read RLS policy so hidden rows never leak through direct
-- queries. Owners still see their own rows (so they can manage them in
-- "My Uploads" with a hidden badge).
drop policy if exists "Public approved uploads visible to everyone"
  on toshiki_tech_yomi_uploads;

create policy "Public approved uploads visible to everyone"
  on toshiki_tech_yomi_uploads for select
  using (
    (visibility = 'public' and status = 'approved' and not is_removed and not is_hidden)
    or user_id = auth.uid()
  );
