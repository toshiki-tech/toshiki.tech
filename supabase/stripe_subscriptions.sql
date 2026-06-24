-- ============================================================
-- Stripe subscription tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Stripe Customer mapping
--    One row per user. Shared across all products so a user never
--    gets duplicate Stripe Customers.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS toshiki_tech_stripe_customers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE NOT NULL,
  created_at         timestamptz DEFAULT now()
);

ALTER TABLE toshiki_tech_stripe_customers ENABLE ROW LEVEL SECURITY;
-- Readable by the owner (useful for future client-side queries)
CREATE POLICY "users read own customer" ON toshiki_tech_stripe_customers
  FOR SELECT USING (auth.uid() = user_id);
-- Writes are service-role only (Stripe webhook + create-checkout backend)


-- 2. Unified subscriptions table
--    One row per (user, product). UPSERT on renewal/upgrade.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS toshiki_tech_subscriptions (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product                   text NOT NULL,
  plan                      text NOT NULL
    CHECK (plan IN ('monthly', 'yearly', 'lifetime')),
  status                    text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'trialing', 'past_due', 'canceled',
                      'unpaid', 'incomplete', 'incomplete_expired')),
  stripe_customer_id        text NOT NULL,
  stripe_subscription_id    text UNIQUE,           -- null for lifetime (payment mode)
  stripe_payment_intent_id  text UNIQUE,           -- null for recurring subscriptions
  current_period_end        timestamptz,           -- null for lifetime
  is_lifetime               boolean NOT NULL DEFAULT false,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now(),

  UNIQUE (user_id, product)                        -- one active record per user per product
);

ALTER TABLE toshiki_tech_subscriptions ENABLE ROW LEVEL SECURITY;
-- Users can read their own subscription (used by /api/yomiplay/v1/me)
CREATE POLICY "users read own subscription" ON toshiki_tech_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
-- Writes are service-role only


-- 3. Index for webhook lookups by stripe_subscription_id
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id
  ON toshiki_tech_subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
