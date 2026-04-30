import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';

const ALLOWED_FIELDS = [
  'title',
  'description',
  'source_platform',
  'source_show',
  'source_episode',
  'language',
  'translation_language',
  'visibility',
  'content_type',
  'category',
  'tags',
  'is_hidden',
  'sort_order',
] as const;

export async function PATCH(request: Request) {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { uploadId, updates } = body as { uploadId?: string; updates?: Record<string, unknown> };

  if (!uploadId || !updates || typeof updates !== 'object') {
    return NextResponse.json({ error: 'Missing uploadId or updates' }, { status: 400 });
  }

  // Whitelist allowed fields only
  const safeUpdates: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in updates) {
      const v = updates[key];
      safeUpdates[key] = v === '' ? null : v;
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
  }

  const { error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .update(safeUpdates)
    .eq('id', uploadId);

  if (error) {
    console.error('Edit upload error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
