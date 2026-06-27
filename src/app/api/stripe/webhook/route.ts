import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Raw body needed for Stripe signature verification — do not use Next.js body parser
export const dynamic = 'force-dynamic';

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── DB helpers ──────────────────────────────────────────────────────────────

interface UpsertParams {
  userId: string;
  product: string;
  plan: string;
  status: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  currentPeriodEnd?: string;
  isLifetime?: boolean;
}

async function upsertSubscription(svc: SupabaseClient, p: UpsertParams) {
  await svc.from('toshiki_tech_subscriptions').upsert(
    {
      user_id:                   p.userId,
      product:                   p.product,
      plan:                      p.plan,
      status:                    p.status,
      stripe_customer_id:        p.stripeCustomerId,
      stripe_subscription_id:    p.stripeSubscriptionId   ?? null,
      stripe_payment_intent_id:  p.stripePaymentIntentId  ?? null,
      current_period_end:        p.currentPeriodEnd       ?? null,
      is_lifetime:               p.isLifetime             ?? false,
      updated_at:                new Date().toISOString(),
    },
    { onConflict: 'user_id,product' }
  );
}

/**
 * Sync Pro status back into the product-specific profile table.
 * Add a new branch here when you add a new product.
 */
async function syncProStatus(svc: SupabaseClient, userId: string, product: string, isPro: boolean) {
  if (product === 'yomiplay') {
    await svc
      .from('toshiki_tech_yomi_profiles')
      .upsert({ id: userId, is_pro: isPro }, { onConflict: 'id', ignoreDuplicates: false });
  }
  // yominote:
  // if (product === 'yominote') { ... }
}

function isSubscriptionActive(status: string) {
  return status === 'active' || status === 'trialing';
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleCheckoutCompleted(svc: SupabaseClient, session: Stripe.Checkout.Session) {
  const { supabase_user_id, product, plan } = session.metadata ?? {};
  if (!supabase_user_id || !product || !plan) return;

  if (session.mode === 'subscription' && session.subscription) {
    const sub = await getStripe().subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;
    await upsertSubscription(svc, {
      userId:               supabase_user_id,
      product,
      plan,
      status:               'active',
      stripeCustomerId:     session.customer as string,
      stripeSubscriptionId: sub.id,
      currentPeriodEnd:     sub.items.data[0]
                              ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
                              : undefined,
      isLifetime:           false,
    });
    await syncProStatus(svc, supabase_user_id, product, true);
  }

  if (session.mode === 'payment' && plan === 'lifetime') {
    await upsertSubscription(svc, {
      userId:                  supabase_user_id,
      product,
      plan:                    'lifetime',
      status:                  'active',
      stripeCustomerId:        session.customer as string,
      stripePaymentIntentId:   session.payment_intent as string,
      isLifetime:              true,
    });
    await syncProStatus(svc, supabase_user_id, product, true);
  }
}

async function handleSubscriptionChange(svc: SupabaseClient, sub: Stripe.Subscription) {
  // Look up our record via stripe_subscription_id (more reliable than metadata)
  const { data: dbSub } = await svc
    .from('toshiki_tech_subscriptions')
    .select('user_id, product, is_lifetime')
    .eq('stripe_subscription_id', sub.id)
    .single();

  if (!dbSub) return; // not ours

  // Never downgrade a lifetime user through subscription events
  if (dbSub.is_lifetime) return;

  const active = isSubscriptionActive(sub.status);
  await svc
    .from('toshiki_tech_subscriptions')
    .update({
      status:                sub.status,
      cancel_at_period_end:  sub.cancel_at_period_end ?? false,
      current_period_end:    sub.items.data[0]
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : undefined,
      updated_at:            new Date().toISOString(),
    })
    .eq('stripe_subscription_id', sub.id);

  await syncProStatus(svc, dbSub.user_id, dbSub.product, active);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const svc = serviceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(svc, event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(svc, event.data.object as Stripe.Subscription);
        break;

      // invoice.payment_succeeded: current_period_end is already updated by
      // customer.subscription.updated which fires at the same time. No extra work needed.

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Return 200 so Stripe doesn't keep retrying transient errors.
    // Real idempotency bugs should be fixed in the handler above.
  }

  return NextResponse.json({ received: true });
}
