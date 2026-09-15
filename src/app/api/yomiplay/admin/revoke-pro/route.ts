import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';

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

  const { userId, product } = await request.json();
  if (!userId || !product) {
    return NextResponse.json({ error: 'Required: userId, product' }, { status: 400 });
  }

  const svc = serviceClient();

  const { data: sub, error: readError } = await svc
    .from('toshiki_tech_subscriptions')
    .select('stripe_subscription_id, is_lifetime')
    .eq('user_id', userId)
    .eq('product', product)
    .maybeSingle();
  if (readError) {
    return NextResponse.json({ error: 'Failed to read subscription' }, { status: 500 });
  }

  // Stop the billing first. Revoking only in our table used to leave Stripe
  // charging every month for a subscription that no longer gave Pro. If Stripe
  // refuses, nothing is changed here, so the admin can retry.
  // Lifetime purchases are one-off payments: there is nothing to cancel, and a
  // refund has to be issued from the Stripe Dashboard.
  let stripeCanceled = false;
  if (sub?.stripe_subscription_id && !sub.is_lifetime) {
    try {
      const stripeSub = await getStripe().subscriptions.retrieve(sub.stripe_subscription_id);
      if (stripeSub.status !== 'canceled' && stripeSub.status !== 'incomplete_expired') {
        await getStripe().subscriptions.cancel(sub.stripe_subscription_id);
        stripeCanceled = true;
      }
    } catch (err) {
      console.error('[revoke-pro] Stripe cancel failed:', err);
      return NextResponse.json(
        { error: 'Could not cancel the Stripe subscription; Pro was not revoked.' },
        { status: 502 }
      );
    }
  }

  const { error: updateError } = await svc
    .from('toshiki_tech_subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('product', product);

  const { error: profileError } = product === 'yomiplay'
    ? await svc.from('toshiki_tech_yomi_profiles').update({ is_pro: false }).eq('id', userId)
    : { error: null };

  if (updateError || profileError) {
    console.error('[revoke-pro] DB update failed:', updateError ?? profileError);
    return NextResponse.json(
      {
        error: stripeCanceled
          ? 'Stripe subscription was canceled, but updating the database failed. Reload and retry.'
          : 'Failed to revoke Pro',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, stripeCanceled, isLifetime: sub?.is_lifetime === true });
}
