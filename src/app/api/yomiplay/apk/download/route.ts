import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDownloadPresignedUrl } from '@/lib/r2';

export const dynamic = 'force-dynamic';

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const svc = serviceClient();

  // Fetch latest active release
  const { data: release, error } = await svc
    .from('yomiplay_apk_releases')
    .select('id, version_code, version_name, r2_path')
    .eq('is_active', true)
    .order('version_code', { ascending: false })
    .limit(1)
    .single();

  if (error || !release) {
    return NextResponse.json({ error: 'No release available' }, { status: 404 });
  }

  // Record download (fire-and-forget — don't block the redirect on this)
  const ua = request.headers.get('user-agent') ?? null;
  svc.from('yomiplay_apk_downloads').insert({
    version_code:  release.version_code,
    version_name:  release.version_name,
    user_agent:    ua,
  }).then(({ error: e }) => {
    if (e) console.error('[apk/download] log error:', e);
  });

  // Generate short-lived presigned URL and redirect
  try {
    const fileName = release.r2_path.split('/').pop() ?? 'yomiplay.apk';
    const url = await getDownloadPresignedUrl(release.r2_path, fileName, 600);
    return NextResponse.redirect(url, { status: 302 });
  } catch (err) {
    console.error('[apk/download] R2 presign error:', err);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
