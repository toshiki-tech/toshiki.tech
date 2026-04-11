import { NextResponse } from 'next/server';
import { getSupabase, getAuthUser, awardPoints } from '@/lib/supabase-server-api';

export async function POST() {
  const supabase = getSupabase();
  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if already claimed today (count to be safe against race conditions)
  const today = new Date().toISOString().split('T')[0];
  const { count } = await supabase
    .from('toshiki_tech_yomi_points_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action', 'daily_login')
    .gte('created_at', `${today}T00:00:00Z`)
    .lte('created_at', `${today}T23:59:59Z`);

  if ((count || 0) > 0) {
    return NextResponse.json({ already_claimed: true });
  }

  // Get config value
  const { data: config } = await supabase
    .from('toshiki_tech_yomi_points_config')
    .select('value')
    .eq('key', 'daily_login')
    .single();

  const points = config?.value || 2;
  await awardPoints(supabase, user.id, 'daily_login', points, 'Daily login bonus');

  return NextResponse.json({ points_earned: points });
}
