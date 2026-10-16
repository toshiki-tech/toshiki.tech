'use client';

import { useEffect, useState } from 'react';
import { useAdminRefresh } from './useAdminRefresh';
import { Loader2, RefreshCw } from 'lucide-react';

function timeLabel(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Floating "refresh data" button: re-runs the server component's queries via router.refresh()
 * instead of reloading the page, so scroll position, open forms and inputs are kept.
 */
export default function AdminRefreshButton() {
  const { refresh, pending } = useAdminRefresh();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => { setUpdatedAt(new Date()); }, []);

  // The transition ends once the refreshed server data has rendered.
  useEffect(() => {
    if (!pending) setUpdatedAt((prev) => (prev ? new Date() : prev));
  }, [pending]);

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={pending}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold shadow-lg transition hover:border-[rgb(var(--accent))] disabled:opacity-70"
      aria-label="Refresh data"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
      <span>{pending ? 'Updating…' : 'Refresh data'}</span>
      {updatedAt && !pending && (
        <span className="text-xs font-normal text-[var(--muted-foreground)]">{timeLabel(updatedAt)}</span>
      )}
    </button>
  );
}
