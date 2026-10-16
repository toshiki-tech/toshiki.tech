'use client';

import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';

/** Panels that load their own data (e.g. App Usage) listen for this to reload too. */
export const ADMIN_REFRESH_EVENT = 'admin:refresh';

/**
 * Re-runs the admin page's server queries via router.refresh() instead of reloading the page,
 * so scroll position, open forms and inputs are kept. Used by the floating button and after
 * every admin action.
 */
export function useAdminRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    window.dispatchEvent(new Event(ADMIN_REFRESH_EVENT));
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  return { refresh, pending };
}
