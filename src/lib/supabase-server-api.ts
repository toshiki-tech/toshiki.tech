import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

export async function getAuthUser(supabase: ReturnType<typeof getSupabase>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireAdmin(supabase: ReturnType<typeof getSupabase>) {
  const user = await getAuthUser(supabase);
  if (!user) return null;
  const { data: profile } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') return null;
  return user;
}

/** Award points to a user and log the transaction */
export async function awardPoints(
  supabase: ReturnType<typeof getSupabase>,
  userId: string,
  action: string,
  points: number,
  description?: string
) {
  // Update user points
  const { data: profile } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .select('points')
    .eq('id', userId)
    .single();

  if (!profile) return;

  await supabase
    .from('toshiki_tech_yomi_profiles')
    .update({ points: (profile.points || 0) + points })
    .eq('id', userId);

  // Log the transaction
  await supabase
    .from('toshiki_tech_yomi_points_log')
    .insert({ user_id: userId, action, points, description });
}
