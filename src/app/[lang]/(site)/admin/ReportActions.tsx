'use client';

import { useState } from 'react';
import { Trash2, XCircle } from 'lucide-react';

export default function ReportActions({ reportId, uploadId }: { reportId: string; uploadId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleRemoveContent = async () => {
    if (!confirm('Remove the reported content?')) return;
    setLoading(true);
    await fetch('/api/yomi/admin/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, reason: 'Removed due to report' }),
    });
    await fetch('/api/yomi/admin/resolve-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, action: 'resolved' }),
    });
    setDone('removed');
    setTimeout(() => window.location.reload(), 500);
  };

  const handleDismiss = async () => {
    setLoading(true);
    await fetch('/api/yomi/admin/resolve-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, action: 'dismissed' }),
    });
    setDone('dismissed');
    setTimeout(() => window.location.reload(), 500);
  };

  if (done) {
    return (
      <span className="text-xs font-bold text-green-500 mt-3 inline-block">
        {done === 'removed' ? '✓ Content removed' : '✓ Dismissed'}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={handleRemoveContent}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <Trash2 size={14} />
        Remove Content
      </button>
      <button
        onClick={handleDismiss}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold hover:bg-[var(--border)] transition-colors disabled:opacity-50"
      >
        <XCircle size={14} />
        Dismiss
      </button>
    </div>
  );
}
