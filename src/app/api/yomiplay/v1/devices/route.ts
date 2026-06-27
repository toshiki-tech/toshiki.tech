import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractBearerToken, getUserFromBearer } from '@/lib/supabase-bearer';

const MAX_DEVICES = 3;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// GET /api/yomiplay/v1/devices — list all bound devices for the current user
export async function GET(request: Request) {
  const user = await getUserFromBearer(extractBearerToken(request));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const svc = serviceClient();
  const { data: devices } = await svc
    .from('toshiki_tech_yomi_devices')
    .select('device_id, device_name, platform, device_model, device_brand, os_version, app_version, last_seen_at, created_at')
    .eq('user_id', user.id)
    .order('last_seen_at', { ascending: false });

  return NextResponse.json(
    { data: { devices: devices ?? [], max_devices: MAX_DEVICES } },
    { headers: CORS }
  );
}

// POST /api/yomiplay/v1/devices — register or refresh a device
export async function POST(request: Request) {
  const user = await getUserFromBearer(extractBearerToken(request));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  let body: {
    device_id?:    string;
    device_name?:  string;
    platform?:     string;
    device_model?: string;
    device_brand?: string;
    os_version?:   string;
    app_version?:  string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
  }

  const { device_id, device_name, platform, device_model, device_brand, os_version, app_version } = body;
  if (!device_id || typeof device_id !== 'string') {
    return NextResponse.json({ error: 'device_id is required' }, { status: 400, headers: CORS });
  }

  const svc = serviceClient();

  // Check if this device is already registered for this user
  const { data: existing } = await svc
    .from('toshiki_tech_yomi_devices')
    .select('device_id')
    .eq('user_id', user.id)
    .eq('device_id', device_id)
    .single();

  if (existing) {
    // Already registered — refresh last_seen_at and device metadata
    await svc
      .from('toshiki_tech_yomi_devices')
      .update({
        last_seen_at: new Date().toISOString(),
        ...(device_name  ? { device_name }  : {}),
        ...(platform     ? { platform }     : {}),
        ...(device_model ? { device_model } : {}),
        ...(device_brand ? { device_brand } : {}),
        ...(os_version   ? { os_version }   : {}),
        ...(app_version  ? { app_version }  : {}),
      })
      .eq('user_id', user.id)
      .eq('device_id', device_id);

    return NextResponse.json({ data: { registered: true, is_new: false } }, { headers: CORS });
  }

  // New device — check quota
  const { count } = await svc
    .from('toshiki_tech_yomi_devices')
    .select('device_id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((count ?? 0) >= MAX_DEVICES) {
    return NextResponse.json(
      {
        error: 'Device limit reached',
        error_code: 'DEVICE_LIMIT_REACHED',
        message: `This account is already linked to ${MAX_DEVICES} devices. Please unbind an existing device before adding a new one.`,
        max_devices: MAX_DEVICES,
      },
      { status: 409, headers: CORS }
    );
  }

  // Register new device
  await svc.from('toshiki_tech_yomi_devices').insert({
    user_id:      user.id,
    device_id,
    device_name:  device_name  ?? null,
    platform:     platform     ?? null,
    device_model: device_model ?? null,
    device_brand: device_brand ?? null,
    os_version:   os_version   ?? null,
    app_version:  app_version  ?? null,
    last_seen_at: new Date().toISOString(),
  });

  return NextResponse.json({ data: { registered: true, is_new: true } }, { headers: CORS });
}
