'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export default function AdminActions({ uploadId }: { uploadId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleAction = async (action: 'approved' | 'rejected') => {
    setLoading(true);
    const res = await fetch('/api/yomi/admin/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, action }),
    });
    if (res.ok) {
      setDone(action);
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!confirm('Remove this content?')) return;
    setLoading(true);
    const res = await fetch('/api/yomi/admin/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, reason: 'Removed by admin' }),
    });
    if (res.ok) {
      setDone('removed');
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(false);
  };

  if (done) {
    const labels: Record<string, string> = {
      approved: '✓ Approved',
      rejected: '✗ Rejected',
      removed: '✓ Removed',
    };
    return (
      <span className="text-xs font-bold text-green-500">{labels[done]}</span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction('approved')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50"
      >
        <CheckCircle2 size={14} />
        Approve
      </button>
      <button
        onClick={() => handleAction('rejected')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <XCircle size={14} />
        Reject
      </button>
      <button
        onClick={handleRemove}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold hover:bg-[var(--border)] transition-colors disabled:opacity-50"
      >
        <Trash2 size={14} />
        Remove
      </button>
    </div>
  );
}
