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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page     = Math.max(1,  parseInt(url.searchParams.get('page')     || '1'));
  const perPage  = Math.min(50, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')));
  const lang     = url.searchParams.get('lang')     || null;
  const category = url.searchParams.get('category') || null;
  const platform = url.searchParams.get('platform') || null;
  const q        = url.searchParams.get('q')        || null;
  const sort     = url.searchParams.get('sort')     || 'newest';

  const supabase = getAnonClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('toshiki_tech_yomi_uploads')
    .select(
      `id, title, description, language, category,
       source_platform, source_show, source_episode, source_url,
       content_type, audio_storage_path,
       download_count, created_at,
       toshiki_tech_yomi_profiles(display_name)`,
      { count: 'exact' }
    )
    .eq('status', 'approved')
    .eq('is_removed', false)
    .eq('visibility', 'public')
    .eq('is_hidden', false);

  if (lang)     query = query.eq('language', lang);
  if (category) query = query.eq('category', category);
  if (platform) query = query.eq('source_platform', platform);
  if (q)        query = query.ilike('title', `%${q}%`);

  query = sort === 'downloads'
    ? query.order('download_count', { ascending: false })
    : query.order('created_at',     { ascending: false });

  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch subtitles' }, { status: 500, headers: CORS });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (data || []).map((row: any) => ({
    id:              row.id,
    title:           row.title,
    description:     row.description ?? null,
    language:        row.language,
    category:        row.category ?? null,
    source_platform: row.source_platform ?? null,
    source_show:     row.source_show ?? null,
    source_episode:  row.source_episode ?? null,
    source_url:      row.source_url ?? null,
    content_type:    row.content_type,
    has_media:       !!row.audio_storage_path,
    download_count:  row.download_count ?? 0,
    uploaded_by:     row.toshiki_tech_yomi_profiles?.display_name ?? null,
    created_at:      row.created_at,
  }));

  return NextResponse.json(
    {
      data: items,
      pagination: {
        page,
        per_page:    perPage,
        total:       count ?? 0,
        total_pages: Math.ceil((count ?? 0) / perPage),
      },
    },
    { headers: CORS }
  );
}
