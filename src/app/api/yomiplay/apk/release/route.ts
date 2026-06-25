import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSessionClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  // Auth: must be logged-in admin
  const session = getSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await session
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  let body: {
    versionCode?: number;
    versionName?: string;
    r2Path?: string;
    releaseNotes?: string;
    apkSha256?: string;
    fileSize?: number;
    minSupportedVersionCode?: number;
    forceUpdate?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { versionCode, versionName, r2Path, releaseNotes } = body;
  if (!versionCode || !versionName || !r2Path || !releaseNotes) {
    return NextResponse.json(
      { error: 'Required: versionCode, versionName, r2Path, releaseNotes' },
      { status: 400 }
    );
  }

  const svc = serviceClient();

  // Verify version_code is strictly higher than current latest
  const { data: latest } = await svc
    .from('yomiplay_apk_releases')
    .select('version_code')
    .order('version_code', { ascending: false })
    .limit(1)
    .single();

  if (latest && versionCode <= latest.version_code) {
    return NextResponse.json(
      { error: `versionCode must be greater than current latest (${latest.version_code})` },
      { status: 400 }
    );
  }

  const { data, error } = await svc
    .from('yomiplay_apk_releases')
    .insert({
      version_code:               versionCode,
      version_name:               versionName,
      r2_path:                    r2Path,
      release_notes:              releaseNotes,
      apk_sha256:                 body.apkSha256  ?? '',
      file_size:                  body.fileSize   ?? null,
      min_supported_version_code: body.minSupportedVersionCode ?? 1,
      force_update:               body.forceUpdate ?? false,
      is_active:                  true,
    })
    .select('id, version_code, version_name')
    .single();

  if (error) {
    console.error('[apk/release]', error);
    return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.toshiki.tech';

  return NextResponse.json({
    data: {
      id:          data.id,
      versionCode: data.version_code,
      versionName: data.version_name,
      latestUrl:   `${siteUrl}/api/yomiplay/apk/latest`,
      downloadUrl: `${siteUrl}/api/yomiplay/apk/download`,
    },
  }, { status: 201 });
}
