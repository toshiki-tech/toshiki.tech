import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getFeatureFlags, DEFAULT_FEATURE_FLAGS } from '@/lib/yomi-feature-flags';

export const runtime = 'edge';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Shorter TTL than before so admin toggles in the panel propagate to the iOS
// app within ~30s. stale-while-revalidate keeps responses fast even on a miss.
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=300',
};

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      ''
  );
}

export async function GET() {
  let flags = DEFAULT_FEATURE_FLAGS;
  try {
    flags = await getFeatureFlags(anonClient());
  } catch {
    // ignore — fall back to defaults
  }
  return NextResponse.json(
    {
      points_feature_enabled: flags.points_feature,
      pro_redemption_enabled: flags.pro_redemption,
      community_download_enabled: flags.community_download,
      updated_at: new Date().toISOString(),
    },
    { headers: { ...CORS_HEADERS, ...CACHE_HEADERS } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
