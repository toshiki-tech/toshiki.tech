import { NextResponse } from 'next/server';
import { CONTENT_LANGUAGES, CONTENT_CATEGORIES, CONTENT_SORT_OPTIONS, SOURCE_PLATFORMS } from '@/lib/yomi-constants';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  return NextResponse.json(
    {
      data: {
        languages: CONTENT_LANGUAGES.map((l) => ({ id: l.id, label: l.label })),
        categories: CONTENT_CATEGORIES.map((c) => ({
          id: c.id,
          labels: { en: c.labels.en, zh: c.labels.zh, 'zh-tw': c.labels['zh-tw'], ja: c.labels.ja },
        })),
        sort_options: CONTENT_SORT_OPTIONS.map((s) => ({
          id: s.id,
          labels: { en: s.labels.en, zh: s.labels.zh, 'zh-tw': s.labels['zh-tw'], ja: s.labels.ja },
        })),
        source_platforms: SOURCE_PLATFORMS.map((p) => ({ id: p.id, name: p.name, domain: p.domain ?? null })),
      },
    },
    { headers: CORS }
  );
}
