'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { ADMIN_REFRESH_EVENT } from './useAdminRefresh';
import SortableTable from './SortableTable';

// Anonymous YomiPlay app analytics (docs/yomiplay-analytics-api.md)

interface UsageStats {
  days: number;
  new_installs: number;
  /** installs first seen in range that upgraded from an older version (not new users) */
  upgraded_installs?: number;
  active_installs: number;
  daily_active: { day: string; users: number }[];
  funnel: { step: string; users: number }[];
  events: { name: string; users: number; times: number }[];
  paywall: { trigger: string; shown: number; purchased: number }[];
  import_sources: { source: string; times: number }[];
  countries: { country: string; installs: number }[];
  retention_d1: { cohort: number; retained: number } | null;
}

// Range-independent cards and 30-day trend (yomiplay_overview). Days are Tokyo calendar days.
interface Overview {
  today: string;
  total_installs: number;
  new_today: number;
  upgraded_today?: number;
  upgraded_total?: number;
  active_today: number;
  active_7d: number;
  active_30d: number;
  pro_active_today: number;
  pro_active_30d: number;
  purchases_today: { product: string; times: number }[];
  trend: { day: string; active: number; new: number; upgraded?: number; purchases: number }[];
}

const FUNNEL_LABELS: Record<string, string> = {
  app_first_launch: 'First launch',
  import_started: 'Import started',
  recognition_completed: 'Recognition done',
  player_opened: 'Opened player',
  vocab_item_added: 'Added vocab',
  vocab_session_completed: 'Finished a review',
};

const RANGES = [1, 7, 30, 90];

function pct(part: number, whole: number) {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—';
}

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="p-4 border border-[var(--border)] rounded-2xl">
      <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {hint && <p className="text-xs text-[var(--muted-foreground)] mt-1">{hint}</p>}
    </div>
  );
}

export default function AppUsagePanel() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (range: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/yomiplay/admin/usage-stats?days=${range}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setStats(json.data as UsageStats);
      setOverview((json.overview ?? null) as Overview | null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);
  useEffect(() => {
    const onRefresh = () => load(days);
    window.addEventListener(ADMIN_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(ADMIN_REFRESH_EVENT, onRefresh);
  }, [days, load]);

  const firstLaunch = stats?.funnel.find((f) => f.step === 'app_first_launch')?.users ?? 0;
  const maxDaily = Math.max(1, ...(stats?.daily_active.map((d) => d.users) ?? [1]));

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 size={18} />
          App Usage (anonymous)
        </h2>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className={`px-3 py-1 rounded-full text-sm border ${days === r ? 'bg-[rgb(var(--accent))] text-white border-transparent' : 'border-[var(--border)]'}`}
            >
              {r === 1 ? '24h' : `${r}d`}
            </button>
          ))}
          <button onClick={() => load(days)} className="p-1.5 rounded-full border border-[var(--border)]" aria-label="Refresh">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">Failed to load: {error}</p>}

      {overview && <OverviewBlock overview={overview} />}

      {stats && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm pt-2">Selected range ({days === 1 ? 'last 24h' : `last ${days} days`})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card
              label="New users"
              value={stats.new_installs}
              hint={stats.upgraded_installs ? `+ ${stats.upgraded_installs} upgraded` : undefined}
            />
            <Card label="Active installs" value={stats.active_installs} />
            <Card
              label="Day-1 retention"
              value={stats.retention_d1 ? pct(stats.retention_d1.retained, stats.retention_d1.cohort) : '—'}
              hint={stats.retention_d1 ? `${stats.retention_d1.retained} / ${stats.retention_d1.cohort}` : undefined}
            />
            <Card
              label="Paywall → purchase"
              value={pct(stats.paywall.reduce((s, p) => s + p.purchased, 0), stats.paywall.reduce((s, p) => s + p.shown, 0))}
            />
          </div>

          {stats.daily_active.length > 0 && (
            <div className="border border-[var(--border)] rounded-2xl p-4">
              <h3 className="font-semibold mb-3 text-sm">Daily active installs</h3>
              <div className="flex items-end gap-1 h-24">
                {stats.daily_active.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.users}`}>
                    <div className="w-full bg-[rgb(var(--accent))] opacity-70 rounded-t" style={{ height: `${(d.users / maxDaily) * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <SortableTable
              title="New-user funnel (installs first seen in range)"
              columns={[{ label: 'Step' }, { label: 'Users', kind: 'number' }, { label: 'Of first launch', kind: 'number' }]}
              rows={stats.funnel.map((f) => [FUNNEL_LABELS[f.step] ?? f.step, f.users, pct(f.users, firstLaunch)])}
            />
            <SortableTable
              title="Paywall by trigger"
              ranked
              columns={[{ label: 'Trigger' }, { label: 'Shown', kind: 'number' }, { label: 'Purchased', kind: 'number' }]}
              rows={stats.paywall.map((p) => [p.trigger, p.shown, p.purchased])}
              defaultSort={{ col: 1, dir: 'desc' }}
            />
            <SortableTable
              title="Import sources"
              ranked
              columns={[{ label: 'Source' }, { label: 'Times', kind: 'number' }]}
              rows={stats.import_sources.map((s) => [s.source, s.times])}
              defaultSort={{ col: 1, dir: 'desc' }}
            />
            <SortableTable
              title="Countries (active installs, top 10)"
              ranked
              columns={[{ label: 'Country' }, { label: 'Installs', kind: 'number' }]}
              rows={stats.countries.map((c) => [c.country, c.installs])}
              defaultSort={{ col: 1, dir: 'desc' }}
            />
          </div>

          <SortableTable
            title="Feature usage"
            ranked
            columns={[{ label: 'Event' }, { label: 'Users', kind: 'number' }, { label: 'Times', kind: 'number' }]}
            rows={stats.events.map((ev) => [ev.name, ev.users, ev.times])}
            defaultSort={{ col: 1, dir: 'desc' }}
          />
        </div>
      )}
    </section>
  );
}

const TREND_SERIES = [
  { key: 'active', label: 'Active', color: 'rgb(var(--accent))' },
  { key: 'new', label: 'New users', color: '#3b82f6' },
  { key: 'upgraded', label: 'Upgraded', color: '#94a3b8' },
  { key: 'purchases', label: 'Purchases', color: '#f59e0b' },
] as const;

function OverviewBlock({ overview: o }: { overview: Overview }) {
  const purchasesToday = o.purchases_today.reduce((s, p) => s + p.times, 0);
  const max = Math.max(1, ...o.trend.map((d) => d.active));
  return (
    <div className="space-y-4 mb-8">
      <p className="text-xs text-[var(--muted-foreground)]">
        Today = {o.today} (Tokyo time). “Users” are app installs: one person on two devices counts twice, a
        reinstall counts as new, installs with analytics off are not counted. Pro counts are estimates.
        “Upgraded” = an existing user’s first launch of a version with analytics (flagged by the app from 2.3;
        before that only existing Pro users can be recognised), kept out of new users, the funnel and retention.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card label="Active today" value={o.active_today} hint={`Pro ${o.pro_active_today}`} />
        <Card label="Active, last 7 days" value={o.active_7d} />
        <Card label="Active, last 30 days" value={o.active_30d} hint={`Pro ${o.pro_active_30d} (est.)`} />
        <Card
          label="Total installs"
          value={o.total_installs}
          hint={`New today ${o.new_today} · upgraded ${o.upgraded_today ?? 0} (all-time upgraded ${o.upgraded_total ?? 0})`}
        />
        <Card
          label="Purchases today"
          value={purchasesToday}
          hint={o.purchases_today.length > 0 ? o.purchases_today.map((p) => `${p.product} ${p.times}`).join(' · ') : undefined}
        />
      </div>
      <div className="border border-[var(--border)] rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <h3 className="font-semibold text-sm">Last 30 days</h3>
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            {TREND_SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-32">
          {o.trend.map((d) => (
            <div
              key={d.day}
              className="flex-1 flex items-end justify-center gap-px h-full"
              title={`${d.day}: active ${d.active}, new ${d.new}, upgraded ${d.upgraded ?? 0}, purchases ${d.purchases}`}
            >
              {TREND_SERIES.map((s) => (
                <div
                  key={s.key}
                  className="flex-1 rounded-t"
                  style={{ background: s.color, height: `${((d[s.key] ?? 0) / max) * 100}%`, minHeight: (d[s.key] ?? 0) > 0 ? 2 : 0 }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1 tabular-nums">
          <span>{o.trend[0]?.day.slice(5)}</span>
          <span>{o.trend[o.trend.length - 1]?.day.slice(5)}</span>
        </div>
      </div>
    </div>
  );
}
