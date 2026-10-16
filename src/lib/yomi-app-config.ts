import type { SupabaseClient } from '@supabase/supabase-js';

// Numeric YomiPlay config (supabase/yomiplay_app_config.sql), edited in the admin Settings tab.
// The iOS app reads it through /api/yomiplay/feature-flags; the pricing / download pages show it.

export const APP_CONFIG_META = {
  free_import_limit: { label: 'Free imports per month (iOS)', min: 1, max: 100, unit: 'imports' },
  free_import_max_minutes: { label: 'Max length of a file to recognize, free (iOS)', min: 1, max: 600, unit: 'min' },
} as const;

export type AppConfigKey = keyof typeof APP_CONFIG_META;
export type AppConfig = Record<AppConfigKey, number>;

// Used when the table is unreachable; must match the app's built-in defaults
// (SubscriptionManager.defaultFreeImportLimit / defaultFreeImportMaxMinutes).
export const DEFAULT_APP_CONFIG: AppConfig = {
  free_import_limit: 3,
  free_import_max_minutes: 30,
};

export function isAppConfigKey(key: string): key is AppConfigKey {
  return key in APP_CONFIG_META;
}

export function isValidAppConfigValue(key: AppConfigKey, value: number) {
  const { min, max } = APP_CONFIG_META[key];
  return Number.isInteger(value) && value >= min && value <= max;
}

export async function getAppConfig(supabase: SupabaseClient): Promise<AppConfig> {
  const config: AppConfig = { ...DEFAULT_APP_CONFIG };
  try {
    const { data, error } = await supabase.from('yomiplay_app_config').select('key, value');
    if (error || !data) return config;
    for (const row of data as { key: string; value: number }[]) {
      if (isAppConfigKey(row.key) && isValidAppConfigValue(row.key, row.value)) config[row.key] = row.value;
    }
  } catch {
    // fall back to defaults
  }
  return config;
}

/** Fill {n} (imports per month) and {m} (max minutes) in website copy. */
export function fillFreeTier(text: string, config: AppConfig) {
  return text.replaceAll('{n}', String(config.free_import_limit)).replaceAll('{m}', String(config.free_import_max_minutes));
}
