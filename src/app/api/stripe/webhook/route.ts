import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { subscriptionIdForCharge } from '@/lib/stripe-subscriptions';
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

/**
 * Throws when a Supabase write failed. A handler that throws makes the route
 * answer 500, so Stripe retries the event instead of it being lost silently.
 */
function must<T extends { error: { message: string } | null }>(result: T, context: string): T {
  if (result.error) throw new Error(`${context}: ${result.error.message}`);
  return result;
}

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
  must(await svc.from('toshiki_tech_subscriptions').upsert(
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
  ), 'upsert subscription');
}

/**
 * Sync Pro status back into the product-specific profile table.
 * Add a new branch here when you add a new product.
 */
async function syncProStatus(svc: SupabaseClient, userId: string, product: string, isPro: boolean) {
  if (product === 'yomiplay') {
    must(
      await svc
        .from('toshiki_tech_yomi_profiles')
        .upsert({ id: userId, is_pro: isPro }, { onConflict: 'id', ignoreDuplicates: false }),
      'sync yomiplay is_pro'
    );
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

async function handleChargeRefunded(svc: SupabaseClient, charge: Stripe.Charge) {
  // Only act on full refunds — partial refunds don't necessarily mean access should end
  if (!charge.refunded) return;

  // Lifetime purchase: the charge's PaymentIntent is the one stored on the row
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (paymentIntentId) {
    const { data: lifetime } = must(
      await svc
        .from('toshiki_tech_subscriptions')
        .select('user_id, product')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .maybeSingle(),
      'find lifetime purchase'
    );
    if (lifetime) {
      await cancelSubscriptionRow(svc, lifetime.user_id, lifetime.product);
      return;
    }
  }

  // Subscription invoice: only the subscription this charge paid for is affected.
  // Other subscriptions of the same customer (another product, or a duplicate
  // that is still billing) keep their state.
  const subscriptionId = await subscriptionIdForCharge(charge);
  if (!subscriptionId) return;

  // A fully refunded subscription gives no access, so it must stop billing too —
  // otherwise the customer keeps paying every month without Pro. Stripe then
  // sends customer.subscription.deleted, which also lands in the handler below.
  const stripeSub = await getStripe().subscriptions.retrieve(subscriptionId);
  if (stripeSub.status !== 'canceled' && stripeSub.status !== 'incomplete_expired') {
    await getStripe().subscriptions.cancel(subscriptionId);
  }

  const { data: row } = must(
    await svc
      .from('toshiki_tech_subscriptions')
      .select('user_id, product, is_lifetime')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle(),
    'find refunded subscription'
  );
  // Never downgrade a lifetime user through a subscription refund
  if (row && !row.is_lifetime) {
    await cancelSubscriptionRow(svc, row.user_id, row.product);
  }
}

async function cancelSubscriptionRow(svc: SupabaseClient, userId: string, product: string) {
  must(
    await svc
      .from('toshiki_tech_subscriptions')
      .update({ status: 'canceled', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('product', product),
    'cancel subscription row'
  );
  await syncProStatus(svc, userId, product, false);
}

async function handleSubscriptionChange(svc: SupabaseClient, sub: Stripe.Subscription) {
  // Look up our record via stripe_subscription_id (more reliable than metadata)
  const { data: dbSub } = must(
    await svc
      .from('toshiki_tech_subscriptions')
      .select('user_id, product, is_lifetime')
      .eq('stripe_subscription_id', sub.id)
      .maybeSingle(),
    'find subscription'
  );

  if (!dbSub) return; // not ours

  // Never downgrade a lifetime user through subscription events
  if (dbSub.is_lifetime) return;

  const active = isSubscriptionActive(sub.status);
  must(await svc
    .from('toshiki_tech_subscriptions')
    .update({
      status:                sub.status,
      cancel_at_period_end:  sub.cancel_at_period_end ?? false,
      current_period_end:    sub.items.data[0]
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : undefined,
      updated_at:            new Date().toISOString(),
    })
    .eq('stripe_subscription_id', sub.id), 'update subscription');

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

      case 'charge.refunded':
        await handleChargeRefunded(svc, event.data.object as Stripe.Charge);
        break;

      // invoice.payment_succeeded: current_period_end is already updated by
      // customer.subscription.updated which fires at the same time. No extra work needed.

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    // Answer 500 so Stripe retries the event (with backoff, for up to three days).
    // Swallowing errors here is how a paid subscription ended up without Pro.
    // Every handler is safe to run again for the same event.
    console.error(`[webhook] Error handling ${event.type} (${event.id}):`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
