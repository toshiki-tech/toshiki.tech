/** The fields of a toshiki_tech_subscriptions row that decide Pro access */
export interface ProRow {
  status: string;
  is_lifetime: boolean | null;
  current_period_end: string | null;
}

/**
 * Whether a subscriptions row gives Pro right now. The subscriptions table is the
 * source of truth; profiles.is_pro is only a mirror and is never cleared when a
 * manual grant runs out. A revoked or refunded row is 'canceled' even when it is
 * lifetime, so status is checked first.
 */
export function isProActive(sub: ProRow | null | undefined, now = new Date()): boolean {
  if (!sub || sub.status !== 'active') return false;
  if (sub.is_lifetime) return true;
  return sub.current_period_end == null || new Date(sub.current_period_end) > now;
}
