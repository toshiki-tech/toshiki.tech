import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';
import { FEATURE_FLAG_KEYS, isFeatureFlagKey } from '@/lib/yomi-feature-flags';

export async function GET() {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('toshiki_tech_yomi_feature_flags')
    .select('key, enabled, updated_at')
    .in('key', FEATURE_FLAG_KEYS as unknown as string[]);

  if (error) {
    console.error('Feature flags read error:', error);
    return NextResponse.json({ error: 'Failed to read flags' }, { status: 500 });
  }
  return NextResponse.json({ flags: data || [] });
}

export async function PATCH(request: Request) {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { key, enabled } = body as { key?: string; enabled?: boolean };

  if (!key || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Missing key or enabled' }, { status: 400 });
  }
  if (!isFeatureFlagKey(key)) {
    return NextResponse.json({ error: `Unknown flag: ${key}` }, { status: 400 });
  }

  const { error } = await supabase
    .from('toshiki_tech_yomi_feature_flags')
    .upsert(
      { key, enabled, updated_by: admin.id },
      { onConflict: 'key' }
    );

  if (error) {
    console.error('Feature flags upsert error:', error);
    return NextResponse.json({ error: 'Failed to update flag' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
