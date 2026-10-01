import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isProActive } from '@/lib/pro-status';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DURATIONS = ['month', 'year', 'lifetime', 'until'] as const;
type Duration = (typeof DURATIONS)[number];

function getSessionClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function addMonths(from: Date, months: number) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Grant Pro to a user by hand (gifts, testers, support cases).
 * Writes the unified subscriptions table with source = 'admin', which is what
 * /api/yomiplay/v1/me reads, and mirrors is_pro into the profile for the website.
 */
export async function POST(request: Request) {
  const session = getSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await session
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
  const product = typeof body?.product === 'string' ? body.product : 'yomiplay';
  const duration = body?.duration as Duration;
  const note = typeof body?.note === 'string' && body.note.trim() ? body.note.trim() : null;
  if (!identifier || !DURATIONS.includes(duration)) {
    return NextResponse.json({ error: 'Required: identifier (email or user id), duration' }, { status: 400 });
  }

  const svc = serviceClient();

  // 1. Resolve the user: a UUID is taken as-is, anything else is looked up as an email
  let userId: string | null = null;
  if (UUID_RE.test(identifier)) {
    const { data } = await svc.auth.admin.getUserById(identifier);
    userId = data?.user?.id ?? null;
  } else {
    const { data, error } = await svc.rpc('toshiki_tech_find_user_by_email', { p_email: identifier });
    if (error) {
      console.error('[grant-pro] email lookup failed:', error);
      return NextResponse.json({ error: 'User lookup failed (has manual_pro_grants.sql been run?)' }, { status: 500 });
    }
    userId = (data as string | null) ?? null;
  }
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // 2. Never overwrite a live Stripe subscription: the row holds the Stripe ids that
  //    webhooks match on, so replacing it would orphan the subscription while it keeps billing.
  const { data: existing } = await svc
    .from('toshiki_tech_subscriptions')
    .select('source, status, is_lifetime, current_period_end, stripe_subscription_id')
    .eq('user_id', userId)
    .eq('product', product)
    .maybeSingle();

  const now = new Date();
  const existingActive = isProActive(existing, now);

  if (existing && existing.source === 'stripe' && existing.status !== 'canceled' &&
      (existing.stripe_subscription_id || existing.is_lifetime)) {
    return NextResponse.json(
      { error: 'This user already has a Stripe subscription. Revoke it first if you want to replace it.' },
      { status: 409 }
    );
  }

  // A time-limited grant over an active lifetime one would silently downgrade it
  if (existingActive && existing?.is_lifetime && duration !== 'lifetime') {
    return NextResponse.json(
      { error: 'This user already has lifetime Pro. Revoke it first if you want to give a time-limited grant.' },
      { status: 409 }
    );
  }

  // 3. Work out the new period. Month / year extend an active manual grant instead of resetting it.
  let plan: string;
  let isLifetime = false;
  let periodEnd: string | null = null;
  const base = existingActive && existing?.current_period_end && !existing.is_lifetime
    ? new Date(existing.current_period_end)
    : now;

  switch (duration) {
    case 'month':
      plan = 'monthly';
      periodEnd = addMonths(base, 1).toISOString();
      break;
    case 'year':
      plan = 'yearly';
      periodEnd = addMonths(base, 12).toISOString();
      break;
    case 'lifetime':
      plan = 'lifetime';
      isLifetime = true;
      break;
    case 'until': {
      const until = typeof body?.until === 'string' ? new Date(body.until) : null;
      if (!until || isNaN(until.getTime()) || until <= now) {
        return NextResponse.json({ error: 'until must be a future date' }, { status: 400 });
      }
      plan = 'manual';
      periodEnd = until.toISOString();
      break;
    }
  }

  const { error: upsertError } = await svc.from('toshiki_tech_subscriptions').upsert(
    {
      user_id:                  userId,
      product,
      plan,
      status:                   'active',
      source:                   'admin',
      granted_by:               user.id,
      note,
      stripe_customer_id:       null,
      stripe_subscription_id:   null,
      stripe_payment_intent_id: null,
      current_period_end:       periodEnd,
      is_lifetime:              isLifetime,
      cancel_at_period_end:     false,
      updated_at:               now.toISOString(),
    },
    { onConflict: 'user_id,product' }
  );
  if (upsertError) {
    console.error('[grant-pro] upsert failed:', upsertError);
    return NextResponse.json({ error: 'Failed to grant Pro' }, { status: 500 });
  }

  // Mirror for the website. update (not upsert): profiles.display_name is NOT NULL,
  // and a user who never opened the community has no profile row — that is fine.
  if (product === 'yomiplay') {
    await svc.from('toshiki_tech_yomi_profiles').update({ is_pro: true }).eq('id', userId);
  }

  return NextResponse.json({
    ok: true,
    subscription: {
      user_id: userId,
      product,
      plan,
      status: 'active',
      source: 'admin',
      note,
      current_period_end: periodEnd,
      is_lifetime: isLifetime,
      updated_at: now.toISOString(),
    },
  });
}
