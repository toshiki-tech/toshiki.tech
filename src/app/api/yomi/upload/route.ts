import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serializeTranslationLanguages, type FileKindId } from '@/lib/yomi-constants';

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
    fileKind: rawFileKind,
    audioStoragePath,
    audioFileName,
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
    sourceUrl,
  } = body;

  // Uploads predating memorization decks send no fileKind at all.
  const fileKind: FileKindId = rawFileKind === 'yomibook' ? 'yomibook' : 'yomi';
  const isDeck = fileKind === 'yomibook';

  if (!uploadId || !storagePath || !fileName || !title || !contentType || !language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // A deck is always the uploader's own work: it is exported from their own
  // library, so third-party sourcing does not apply to it.
  if (isDeck && contentType !== 'original') {
    return NextResponse.json(
      { error: 'Decks must be uploaded as original content' },
      { status: 400 }
    );
  }

  if (isDeck && !storagePath.startsWith('yomibook/')) {
    return NextResponse.json({ error: 'Deck file was not uploaded as a deck' }, { status: 400 });
  }

  if (contentType === 'third_party' && (!sourcePlatform || !sourceShow)) {
    return NextResponse.json({ error: 'Source info required for third-party content' }, { status: 400 });
  }

  // Bundled media is only allowed for original content (avoids redistributing
  // copyrighted third-party audio/video).
  if (audioStoragePath && contentType !== 'original') {
    return NextResponse.json(
      { error: 'Bundled media is only allowed for original content' },
      { status: 400 }
    );
  }

  // Determine status: decks always wait for a human, since their contents are
  // opaque here. Otherwise third_party is auto-approved, and anything bundling
  // media (zip or .yomi + separate media file) goes to pending review.
  const hasBundledMedia = isZip || !!audioStoragePath;
  const status = isDeck
    ? 'pending'
    : contentType === 'third_party' || !hasBundledMedia
      ? 'approved'
      : 'pending';

  // Translation languages arrive as a comma-separated string (primary first)
  // or as an array; store them normalized in the single text column.
  const normalizedTranslationLanguages = serializeTranslationLanguages(
    Array.isArray(translationLanguage)
      ? translationLanguage
      : String(translationLanguage || '').split(',')
  );

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
      source_url: sourceUrl || null,
      category: category || null,
      yomi_storage_path: storagePath,
      audio_storage_path: audioStoragePath || null,
      yomi_file_name: fileName,
      audio_file_name: audioFileName || null,
      language,
      translation_language: normalizedTranslationLanguages,
      file_kind: fileKind,
    })
    .select()
    .single();

  if (dbError) {
    console.error('DB insert error:', dbError);
    // Clean up any uploaded files
    const cleanup = [storagePath];
    if (audioStoragePath) cleanup.push(audioStoragePath);
    await supabase.storage.from('toshiki-tech-yomi-files').remove(cleanup);
    return NextResponse.json({ error: 'Failed to create upload record' }, { status: 500 });
  }

  return NextResponse.json({ id: upload.id, status: upload.status });
}
