import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';
import {
  getAppConfig,
  getAppTextConfig,
  isAppConfigKey,
  isAppTextConfigKey,
  isValidAppConfigValue,
  normalizeAppTextConfigValue,
} from '@/lib/yomi-app-config';

// Admin: read / change the app config (free-tier limits, podcast search term). Writes use the service role
// (the table is public-read only).
function svc() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET() {
  const admin = await requireAdmin(getSupabase());
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const client = svc();
  const [config, text] = await Promise.all([getAppConfig(client), getAppTextConfig(client)]);
  return NextResponse.json({ data: { ...config, ...text } }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(getSupabase());
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { key, value } = await request.json().catch(() => ({}));
  if (typeof key === 'string' && isAppTextConfigKey(key)) {
    const text = normalizeAppTextConfigValue(key, value);
    if (!text) return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    const { error } = await svc()
      .from('yomiplay_app_config')
      .upsert({ key, value: null, text_value: text, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  const n = Number(value);
  if (typeof key !== 'string' || !isAppConfigKey(key) || !isValidAppConfigValue(key, n)) {
    return NextResponse.json({ error: 'Invalid key or value' }, { status: 400 });
  }
  const { error } = await svc()
    .from('yomiplay_app_config')
    .upsert({ key, value: n, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
