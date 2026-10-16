'use client';

import { useEffect, useState } from 'react';
import { Gauge, Loader2 } from 'lucide-react';
import { APP_CONFIG_META, type AppConfig, type AppConfigKey } from '@/lib/yomi-app-config';

const KEYS = Object.keys(APP_CONFIG_META) as AppConfigKey[];

/**
 * iOS free-tier limits. The app picks a change up on its next launch / import page visit
 * (feature-flags API, ~30s cache); the pricing and download pages within a few minutes.
 * Loosening is easy, tightening upsets users — move in small steps, judge on 4–6 weeks of data.
 */
export default function FreeTierPanel({ initialConfig }: { initialConfig: AppConfig }) {
  const [saved, setSaved] = useState<AppConfig>(initialConfig);
  const [draft, setDraft] = useState<Record<AppConfigKey, string>>(
    () => Object.fromEntries(KEYS.map((k) => [k, String(initialConfig[k])])) as Record<AppConfigKey, string>,
  );
  const [busy, setBusy] = useState<AppConfigKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Follow "Refresh data" unless the field is being edited
  useEffect(() => {
    setSaved(initialConfig);
    setDraft((prev) => Object.fromEntries(KEYS.map((k) => [k, prev[k] === String(saved[k]) ? String(initialConfig[k]) : prev[k]])) as Record<AppConfigKey, string>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConfig]);

  async function save(key: AppConfigKey) {
    const value = Number(draft[key]);
    const { min, max } = APP_CONFIG_META[key];
    if (!Number.isInteger(value) || value < min || value > max) {
      setError(`${APP_CONFIG_META[key].label}: ${min}–${max}`);
      return;
    }
    if (!confirm(`Change "${APP_CONFIG_META[key].label}" from ${saved[key]} to ${value}? Every free iOS user gets the new limit.`)) return;
    setBusy(key);
    setError(null);
    const res = await fetch('/api/yomi/admin/app-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) setSaved((prev) => ({ ...prev, [key]: value }));
    else setError(json.error || res.statusText);
    setBusy(null);
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Gauge size={18} />
        Free Tier Limits (iOS 2.3+)
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Free users can import from podcasts, links, local files, camera roll, text-to-speech and the community this many
        times a month; ZIP stays Pro. Shown in the app and on the pricing / download pages. Loosen in small steps —
        tightening a limit upsets users.
      </p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {KEYS.map((key) => {
          const meta = APP_CONFIG_META[key];
          const changed = draft[key] !== String(saved[key]);
          return (
            <div key={key} className="p-4 border border-[var(--border)] rounded-2xl">
              <p className="text-sm font-semibold mb-1">{meta.label}</p>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                Current: {saved[key]} {meta.unit} · allowed {meta.min}–{meta.max}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={meta.min}
                  max={meta.max}
                  value={draft[key]}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-24 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
                />
                <span className="text-sm text-[var(--muted-foreground)]">{meta.unit}</span>
                <button
                  type="button"
                  onClick={() => save(key)}
                  disabled={!changed || busy !== null}
                  className="ml-auto px-3 py-2 rounded-lg text-sm font-semibold bg-[rgb(var(--accent))] text-white disabled:opacity-40"
                >
                  {busy === key ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
