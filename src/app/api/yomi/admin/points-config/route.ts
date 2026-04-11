import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';

export async function GET() {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('toshiki_tech_yomi_points_config')
    .select('*')
    .order('key');

  if (error) return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { key, value } = await request.json();
  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
  }

  const { error } = await supabase
    .from('toshiki_tech_yomi_points_config')
    .update({ value: parseInt(value) })
    .eq('key', key);

  if (error) return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  return NextResponse.json({ success: true });
}
