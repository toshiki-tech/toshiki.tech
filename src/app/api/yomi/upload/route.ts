import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );
}

/**
 * Create database record for an upload.
 * The actual file upload happens on the client side directly to Supabase Storage.
 */
export async function POST(request: Request) {
  const supabase = getSupabase();

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure profile exists
  const { error: profileError } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .upsert({
      id: user.id,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    }, { onConflict: 'id', ignoreDuplicates: true });
  if (profileError) {
    console.error('Profile upsert error:', profileError);
  }

  const body = await request.json();
  const {
    uploadId,
    storagePath,
    fileName,
    isZip,
    title,
    description,
    contentType,
    visibility,
    category,
    language,
    translationLanguage,
    sourcePlatform,
    sourceShow,
    sourceEpisode,
  } = body;

  if (!uploadId || !storagePath || !fileName || !title || !contentType || !language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (contentType === 'third_party' && (!sourcePlatform || !sourceShow)) {
    return NextResponse.json({ error: 'Source info required for third-party content' }, { status: 400 });
  }

  // Determine status: third_party auto-approved; original zip goes to pending review
  const status = contentType === 'third_party' || !isZip ? 'approved' : 'pending';

  // Insert database record
  const { data: upload, error: dbError } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .insert({
      id: uploadId,
      user_id: user.id,
      title,
      description: description || null,
      content_type: contentType,
      visibility: visibility || 'public',
      status,
      source_platform: sourcePlatform || null,
      source_show: sourceShow || null,
      source_episode: sourceEpisode || null,
      category: category || null,
      yomi_storage_path: storagePath,
      audio_storage_path: null,
      yomi_file_name: fileName,
      audio_file_name: null,
      language,
      translation_language: translationLanguage || null,
    })
    .select()
    .single();

  if (dbError) {
    console.error('DB insert error:', dbError);
    // Clean up storage
    await supabase.storage.from('toshiki-tech-yomi-files').remove([storagePath]);
    return NextResponse.json({ error: 'Failed to create upload record' }, { status: 500 });
  }

  return NextResponse.json({ id: upload.id, status: upload.status });
}
