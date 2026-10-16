-- ============================================================
-- YomiPlay numeric app config (free-tier limits), editable in the admin Settings tab
-- Read by /api/yomiplay/feature-flags (the iOS app) and the pricing / download pages.
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS yomiplay_app_config (
  key        text PRIMARY KEY,
  value      integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE yomiplay_app_config ENABLE ROW LEVEL SECURITY;

-- Public values (shown in the app and on the website): anyone may read, only the service role writes
DROP POLICY IF EXISTS "yomiplay_app_config public read" ON yomiplay_app_config;
CREATE POLICY "yomiplay_app_config public read" ON yomiplay_app_config FOR SELECT USING (true);

-- iOS free tier (app 2.3+): imports per month, and the max length (minutes) of a file to recognize
INSERT INTO yomiplay_app_config (key, value) VALUES
  ('free_import_limit', 3),
  ('free_import_max_minutes', 30)
ON CONFLICT (key) DO NOTHING;
