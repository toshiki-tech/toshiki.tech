-- Add source_url to community uploads
-- Run this in Supabase SQL Editor

ALTER TABLE toshiki_tech_yomi_uploads
  ADD COLUMN IF NOT EXISTS source_url text;
