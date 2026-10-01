import { NextResponse } from 'next/server';
import { getSupabase, getAuthUser } from '@/lib/supabase-server-api';
import { getFeatureFlags } from '@/lib/yomi-feature-flags';
import { isProActive } from '@/lib/pro-status';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const flags = await getFeatureFlags(supabase);
  if (!flags.pro_redemption) {
    return NextResponse.json({ error: 'Pro redemption is currently closed' }, { status: 403 });
  }

  const user = await getAuthUser(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const screenshot = formData.get('screenshot') as File | null;

  // Get user profile
  const { data: profile } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .select('points')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Pro comes from the subscriptions table: profiles.is_pro stays true after a
  // manual grant expires, which would lock that user out of redeeming again
  const { data: sub } = await supabase
    .from('toshiki_tech_subscriptions')
    .select('status, is_lifetime, current_period_end')
    .eq('user_id', user.id)
    .eq('product', 'yomiplay')
    .maybeSingle();
  if (isProActive(sub)) return NextResponse.json({ error: 'Already a Pro member' }, { status: 400 });

  // Check threshold
  const { data: config } = await supabase
    .from('toshiki_tech_yomi_points_config')
    .select('value')
    .eq('key', 'pro_threshold')
    .single();

  const threshold = config?.value || 500;
  if ((profile.points || 0) < threshold) {
    return NextResponse.json({ error: `Need ${threshold} points, you have ${profile.points || 0}` }, { status: 400 });
  }

  // Check for existing pending request
  const { data: existing } = await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'You already have a pending request' }, { status: 400 });
  }

  // Upload screenshot if provided
  let screenshotPath: string | null = null;
  if (screenshot && screenshot.size > 0) {
    const ext = screenshot.name.split('.').pop() || 'png';
    screenshotPath = `pro-screenshots/${user.id}/${Date.now()}.${ext}`;
    const buffer = await screenshot.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('toshiki-tech-yomi-files')
      .upload(screenshotPath, buffer, {
        contentType: screenshot.type || 'image/png',
      });
    if (uploadError) {
      console.error('Screenshot upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 });
    }
  }

  // Create request
  const { error } = await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .insert({
      user_id: user.id,
      points_at_request: profile.points || 0,
      screenshot_path: screenshotPath,
    });

  if (error) {
    console.error('Pro request error:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
