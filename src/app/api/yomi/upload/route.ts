import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  MAX_YOMI_FILE_SIZE,
  MAX_ZIP_FILE_SIZE,
} from '@/lib/yomi-constants';

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

export async function POST(request: Request) {
  const supabase = getSupabase();

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure profile exists (handles users created before the trigger was added)
  const { error: profileError } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .upsert({
      id: user.id,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    }, { onConflict: 'id', ignoreDuplicates: true });
  if (profileError) {
    console.error('Profile upsert error:', profileError);
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const contentType = formData.get('contentType') as string; // 'original' | 'third_party'
  const visibility = formData.get('visibility') as string || 'public';
  const language = formData.get('language') as string;
  const translationLanguage = formData.get('translationLanguage') as string | null;
  const sourcePlatform = formData.get('sourcePlatform') as string | null;
  const sourceShow = formData.get('sourceShow') as string | null;
  const sourceEpisode = formData.get('sourceEpisode') as string | null;

  if (!file || !title || !contentType || !language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (contentType === 'third_party' && (!sourcePlatform || !sourceShow)) {
    return NextResponse.json({ error: 'Source info required for third-party content' }, { status: 400 });
  }

  const fileName = file.name.toLowerCase();
  const isZip = fileName.endsWith('.zip');

  if (!isZip && !fileName.endsWith('.yomi')) {
    return NextResponse.json({ error: 'Only .zip or .yomi files are accepted' }, { status: 400 });
  }

  if (isZip && file.size > MAX_ZIP_FILE_SIZE) {
    return NextResponse.json({ error: 'ZIP file too large (max 500MB)' }, { status: 400 });
  }

  console.log('Upload file:', { name: file.name, size: file.size, isZip, MAX_YOMI_FILE_SIZE });
  if (!isZip && file.size > MAX_YOMI_FILE_SIZE) {
    return NextResponse.json({ error: `.yomi file too large (max 10MB, got ${(file.size / 1024).toFixed(1)}KB)` }, { status: 400 });
  }

  // Generate upload ID
  const uploadId = crypto.randomUUID();
  const fileBuffer = await file.arrayBuffer();

  let storagePath: string;
  const uploadFileName = file.name;

  // Use extension-only path to avoid CJK/special char issues in Supabase Storage
  const ext = file.name.split('.').pop() || (isZip ? 'zip' : 'yomi');

  if (isZip) {
    storagePath = `zip/${uploadId}/file.${ext}`;
    const { error: zipUploadError } = await supabase.storage
      .from('toshiki-tech-yomi-files')
      .upload(storagePath, fileBuffer, { contentType: 'application/zip' });

    if (zipUploadError) {
      console.error('ZIP upload error:', zipUploadError);
      return NextResponse.json({ error: 'Failed to upload ZIP file' }, { status: 500 });
    }
  } else {
    storagePath = `yomi/${uploadId}/file.${ext}`;
    const { error: yomiUploadError } = await supabase.storage
      .from('toshiki-tech-yomi-files')
      .upload(storagePath, fileBuffer, { contentType: 'text/plain' });

    if (yomiUploadError) {
      console.error('Yomi upload error:', yomiUploadError);
      return NextResponse.json({ error: 'Failed to upload .yomi file' }, { status: 500 });
    }
  }

  // Determine status: third_party auto-approved, original with audio needs review
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
      visibility,
      status,
      source_platform: sourcePlatform || null,
      source_show: sourceShow || null,
      source_episode: sourceEpisode || null,
      yomi_storage_path: storagePath,
      audio_storage_path: null,
      yomi_file_name: uploadFileName,
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
