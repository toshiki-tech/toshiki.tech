'use client';

import { useState } from 'react';
import { Check, Archive, Trash2 } from 'lucide-react';

export default function ContactActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const handleUpdate = async (status: 'responded' | 'archived') => {
    setLoading(true);
    const res = await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setDone(status);
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this message? This cannot be undone.')) return;
    setLoading(true);
    const res = await fetch('/api/admin/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setDone('deleted');
      setTimeout(() => window.location.reload(), 500);
    }
    setLoading(false);
  };

  if (done) {
    const labels: Record<string, string> = {
      responded: '✓ Marked as responded',
      archived: '✓ Archived',
      deleted: '✓ Deleted',
    };
    return <span className="text-xs font-bold text-green-500">{labels[done]}</span>;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => handleUpdate('responded')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50"
      >
        <Check size={14} />
        Responded
      </button>
      <button
        onClick={() => handleUpdate('archived')}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold hover:bg-[var(--border)] transition-colors disabled:opacity-50"
      >
        <Archive size={14} />
        Archive
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}
