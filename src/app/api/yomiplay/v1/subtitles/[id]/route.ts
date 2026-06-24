import { NextResponse } from 'next/server';
import { getAnonClient } from '@/lib/supabase-bearer';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getAnonClient();

  const { data: row, error } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select(
      `id, title, description, language, category,
       source_platform, source_show, source_episode, source_url,
       content_type, yomi_file_name, audio_file_name,
       audio_storage_path, download_count, created_at, updated_at,
       toshiki_tech_yomi_profiles(display_name)`
    )
    .eq('id', params.id)
    .eq('status', 'approved')
    .eq('is_removed', false)
    .eq('visibility', 'public')
    .eq('is_hidden', false)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = row as any;

  return NextResponse.json(
    {
      data: {
        id:              r.id,
        title:           r.title,
        description:     r.description ?? null,
        language:        r.language,
        category:        r.category ?? null,
        source_platform: r.source_platform ?? null,
        source_show:     r.source_show ?? null,
        source_episode:  r.source_episode ?? null,
        source_url:      r.source_url ?? null,
        content_type:    r.content_type,
        file_name:       r.yomi_file_name ?? null,
        media_file_name: r.audio_file_name ?? null,
        has_media:       !!r.audio_storage_path,
        download_count:  r.download_count ?? 0,
        uploaded_by:     r.toshiki_tech_yomi_profiles?.display_name ?? null,
        created_at:      r.created_at,
        updated_at:      r.updated_at ?? null,
      },
    },
    { headers: CORS }
  );
}
