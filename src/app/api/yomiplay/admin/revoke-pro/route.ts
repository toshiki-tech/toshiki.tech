import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSessionClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const session = getSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await session
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { userId, product } = await request.json();
  if (!userId || !product) {
    return NextResponse.json({ error: 'Required: userId, product' }, { status: 400 });
  }

  const svc = serviceClient();

  // Cancel subscription record
  await svc
    .from('toshiki_tech_subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('product', product);

  // Sync is_pro = false in product profile table
  if (product === 'yomiplay') {
    await svc
      .from('toshiki_tech_yomi_profiles')
      .update({ is_pro: false })
      .eq('id', userId);
  }

  return NextResponse.json({ ok: true });
}
