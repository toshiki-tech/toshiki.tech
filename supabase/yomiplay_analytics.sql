-- ============================================================
-- YomiPlay anonymous usage analytics (docs/yomiplay-analytics-api.md)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Raw events — kept 180 days
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yomiplay_events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  install_id  uuid        NOT NULL,
  name        text        NOT NULL,
  props       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  client_ts   timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  platform    text        NOT NULL,
  app_version text        NOT NULL,
  is_pro      boolean     NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_yomiplay_events_name_ts    ON yomiplay_events (name, client_ts DESC);
CREATE INDEX IF NOT EXISTS idx_yomiplay_events_install_ts ON yomiplay_events (install_id, client_ts);
ALTER TABLE yomiplay_events ENABLE ROW LEVEL SECURITY;   -- no policies: service role only


-- 2. One row per install
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS yomiplay_installs (
  install_id   uuid PRIMARY KEY,
  platform     text NOT NULL,
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now(),
  app_version  text NOT NULL,
  os_version   text,
  device_class text,
  memory_tier  text,
  locale       text,
  country      text,          -- country code only, never the IP
  is_pro       boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_yomiplay_installs_first_seen ON yomiplay_installs (first_seen DESC);
ALTER TABLE yomiplay_installs ENABLE ROW LEVEL SECURITY;


-- 3. Dashboard summary for the admin page (service role only)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION yomiplay_usage_stats(p_days integer DEFAULT 7)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  WITH params AS (
    SELECT now() - make_interval(days => p_days) AS since
  ),
  ev AS (
    SELECT e.* FROM yomiplay_events e, params
    WHERE e.client_ts >= params.since AND e.platform NOT LIKE '%-debug'
  ),
  cohort AS (
    SELECT i.install_id FROM yomiplay_installs i, params
    WHERE i.first_seen >= params.since AND i.platform NOT LIKE '%-debug'
  )
  SELECT jsonb_build_object(
    'days', p_days,
    'new_installs', (SELECT count(*) FROM cohort),
    'active_installs', (SELECT count(DISTINCT install_id) FROM ev),
    'daily_active', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'users', users) ORDER BY day)
      FROM (SELECT date_trunc('day', client_ts)::date AS day, count(DISTINCT install_id) AS users
            FROM ev GROUP BY 1) d), '[]'::jsonb),
    'funnel', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('step', s.step, 'users', (
        SELECT count(DISTINCT e.install_id) FROM ev e JOIN cohort c USING (install_id) WHERE e.name = s.step
      )) ORDER BY s.ord)
      FROM unnest(ARRAY['app_first_launch','import_started','recognition_completed','player_opened','vocab_item_added','vocab_session_completed'])
           WITH ORDINALITY AS s(step, ord)), '[]'::jsonb),
    'events', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('name', name, 'users', users, 'times', times) ORDER BY users DESC)
      FROM (SELECT name, count(DISTINCT install_id) AS users, count(*) AS times FROM ev GROUP BY name) x), '[]'::jsonb),
    'paywall', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('trigger', trigger, 'shown', shown, 'purchased', purchased) ORDER BY shown DESC)
      FROM (SELECT COALESCE(props->>'trigger', '?') AS trigger,
                   count(*) FILTER (WHERE name = 'paywall_shown') AS shown,
                   count(*) FILTER (WHERE name = 'purchase_completed') AS purchased
            FROM ev WHERE name IN ('paywall_shown', 'purchase_completed') GROUP BY 1) p), '[]'::jsonb),
    'import_sources', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('source', source, 'times', times) ORDER BY times DESC)
      FROM (SELECT COALESCE(props->>'source', '?') AS source, count(*) AS times
            FROM ev WHERE name = 'import_started' GROUP BY 1) s), '[]'::jsonb),
    'countries', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('country', country, 'installs', n) ORDER BY n DESC)
      FROM (SELECT COALESCE(i.country, '?') AS country, count(*) AS n
            FROM yomiplay_installs i JOIN (SELECT DISTINCT install_id FROM ev) a USING (install_id)
            GROUP BY 1 ORDER BY 2 DESC LIMIT 10) c), '[]'::jsonb),
    'retention_d1', (
      SELECT jsonb_build_object('cohort', count(*), 'retained', count(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM yomiplay_events e
        WHERE e.install_id = i.install_id AND e.name = 'app_open'
          AND e.client_ts >= date_trunc('day', i.first_seen) + interval '1 day'
          AND e.client_ts <  date_trunc('day', i.first_seen) + interval '2 days')))
      FROM yomiplay_installs i, params
      -- only installs old enough to have had a "day 1"
      WHERE i.first_seen >= params.since AND i.first_seen < date_trunc('day', now()) - interval '1 day'
        AND i.platform NOT LIKE '%-debug')
  );
$$;
REVOKE ALL ON FUNCTION yomiplay_usage_stats(integer) FROM PUBLIC, anon, authenticated;


-- 4. Retention: delete raw events older than 180 days (needs the pg_cron extension)
-- ------------------------------------------------------------
-- SELECT cron.schedule('yomiplay-events-cleanup', '17 3 * * *',
--   $$DELETE FROM yomiplay_events WHERE client_ts < now() - interval '180 days'$$);
