-- ============================================================
-- YomiPlay APK release tracking
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Release registry — one row per published version
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yomiplay_apk_releases (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_code              integer UNIQUE NOT NULL,
  version_name              text NOT NULL,
  r2_path                   text NOT NULL,          -- e.g. apk/yomiplay-1.0.0.apk
  apk_sha256                text NOT NULL DEFAULT '',
  file_size                 bigint,                 -- bytes
  release_notes             text NOT NULL DEFAULT '',
  min_supported_version_code integer NOT NULL DEFAULT 1,
  force_update              boolean NOT NULL DEFAULT false,
  is_active                 boolean NOT NULL DEFAULT true,  -- false = yanked
  created_at                timestamptz DEFAULT now()
);

ALTER TABLE yomiplay_apk_releases ENABLE ROW LEVEL SECURITY;
-- Public read (App needs to check for updates without auth)
CREATE POLICY "public read" ON yomiplay_apk_releases
  FOR SELECT USING (true);
-- Writes are service-role only


-- 2. Download log — one row per download event
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yomiplay_apk_downloads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_code integer NOT NULL,
  version_name text NOT NULL,
  user_agent   text,
  downloaded_at timestamptz DEFAULT now()
);

ALTER TABLE yomiplay_apk_downloads ENABLE ROW LEVEL SECURITY;
-- No public read — admin only via service role


-- 3. Index for fast stats queries
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_apk_downloads_version
  ON yomiplay_apk_downloads (version_code, downloaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_apk_downloads_date
  ON yomiplay_apk_downloads (downloaded_at DESC);
