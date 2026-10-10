import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeEvent } from '@/lib/yomi-analytics-events';

// Anonymous usage analytics from the iOS / Android apps.
// Spec: docs/yomiplay-analytics-api.md. No auth; everything is validated against the whitelist.
export const runtime = 'nodejs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_BODY_BYTES = 64 * 1024;
const MAX_EVENTS = 100;
const MAX_AGE_MS = 30 * 24 * 3600 * 1000;
const MAX_FUTURE_MS = 24 * 3600 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLATFORMS = ['ios', 'android', 'ios-debug', 'android-debug'];
const DEVICE_CLASSES = ['phone', 'pad'];
const MEMORY_TIERS = ['low', 'normal', 'high'];

function serviceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function shortString(value: unknown, max = 32): string | null {
  return typeof value === 'string' && value.length > 0 && value.length <= max ? value : null;
}

function oneOf(value: unknown, allowed: string[]): string | null {
  return typeof value === 'string' && allowed.includes(value) ? value : null;
}

function bad(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: CORS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  const raw = await request.text().catch(() => '');
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return bad(413, 'Payload too large');

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return bad(400, 'Invalid JSON');
  }
  if (!body || typeof body !== 'object') return bad(400, 'Invalid body');

  const installId = typeof body.install_id === 'string' && UUID_RE.test(body.install_id) ? body.install_id.toLowerCase() : null;
  const platform = oneOf(body.platform, PLATFORMS);
  const appVersion = shortString(body.app_version, 16);
  if (!installId || !platform || !appVersion) return bad(400, 'Missing install_id / platform / app_version');
  if (!Array.isArray(body.events)) return bad(400, 'events must be an array');
  if (body.events.length > MAX_EVENTS) return bad(413, `At most ${MAX_EVENTS} events per batch`);

  const isPro = body.is_pro === true;
  const now = Date.now();
  const rows: Record<string, unknown>[] = [];
  for (const item of body.events as unknown[]) {
    if (!item || typeof item !== 'object') continue;
    const { name, ts, props } = item as Record<string, unknown>;
    const clean = sanitizeEvent(name, props);
    if (!clean || typeof ts !== 'string') continue;
    const time = Date.parse(ts);
    if (Number.isNaN(time) || time < now - MAX_AGE_MS || time > now + MAX_FUTURE_MS) continue;
    rows.push({
      install_id: installId,
      name: clean.name,
      props: clean.props,
      client_ts: new Date(time).toISOString(),
      platform,
      app_version: appVersion,
      is_pro: isPro,
    });
  }

  const svc = serviceClient();
  // first_seen is left out so it is only set on insert (column default)
  const install = {
    install_id: installId,
    platform,
    last_seen: new Date(now).toISOString(),
    app_version: appVersion,
    os_version: shortString(body.os_version, 16),
    device_class: oneOf(body.device_class, DEVICE_CLASSES),
    memory_tier: oneOf(body.memory_tier, MEMORY_TIERS),
    locale: shortString(body.locale, 16),
    // country code from the hosting edge; the IP itself is never stored
    country: shortString(request.headers.get('x-vercel-ip-country'), 4),
    is_pro: isPro,
  };
  const { error: installError } = await svc.from('yomiplay_installs').upsert(install, { onConflict: 'install_id' });
  if (installError) return bad(500, 'Storage error');

  if (rows.length > 0) {
    const { error } = await svc.from('yomiplay_events').insert(rows);
    if (error) return bad(500, 'Storage error');
  }

  const total = (body.events as unknown[]).length;
  return NextResponse.json({ accepted: rows.length, rejected: total - rows.length }, { headers: CORS });
}
