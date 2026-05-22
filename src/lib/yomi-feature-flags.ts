import type { SupabaseClient } from '@supabase/supabase-js';

export const FEATURE_FLAG_KEYS = ['points_feature', 'pro_redemption', 'community_download'] as const;

export type FeatureFlagKey = typeof FEATURE_FLAG_KEYS[number];

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

// Safe defaults used when the DB row is missing or unreachable. Chosen to
// match the historical defaults of the previous hard-coded constants.
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  points_feature: true,
  pro_redemption: true,
  community_download: true,
};

export function isFeatureFlagKey(key: string): key is FeatureFlagKey {
  return (FEATURE_FLAG_KEYS as readonly string[]).includes(key);
}

export async function getFeatureFlags(supabase: SupabaseClient): Promise<FeatureFlags> {
  const flags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };
  try {
    const { data, error } = await supabase
      .from('toshiki_tech_yomi_feature_flags')
      .select('key, enabled');
    if (error || !data) return flags;
    for (const row of data as { key: string; enabled: boolean }[]) {
      if (isFeatureFlagKey(row.key)) {
        flags[row.key] = !!row.enabled;
      }
    }
  } catch {
    // ignore — fall back to defaults
  }
  return flags;
}
