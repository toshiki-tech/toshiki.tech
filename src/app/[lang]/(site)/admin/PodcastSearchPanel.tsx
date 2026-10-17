'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { APP_TEXT_CONFIG_META } from '@/lib/yomi-app-config';

const KEY = 'podcast_search_default_term';
const META = APP_TEXT_CONFIG_META[KEY];

/**
 * The "Try:" example term on the iOS podcast search page. Only new users see it (once a search
 * succeeds the app shows their own history instead). The app falls back to 日本語 when the
 * server is unreachable.
 */
export default function PodcastSearchPanel({ initialTerm }: { initialTerm: string }) {
  const [saved, setSaved] = useState(initialTerm);
  const [draft, setDraft] = useState(initialTerm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Follow "Refresh data" unless the field is being edited
  useEffect(() => {
    setDraft((prev) => (prev === saved ? initialTerm : prev));
    setSaved(initialTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTerm]);

  async function save() {
    const term = draft.trim();
    if (!term || Array.from(term).length > META.maxLength) {
      setError(`1–${META.maxLength} characters`);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch('/api/yomi/admin/app-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: KEY, value: term }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      setSaved(term);
      setDraft(term);
    } else setError(json.error || res.statusText);
    setBusy(false);
  }

  const changed = draft.trim() !== saved;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Search size={18} />
        Podcast Search (iOS 2.3+)
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        The suggested term new users can tap on the podcast search page. Once they have searched, their own history
        is shown instead. If the server can&rsquo;t be reached the app uses 日本語.
      </p>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="p-4 border border-[var(--border)] rounded-2xl sm:max-w-md">
        <p className="text-sm font-semibold mb-1">{META.label}</p>
        <p className="text-xs text-[var(--muted-foreground)] mb-3">
          Current: {saved} · up to {META.maxLength} characters
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            maxLength={META.maxLength}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={save}
            disabled={!changed || busy}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-[rgb(var(--accent))] text-white disabled:opacity-40"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
          </button>
        </div>
      </div>
    </section>
  );
}
