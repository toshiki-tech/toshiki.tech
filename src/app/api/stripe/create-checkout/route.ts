import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { listBillingSubscriptions } from '@/lib/stripe-subscriptions';
import { getPriceId, getPlanMode, isValidProduct, isValidPlan, type ProductKey } from '@/lib/stripe-products';
import { extractBearerToken, getUserFromBearer } from '@/lib/supabase-bearer';
import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  // 1. Auth — Bearer token required
  const token = extractBearerToken(request);
  const user = await getUserFromBearer(token);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  // 2. Parse body
  let body: { product?: string; plan?: string; success_url?: string; cancel_url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
  }

  const { product, plan, success_url, cancel_url } = body;

  if (!product || !plan || !success_url || !cancel_url) {
    return NextResponse.json(
      { error: 'Required fields: product, plan, success_url, cancel_url' },
      { status: 400, headers: CORS }
    );
  }

  if (!isValidProduct(product)) {
    return NextResponse.json({ error: `Unknown product: ${product}` }, { status: 400, headers: CORS });
  }
  if (!isValidPlan(product as ProductKey, plan)) {
    return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400, headers: CORS });
  }

  const svc = serviceClient();

  // 3. A lifetime owner has nothing left to buy for this product
  const { data: currentSub } = await svc
    .from('toshiki_tech_subscriptions')
    .select('status, is_lifetime')
    .eq('user_id', user.id)
    .eq('product', product)
    .maybeSingle();
  if (currentSub?.is_lifetime && currentSub.status === 'active') {
    return NextResponse.json(
      { error: 'You already own lifetime access.', code: 'already_lifetime' },
      { status: 409, headers: CORS }
    );
  }

  // 4. Get or create Stripe Customer (one per user, shared across all products)
  let stripeCustomerId: string;
  const { data: existing } = await svc
    .from('toshiki_tech_stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.stripe_customer_id) {
    stripeCustomerId = existing.stripe_customer_id;
  } else {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    const { error: insertError } = await svc.from('toshiki_tech_stripe_customers').insert({
      user_id: user.id,
      stripe_customer_id: customer.id,
    });
    if (insertError) {
      // A concurrent request may have stored a customer first: use that one, so
      // the user never ends up split across two Stripe customers.
      const { data: stored } = await svc
        .from('toshiki_tech_stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!stored?.stripe_customer_id) {
        console.error('[create-checkout] Failed to store Stripe customer:', insertError);
        await getStripe().customers.del(customer.id).catch(() => {});
        return NextResponse.json({ error: 'Failed to prepare checkout' }, { status: 500, headers: CORS });
      }
      await getStripe().customers.del(customer.id).catch(() => {});
      stripeCustomerId = stored.stripe_customer_id;
    } else {
      stripeCustomerId = customer.id;
    }
  }

  // 5. Refuse a second purchase while a subscription still bills this customer.
  //    Stripe is checked rather than our table, which can lag behind or point at
  //    a different subscription. The customer is shared across products, so only
  //    this product's subscriptions count (ones without metadata are ours too).
  const billing = (await listBillingSubscriptions(stripeCustomerId)).filter(
    (sub) => !sub.metadata?.product || sub.metadata.product === product
  );
  if (billing.length > 0) {
    return NextResponse.json(
      {
        error: 'You already have a subscription. Manage it from the subscription settings instead of buying again.',
        code: 'already_subscribed',
      },
      { status: 409, headers: CORS }
    );
  }

  // 6. Close checkout pages opened earlier but never paid, so two tabs (or a
  //    double tap) cannot both complete into separate subscriptions.
  const openSessions = await getStripe().checkout.sessions.list({
    customer: stripeCustomerId,
    status: 'open',
    limit: 100,
  });
  await Promise.all(
    openSessions.data.map((session) => getStripe().checkout.sessions.expire(session.id).catch(() => {}))
  );

  // 7. Create Checkout Session
  const mode = getPlanMode(product as ProductKey, plan);
  const priceId = getPriceId(product as ProductKey, plan);
  const metadata = { supabase_user_id: user.id, product, plan };

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: stripeCustomerId,
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url,
    cancel_url,
    metadata,
    ...(mode === 'subscription' && {
      subscription_data: { metadata },
    }),
  };

  const session = await getStripe().checkout.sessions.create(sessionParams);

  return NextResponse.json({ data: { url: session.url } }, { headers: CORS });
}
