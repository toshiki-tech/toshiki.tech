import { NextResponse } from 'next/server';
import { SHOW_POINTS_FEATURE, ALLOW_PRO_REDEMPTION, SHOW_COMMUNITY_DOWNLOAD } from '@/lib/yomi-constants';

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
      pro_redemption_enabled: ALLOW_PRO_REDEMPTION,
      community_download_enabled: SHOW_COMMUNITY_DOWNLOAD,
      updated_at: new Date().toISOString(),
    },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
