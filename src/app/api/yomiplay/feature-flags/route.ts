import { NextResponse } from 'next/server';
import { SHOW_POINTS_FEATURE } from '@/lib/yomi-constants';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
};

export async function GET() {
  return NextResponse.json(
    {
      points_feature_enabled: SHOW_POINTS_FEATURE,
      updated_at: new Date().toISOString(),
    },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
