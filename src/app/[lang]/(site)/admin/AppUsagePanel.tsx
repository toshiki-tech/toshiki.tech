'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';

// Anonymous YomiPlay app analytics (docs/yomiplay-analytics-api.md)

interface UsageStats {
  days: number;
  new_installs: number;
  active_installs: number;
  daily_active: { day: string; users: number }[];
  funnel: { step: string; users: number }[];
  events: { name: string; users: number; times: number }[];
  paywall: { trigger: string; shown: number; purchased: number }[];
  import_sources: { source: string; times: number }[];
  countries: { country: string; installs: number }[];
  retention_d1: { cohort: number; retained: number } | null;
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

function Table({ title, head, rows }: { title: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-4 overflow-x-auto">
      <h3 className="font-semibold mb-3 text-sm">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">No data.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted-foreground)]">
              {head.map((h, i) => <th key={h} className={`pb-2 font-medium ${i > 0 ? 'text-right' : ''}`}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                {r.map((c, j) => <td key={j} className={`py-1.5 ${j > 0 ? 'text-right tabular-nums' : 'font-mono text-xs'}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AppUsagePanel() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<UsageStats | null>(null);
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
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);

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

      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label="New installs" value={stats.new_installs} />
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
            <Table
              title="New-user funnel (installs first seen in range)"
              head={['Step', 'Users', 'Of first launch']}
              rows={stats.funnel.map((f) => [FUNNEL_LABELS[f.step] ?? f.step, f.users, pct(f.users, firstLaunch)])}
            />
            <Table
              title="Paywall by trigger"
              head={['Trigger', 'Shown', 'Purchased']}
              rows={stats.paywall.map((p) => [p.trigger, p.shown, p.purchased])}
            />
            <Table
              title="Import sources"
              head={['Source', 'Times']}
              rows={stats.import_sources.map((s) => [s.source, s.times])}
            />
            <Table
              title="Countries (active installs)"
              head={['Country', 'Installs']}
              rows={stats.countries.map((c) => [c.country, c.installs])}
            />
          </div>

          <Table
            title="Feature usage"
            head={['Event', 'Users', 'Times']}
            rows={stats.events.map((ev) => [ev.name, ev.users, ev.times])}
          />
        </div>
      )}
    </section>
  );
}
