'use client';

import { useState } from 'react';
import { CreditCard, XCircle, Gift } from 'lucide-react';

interface Subscription {
  user_id: string;
  display_name: string | null;
  email: string | null;
  product: string;
  plan: string;
  status: string;
  source: string;
  note: string | null;
  current_period_end: string | null;
  is_lifetime: boolean;
  updated_at: string;
}

type Duration = 'month' | 'year' | 'lifetime' | 'until';

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-500/10 text-green-600',
  canceled: 'bg-red-500/10 text-red-500',
  past_due: 'bg-yellow-500/10 text-yellow-600',
  trialing: 'bg-blue-500/10 text-blue-600',
};

const SOURCE_COLORS: Record<string, string> = {
  stripe: 'bg-indigo-500/10 text-indigo-600',
  admin:  'bg-amber-500/10 text-amber-600',
  points: 'bg-teal-500/10 text-teal-600',
};

const DURATION_LABELS: Record<Duration, string> = {
  month:    '+1 month',
  year:     '+1 year',
  lifetime: 'Lifetime',
  until:    'Until date…',
};

const TH = 'text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]';
const INPUT = 'rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm';

export default function SubscriptionsPanel({ subscriptions }: { subscriptions: Subscription[] }) {
  const [items, setItems] = useState(subscriptions);
  const [revoking, setRevoking] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState('');
  const [duration, setDuration] = useState<Duration>('month');
  const [until, setUntil] = useState('');
  const [note, setNote] = useState('');
  const [granting, setGranting] = useState(false);
  const [grantMessage, setGrantMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;
    if (duration === 'until' && !until) return;
    setGranting(true);
    setGrantMessage(null);

    const res = await fetch('/api/yomiplay/admin/grant-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identifier.trim(),
        product: 'yomiplay',
        duration,
        // End of the chosen day in local time
        until: duration === 'until' ? new Date(`${until}T23:59:59`).toISOString() : undefined,
        note: note.trim() || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setGrantMessage({ ok: false, text: data.error || 'Unknown error' });
    } else {
      const granted = data.subscription;
      setItems(prev => {
        const existing = prev.find(s => s.user_id === granted.user_id && s.product === granted.product);
        const row: Subscription = {
          ...granted,
          display_name: existing?.display_name ?? null,
          email: existing?.email ?? (identifier.includes('@') ? identifier.trim() : null),
        };
        return [row, ...prev.filter(s => !(s.user_id === granted.user_id && s.product === granted.product))];
      });
      setGrantMessage({ ok: true, text: `Granted Pro to ${identifier.trim()}` });
      setIdentifier('');
      setNote('');
    }
    setGranting(false);
  }

  async function handleRevoke(sub: Subscription) {
    const key = `${sub.user_id}:${sub.product}`;
    const who = sub.email ?? sub.display_name ?? sub.user_id;
    const warning = sub.source !== 'stripe'
      ? `Revoke ${sub.source} Pro for ${who} (${sub.product})?`
      : sub.is_lifetime
        ? `Revoke lifetime Pro for ${who} (${sub.product})?\n\nThis does not refund the purchase — issue a refund in the Stripe Dashboard if needed.`
        : `Revoke Pro for ${who} (${sub.product})?\n\nThis also cancels their Stripe subscription immediately, so they are not billed again. It does not refund past payments.`;
    if (!confirm(warning)) return;
    setRevoking(key);

    const res = await fetch('/api/yomiplay/admin/revoke-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: sub.user_id, product: sub.product }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Failed: ' + (err.error || 'Unknown error'));
    } else {
      setItems(prev =>
        prev.map(s =>
          s.user_id === sub.user_id && s.product === sub.product
            ? { ...s, status: 'canceled' }
            : s
        )
      );
    }
    setRevoking(null);
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CreditCard size={18} />
        Subscriptions ({items.length})
      </h2>

      {/* Grant Pro */}
      <form
        onSubmit={handleGrant}
        className="mb-6 rounded-2xl border border-[var(--border)] p-4 flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
          <label className="text-xs font-bold text-[var(--muted-foreground)]">User email or ID</label>
          <input
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="user@example.com"
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[var(--muted-foreground)]">Duration</label>
          <select value={duration} onChange={e => setDuration(e.target.value as Duration)} className={INPUT}>
            {(Object.keys(DURATION_LABELS) as Duration[]).map(d => (
              <option key={d} value={d}>{DURATION_LABELS[d]}</option>
            ))}
          </select>
        </div>
        {duration === 'until' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[var(--muted-foreground)]">Until</label>
            <input type="date" value={until} onChange={e => setUntil(e.target.value)} className={INPUT} />
          </div>
        )}
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs font-bold text-[var(--muted-foreground)]">Note (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. beta tester" className={INPUT} />
        </div>
        <button
          type="submit"
          disabled={granting || !identifier.trim() || (duration === 'until' && !until)}
          className="flex items-center gap-1.5 rounded-lg bg-[rgb(var(--accent))] px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          <Gift size={14} />
          {granting ? 'Granting…' : 'Grant Pro'}
        </button>
        {grantMessage && (
          <p className={`w-full text-xs ${grantMessage.ok ? 'text-green-600' : 'text-red-500'}`}>
            {grantMessage.text}
          </p>
        )}
        <p className="w-full text-xs text-[var(--muted-foreground)]">
          +1 month / +1 year extend an active manual grant. Users with a live Stripe subscription cannot be overwritten.
        </p>
      </form>

      {items.length === 0 ? (
        <p className="text-[var(--muted-foreground)] py-8 text-center text-sm">No subscriptions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className={TH}>User</th>
                <th className={TH}>Product</th>
                <th className={TH}>Plan</th>
                <th className={TH}>Source</th>
                <th className={TH}>Status</th>
                <th className={TH}>Expires</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((sub) => {
                const key = `${sub.user_id}:${sub.product}`;
                const isRevoking = revoking === key;
                const expiry = sub.is_lifetime
                  ? '∞ Lifetime'
                  : sub.current_period_end
                    ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—';
                const expired = !sub.is_lifetime && !!sub.current_period_end &&
                  new Date(sub.current_period_end) <= new Date();

                return (
                  <tr key={key} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{sub.display_name ?? sub.email ?? sub.user_id.slice(0, 8) + '…'}</div>
                      {sub.email && sub.display_name && (
                        <div className="text-xs text-[var(--muted-foreground)]">{sub.email}</div>
                      )}
                      {sub.note && <div className="text-xs text-[var(--muted-foreground)] italic">{sub.note}</div>}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{sub.product}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{sub.plan}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${SOURCE_COLORS[sub.source] ?? 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                        {sub.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] ?? 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                        {expired && sub.status === 'active' ? 'expired' : sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">{expiry}</td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' && !expired && (
                        <button
                          onClick={() => handleRevoke(sub)}
                          disabled={isRevoking}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-40 transition-colors"
                        >
                          <XCircle size={13} />
                          {isRevoking ? 'Revoking…' : 'Revoke'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
