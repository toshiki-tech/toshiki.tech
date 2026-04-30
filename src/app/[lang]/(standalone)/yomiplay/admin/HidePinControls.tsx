'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pin, Loader2 } from 'lucide-react';

interface Props {
  uploadId: string;
  isHidden: boolean;
  sortOrder: number;
}

export default function HidePinControls({ uploadId, isHidden, sortOrder }: Props) {
  const [hidden, setHidden] = useState(isHidden);
  const [order, setOrder] = useState<number>(sortOrder);
  const [orderInput, setOrderInput] = useState<string>(String(sortOrder));
  const [busy, setBusy] = useState<'hide' | 'pin' | null>(null);

  async function patch(updates: Record<string, unknown>) {
    const res = await fetch('/api/yomi/admin/edit-upload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, updates }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Failed: ' + (err.error || 'Unknown error'));
      return false;
    }
    return true;
  }

  async function toggleHidden() {
    setBusy('hide');
    const next = !hidden;
    if (await patch({ is_hidden: next })) setHidden(next);
    setBusy(null);
  }

  async function saveOrder() {
    const next = parseInt(orderInput, 10);
    if (Number.isNaN(next)) {
      alert('Sort order must be a number');
      return;
    }
    setBusy('pin');
    if (await patch({ sort_order: next })) {
      setOrder(next);
      setOrderInput(String(next));
    }
    setBusy(null);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={toggleHidden}
        disabled={busy !== null}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
          hidden
            ? 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30'
            : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
        }`}
        title={hidden ? 'Currently hidden — click to show' : 'Click to hide from public listing'}
      >
        {busy === 'hide' ? <Loader2 size={14} className="animate-spin" /> : hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        {hidden ? 'Hidden' : 'Hide'}
      </button>

      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
        <Pin size={12} className={order > 0 ? 'text-[rgb(var(--accent))]' : 'text-[var(--muted-foreground)]'} />
        <input
          type="number"
          value={orderInput}
          onChange={(e) => setOrderInput(e.target.value)}
          className="w-14 bg-transparent text-xs font-bold focus:outline-none"
          title="Sort order. Items with sort_order > 0 are pinned above the regular list, larger values first."
        />
        <button
          onClick={saveOrder}
          disabled={busy !== null || orderInput === String(order)}
          className="text-xs font-bold text-[rgb(var(--accent))] hover:underline disabled:opacity-30 disabled:hover:no-underline"
        >
          {busy === 'pin' ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
        </button>
      </div>
    </div>
  );
}
