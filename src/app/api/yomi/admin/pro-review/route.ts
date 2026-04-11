import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin, awardPoints } from '@/lib/supabase-server-api';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { requestId, action, adminNote } = await request.json();
  if (!requestId || !action) {
    return NextResponse.json({ error: 'Missing requestId or action' }, { status: 400 });
  }

  // Get the request
  const { data: proRequest } = await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (!proRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  // Update request status
  await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .update({
      status: action, // 'approved' or 'rejected'
      admin_note: adminNote || null,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (action === 'approved') {
    // Get threshold to deduct points
    const { data: config } = await supabase
      .from('toshiki_tech_yomi_points_config')
      .select('value')
      .eq('key', 'pro_threshold')
      .single();

    const threshold = config?.value || 500;

    // Set user as Pro and deduct points
    const { data: profile } = await supabase
      .from('toshiki_tech_yomi_profiles')
      .select('points')
      .eq('id', proRequest.user_id)
      .single();

    await supabase
      .from('toshiki_tech_yomi_profiles')
      .update({
        is_pro: true,
        points: Math.max(0, (profile?.points || 0) - threshold),
      })
      .eq('id', proRequest.user_id);

    // Log the deduction
    await awardPoints(supabase, proRequest.user_id, 'pro_redemption', -threshold, 'Redeemed for Pro membership');
  }

  return NextResponse.json({ success: true });
}
