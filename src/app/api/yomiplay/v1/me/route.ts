import { NextResponse } from 'next/server';
import { extractBearerToken, getUserFromBearer, getAnonClient } from '@/lib/supabase-bearer';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const token = extractBearerToken(request);
  const user = await getUserFromBearer(token);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });
  }

  const supabase = getAnonClient();

  // Query the unified subscriptions table for this user + product
  const { data: sub } = await supabase
    .from('toshiki_tech_subscriptions')
    .select('plan, status, current_period_end, is_lifetime, updated_at')
    .eq('user_id', user.id)
    .eq('product', 'yomiplay')
    .single();

  const now = new Date();
  const isPro = !!sub && (
    sub.is_lifetime === true ||
    (sub.status === 'active' &&
      (sub.current_period_end == null || new Date(sub.current_period_end) > now))
  );

  return NextResponse.json(
    {
      data: {
        user_id:             user.id,
        is_pro:              isPro,
        plan:                sub?.plan            ?? null,
        status:              sub?.status          ?? null,
        current_period_end:  sub?.current_period_end ?? null,
        is_lifetime:         sub?.is_lifetime     ?? false,
        updated_at:          sub?.updated_at      ?? null,
      },
    },
    { headers: CORS }
  );
}
