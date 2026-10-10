import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';

// Admin-only summary of the anonymous app analytics (supabase/yomiplay_analytics.sql → yomiplay_usage_stats)
export async function GET(request: Request) {
  const admin = await requireAdmin(getSupabase());
  if (!admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const days = Number(new URL(request.url).searchParams.get('days') ?? 7);
  const safeDays = [1, 7, 30, 90].includes(days) ? days : 7;
  const svc = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await svc.rpc('yomiplay_usage_stats', { p_days: safeDays });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store' } });
}
