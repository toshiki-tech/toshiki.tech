import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

    // The app reads Pro from the subscriptions table (/api/yomiplay/v1/me), not from
    // profiles.is_pro — without this row a redeemed user was still Free in the app.
    // A live Stripe row already gives Pro and must keep its Stripe ids, so leave it alone.
    const svc = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: existing } = await svc
      .from('toshiki_tech_subscriptions')
      .select('source, status')
      .eq('user_id', proRequest.user_id)
      .eq('product', 'yomiplay')
      .maybeSingle();
    if (!(existing?.source === 'stripe' && existing.status !== 'canceled')) {
      const { error: subError } = await svc.from('toshiki_tech_subscriptions').upsert(
        {
          user_id:                  proRequest.user_id,
          product:                  'yomiplay',
          plan:                     'lifetime',
          status:                   'active',
          source:                   'points',
          granted_by:               admin.id,
          note:                     `Points redemption (-${threshold})`,
          stripe_customer_id:       null,
          stripe_subscription_id:   null,
          stripe_payment_intent_id: null,
          current_period_end:       null,
          is_lifetime:              true,
          cancel_at_period_end:     false,
          updated_at:               new Date().toISOString(),
        },
        { onConflict: 'user_id,product' }
      );
      if (subError) {
        console.error('[pro-review] subscription upsert failed:', subError);
        return NextResponse.json({ error: 'Approved, but writing the subscription failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true });
}
