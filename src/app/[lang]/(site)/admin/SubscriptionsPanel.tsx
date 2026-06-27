'use client';

import { useState } from 'react';
import { CreditCard, XCircle } from 'lucide-react';

interface Subscription {
  user_id: string;
  display_name: string | null;
  product: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  is_lifetime: boolean;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-500/10 text-green-600',
  canceled: 'bg-red-500/10 text-red-500',
  past_due: 'bg-yellow-500/10 text-yellow-600',
  trialing: 'bg-blue-500/10 text-blue-600',
};

export default function SubscriptionsPanel({ subscriptions }: { subscriptions: Subscription[] }) {
  const [items, setItems] = useState(subscriptions);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function handleRevoke(userId: string, product: string) {
    const key = `${userId}:${product}`;
    if (!confirm(`Revoke Pro for this user (${product})?`)) return;
    setRevoking(key);

    const res = await fetch('/api/yomiplay/admin/revoke-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, product }),
    });

    if (res.ok) {
      setItems(prev =>
        prev.map(s =>
          s.user_id === userId && s.product === product
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

      {items.length === 0 ? (
        <p className="text-[var(--muted-foreground)] py-8 text-center text-sm">No subscriptions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">User</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Product</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Status</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">Expires</th>
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

                return (
                  <tr key={key} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{sub.display_name ?? sub.user_id.slice(0, 8) + '…'}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{sub.product}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{sub.plan}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status] ?? 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">{expiry}</td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(sub.user_id, sub.product)}
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
