'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function FileUpdateActions({ uploadId, submittedAt }: { uploadId: string; submittedAt: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleAction = async (action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !confirm('Reject this new version? The current file stays live.')) return;
    setLoading(true);
    const res = await fetch('/api/yomi/admin/review-file-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, action, submittedAt }),
    });
    if (res.ok) {
      setDone(action);
      setTimeout(() => window.location.reload(), 500);
    } else {
      const err = await res.json().catch(() => ({}));
      alert('Failed: ' + (err.error || 'Unknown error'));
    }
    setLoading(false);
  };

  if (done) {
    return (
      <span className="text-xs font-bold text-green-500">
        {done === 'approved' ? '✓ New version live' : '✗ New version rejected'}
      </span>
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
        Approve version
      </button>
      <button
        onClick={() => handleAction('rejected')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <XCircle size={14} />
        Reject version
      </button>
    </div>
  );
}
