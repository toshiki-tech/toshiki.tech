import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
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

  // 3. Get or create Stripe Customer (one per user, shared across all products)
  let stripeCustomerId: string;
  const { data: existing } = await svc
    .from('toshiki_tech_stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (existing?.stripe_customer_id) {
    stripeCustomerId = existing.stripe_customer_id;
  } else {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = customer.id;
    await svc.from('toshiki_tech_stripe_customers').insert({
      user_id: user.id,
      stripe_customer_id: stripeCustomerId,
    });
  }

  // 4. Create Checkout Session
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
