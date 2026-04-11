import { NextResponse } from 'next/server';
import { getSupabase, requireAdmin, awardPoints } from '@/lib/supabase-server-api';

export async function POST(request: Request) {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { uploadId, action } = await request.json();
  if (!uploadId || !['approved', 'rejected'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Get upload info before updating
  const { data: upload } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('user_id, yomi_storage_path')
    .eq('id', uploadId)
    .single();

  const { error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .update({ status: action })
    .eq('id', uploadId);

  if (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }

  // Award points on approval
  if (action === 'approved' && upload) {
    const isZip = upload.yomi_storage_path?.startsWith('zip/');
    const configKey = isZip ? 'upload_zip' : 'upload_yomi';

    const { data: config } = await supabase
      .from('toshiki_tech_yomi_points_config')
      .select('value')
      .eq('key', configKey)
      .single();

    const points = config?.value || (isZip ? 20 : 10);
    await awardPoints(supabase, upload.user_id, configKey, points, `Upload approved: ${uploadId}`);
  }

  return NextResponse.json({ success: true });
}
