import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getUploadPresignedUrl } from '@/lib/r2';

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

export async function POST(request: Request) {
  const session = getSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  let body: { versionName?: string; releaseId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  let key: string;

  if (body.releaseId) {
    // Replace mode: look up the existing r2_path
    const { data: release } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
      .from('yomiplay_apk_releases')
      .select('r2_path')
      .eq('id', body.releaseId)
      .single();

    if (!release?.r2_path) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }
    key = release.r2_path;
  } else if (body.versionName && typeof body.versionName === 'string') {
    key = `apk/yomiplay-${body.versionName}.apk`;
  } else {
    return NextResponse.json({ error: 'Provide either versionName or releaseId' }, { status: 400 });
  }

  const presignedUrl = await getUploadPresignedUrl(
    key,
    'application/vnd.android.package-archive',
    3600,
  );

  return NextResponse.json({ r2Path: key, presignedUrl });
}
