import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const APK_DOWNLOAD_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.toshiki.tech'}/api/yomiplay/apk/download`;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      ''
  );

  const { data, error } = await supabase
    .from('yomiplay_apk_releases')
    .select('version_code, version_name, apk_sha256, file_size, release_notes, min_supported_version_code, force_update')
    .eq('is_active', true)
    .order('version_code', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No release available' }, { status: 404, headers: CORS });
  }

  // Return the same shape as /public/yomiplay/android-version.json
  return NextResponse.json(
    {
      versionCode:              data.version_code,
      versionName:              data.version_name,
      apkUrl:                   APK_DOWNLOAD_URL,
      fileSize:                 data.file_size,
      releaseNotes:             data.release_notes,
      minSupportedVersionCode:  data.min_supported_version_code,
      forceUpdate:              data.force_update,
      apkSha256:                data.apk_sha256,
    },
    { headers: CORS }
  );
}
