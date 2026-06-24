import { createClient } from '@supabase/supabase-js';

function anonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    ''
  );
}

/** Extract token from "Authorization: Bearer <token>" header. Returns null if absent. */
export function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7).trim() || null;
}

/**
 * Validate a Supabase JWT and return the user.
 * Uses supabase.auth.getUser(token) — works with anon key, no service role needed.
 */
export async function getUserFromBearer(token: string | null) {
  if (!token) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey());
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

/** Anon Supabase client (no auth context — for public reads and SECURITY DEFINER RPCs). */
export function getAnonClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, anonKey());
}
