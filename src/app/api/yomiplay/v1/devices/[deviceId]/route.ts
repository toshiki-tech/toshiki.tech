import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractBearerToken, getUserFromBearer } from '@/lib/supabase-bearer';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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

// DELETE /api/yomiplay/v1/devices/:deviceId — unbind a device
export async function DELETE(
  request: Request,
  { params }: { params: { deviceId: string } }
) {
  const user = await getUserFromBearer(extractBearerToken(request));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const deviceId = decodeURIComponent(params.deviceId);

  const svc = serviceClient();
  const { error } = await svc
    .from('toshiki_tech_yomi_devices')
    .delete()
    .eq('user_id', user.id)
    .eq('device_id', deviceId);

  if (error) {
    return NextResponse.json({ error: 'Failed to unbind device' }, { status: 500, headers: CORS });
  }

  return NextResponse.json({ data: { unbound: true } }, { headers: CORS });
}
