-- ============================================================
-- Manual Pro grants (admin / points redemption)
-- Run this in Supabase SQL Editor after stripe_subscriptions.sql.
--
-- toshiki_tech_subscriptions becomes the single source of truth for Pro.
-- toshiki_tech_yomi_profiles.is_pro stays as a mirror for the website.
-- ============================================================

-- 1. Rows that did not come from Stripe have no Stripe customer
ALTER TABLE toshiki_tech_subscriptions
  ALTER COLUMN stripe_customer_id DROP NOT NULL;

-- 2. Where the row came from + who granted it
ALTER TABLE toshiki_tech_subscriptions
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'stripe'
    CHECK (source IN ('stripe', 'admin', 'points')),
  ADD COLUMN IF NOT EXISTS granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS note text;

-- cancel_at_period_end is written by the webhook and read by /me;
-- make sure it exists on databases created from the original script
ALTER TABLE toshiki_tech_subscriptions
  ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false;

-- 3. Admin grants with a custom end date use plan = 'manual'
ALTER TABLE toshiki_tech_subscriptions
  DROP CONSTRAINT IF EXISTS toshiki_tech_subscriptions_plan_check;
ALTER TABLE toshiki_tech_subscriptions
  ADD CONSTRAINT toshiki_tech_subscriptions_plan_check
    CHECK (plan IN ('monthly', 'yearly', 'lifetime', 'manual'));

-- 4. Backfill: users who redeemed Pro with points only had profiles.is_pro = true,
--    which /api/yomiplay/v1/me never read. Stripe always writes a subscription row,
--    so a Pro profile without any row came from points redemption (no expiry).
INSERT INTO toshiki_tech_subscriptions (user_id, product, plan, status, is_lifetime, source, note)
SELECT p.id, 'yomiplay', 'lifetime', 'active', true, 'points', 'Backfilled from profiles.is_pro'
FROM toshiki_tech_yomi_profiles p
WHERE p.is_pro = true
  AND NOT EXISTS (
    SELECT 1 FROM toshiki_tech_subscriptions s
    WHERE s.user_id = p.id AND s.product = 'yomiplay'
  );

-- 5. Admin lookups against auth.users (service role only)
CREATE OR REPLACE FUNCTION toshiki_tech_find_user_by_email(p_email text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id FROM auth.users WHERE lower(email) = lower(trim(p_email)) LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION toshiki_tech_user_emails(p_ids uuid[])
RETURNS TABLE (id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.email::text FROM auth.users u WHERE u.id = ANY(p_ids);
$$;

REVOKE ALL ON FUNCTION toshiki_tech_find_user_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION toshiki_tech_user_emails(uuid[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION toshiki_tech_find_user_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION toshiki_tech_user_emails(uuid[]) TO service_role;
