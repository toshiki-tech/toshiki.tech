import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Extract lang from the URL path (e.g., /en/yomiplay/auth/callback)
  const pathParts = new URL(request.url).pathname.split('/');
  const lang = pathParts[1] || 'en';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // ignore in server component context
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure profile exists and update last login time
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('toshiki_tech_yomi_profiles')
          .upsert({
            id: user.id,
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            last_login_at: new Date().toISOString(),
          }, { onConflict: 'id' });
      }
      return NextResponse.redirect(`${origin}/${lang}/yomiplay/community`);
    }
  }

  // If no code or error, redirect to auth page
  return NextResponse.redirect(`${origin}/${lang}/yomiplay/auth`);
}
