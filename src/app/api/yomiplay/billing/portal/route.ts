import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { extractBearerToken, getUserFromBearer } from '@/lib/supabase-bearer';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.toshiki.tech';

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
  // Auth: Bearer token for Android App, cookie session for web
  let userId: string | null = null;

  const token = extractBearerToken(request);
  if (token) {
    const user = await getUserFromBearer(token);
    userId = user?.id ?? null;
  } else {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        '',
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  // Get Stripe customer ID
  const svc = serviceClient();
  const { data: customer } = await svc
    .from('toshiki_tech_stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (!customer?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No billing account found. Your subscription may have been managed outside Stripe.' },
      { status: 404, headers: CORS }
    );
  }

  // Parse optional return_url from body
  let returnUrl = `${SITE_URL}/en/yomiplay/pricing`;
  try {
    const body = await request.json();
    if (typeof body?.return_url === 'string' && body.return_url.startsWith('https://')) {
      returnUrl = body.return_url;
    }
  } catch {
    // no body — use default
  }

  // Create Customer Portal session
  const session = await getStripe().billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: returnUrl,
  });

  return NextResponse.json({ data: { url: session.url } }, { headers: CORS });
}
