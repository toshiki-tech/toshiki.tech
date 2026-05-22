'use client';

import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { FEATURE_FLAG_KEYS, type FeatureFlagKey, type FeatureFlags } from '@/lib/yomi-feature-flags';

const FLAG_META: Record<FeatureFlagKey, { title: string; description: string }> = {
  points_feature: {
    title: 'Points feature',
    description: 'Master switch for the entire points UI: rules card, header points badge, my-uploads PointsPanel, and the daily-login bonus.',
  },
  pro_redemption: {
    title: 'Pro redemption',
    description: 'Allow users to redeem points for Pro membership. Controls the Apply-for-Pro form, the Pro CTA banner, the launch-promotion notice, and the /api/yomi/pro/apply endpoint.',
  },
  community_download: {
    title: 'Community download (iOS app)',
    description: 'Exposed via /api/yomiplay/feature-flags so the iOS app can hide its community download entry point.',
  },
};

export default function FeatureFlagsPanel({ initialFlags }: { initialFlags: FeatureFlags }) {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags);
  const [busy, setBusy] = useState<FeatureFlagKey | null>(null);

  async function toggle(key: FeatureFlagKey) {
    setBusy(key);
    const next = !flags[key];
    // Optimistic update; revert on failure.
    setFlags((prev) => ({ ...prev, [key]: next }));
    const res = await fetch('/api/yomi/admin/feature-flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, enabled: next }),
    });
    if (!res.ok) {
      setFlags((prev) => ({ ...prev, [key]: !next }));
      const err = await res.json().catch(() => ({}));
      alert('Failed to update flag: ' + (err.error || 'Unknown error'));
    }
    setBusy(null);
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Flag size={18} />
        Feature Flags
      </h2>
      <div className="space-y-3">
        {FEATURE_FLAG_KEYS.map((key) => {
          const meta = FLAG_META[key];
          const enabled = flags[key];
          return (
            <div
              key={key}
              className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--card)] flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{meta.title}</h3>
                  <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">{key}</code>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{meta.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(key)}
                disabled={busy !== null}
                aria-pressed={enabled}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                  enabled ? 'bg-[rgb(var(--accent))]' : 'bg-[var(--muted)]'
                }`}
                title={enabled ? 'Currently enabled — click to disable' : 'Currently disabled — click to enable'}
              >
                <span
                  className={`inline-flex h-5 w-5 transform rounded-full bg-white items-center justify-center transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {busy === key && <Loader2 size={10} className="animate-spin text-[var(--muted-foreground)]" />}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-3">
        Changes are saved immediately. The public /api/yomiplay/feature-flags response may take up to ~30 seconds to refresh due to edge caching.
      </p>
    </section>
  );
}
