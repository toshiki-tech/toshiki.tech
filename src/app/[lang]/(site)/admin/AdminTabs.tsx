'use client';

import { useEffect, useState, type ReactNode } from 'react';

export interface AdminTab {
  id: string;
  label: string;
  /** Items waiting for action (shown as a badge) */
  badge?: number;
  content: ReactNode;
}

/**
 * Top-level tabs of the admin page. All tabs stay mounted (hidden with CSS) so switching
 * keeps forms and loaded panels; the active tab lives in the URL hash (#analytics) so a
 * reload or a shared link lands on the same tab without a server round trip.
 */
export default function AdminTabs({ tabs }: { tabs: AdminTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      if (tabs.some((t) => t.id === id)) { setActive(id); return; }
      // An anchor inside a tab (e.g. #pending-file-updates): open that tab, then scroll to it
      const target = document.getElementById(id);
      const owner = target?.closest<HTMLElement>('[data-admin-tab]')?.dataset.adminTab;
      if (owner) {
        setActive(owner);
        requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [tabs]);

  function select(id: string) {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  }

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-6 px-6 lg:-mx-8 lg:px-8 mb-8 bg-[var(--background)]/90 backdrop-blur border-b border-[var(--border)]">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                active === t.id
                  ? 'border-[rgb(var(--accent))] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {t.label}
              {!!t.badge && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] leading-5 text-center tabular-nums">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      {tabs.map((t) => (
        <div key={t.id} data-admin-tab={t.id} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
