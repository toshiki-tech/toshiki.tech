import { createClient } from '@supabase/supabase-js';
import { getSupabase, getAuthUser } from '@/lib/supabase-server-api';

/**
 * Service-role client. Writes to the file columns of an upload go through it,
 * because the table guard only lets admins change them from a user session.
 */
export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const FILE_UPDATE_COLUMNS =
  'id, user_id, status, content_type, file_kind, is_removed, ' +
  'yomi_storage_path, yomi_file_name, audio_storage_path, audio_file_name, file_version, ' +
  'pending_storage_path, pending_file_name, pending_audio_storage_path, pending_audio_file_name, pending_submitted_at';

export interface FileUpdateRow {
  id: string;
  user_id: string;
  status: string;
  content_type: string;
  file_kind: string | null;
  is_removed: boolean;
  yomi_storage_path: string | null;
  yomi_file_name: string | null;
  audio_storage_path: string | null;
  audio_file_name: string | null;
  file_version: number;
  pending_storage_path: string | null;
  pending_file_name: string | null;
  pending_audio_storage_path: string | null;
  pending_audio_file_name: string | null;
  pending_submitted_at: string | null;
}

/**
 * The signed-in admin, or an error response. The session only identifies the
 * user; the role is read with the service role so row-level security on profiles
 * cannot hide it.
 */
export async function loadAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: number; error: string }> {
  const user = await getAuthUser(getSupabase());
  if (!user) return { ok: false, status: 401, error: 'Not signed in (session expired?). Reload the page and try again.' };

  const { data: profile } = await getServiceClient()
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') return { ok: false, status: 403, error: 'Forbidden' };
  return { ok: true, userId: user.id };
}

export type ManageResult =
  | { ok: true; upload: FileUpdateRow; isAdmin: boolean }
  | { ok: false; status: number; error: string };

/** Loads an upload the signed-in user may replace files of: their own, or any as admin */
export async function loadManageableUpload(uploadId: string): Promise<ManageResult> {
  const user = await getAuthUser(getSupabase());
  if (!user) return { ok: false, status: 401, error: 'Unauthorized' };

  const svc = getServiceClient();
  const [{ data: upload }, { data: profile }] = await Promise.all([
    svc.from('toshiki_tech_yomi_uploads').select(FILE_UPDATE_COLUMNS).eq('id', uploadId).maybeSingle(),
    svc.from('toshiki_tech_yomi_profiles').select('role').eq('id', user.id).maybeSingle(),
  ]);

  const row = upload as unknown as FileUpdateRow | null;
  const isAdmin = profile?.role === 'admin';
  if (!row || row.is_removed || (row.user_id !== user.id && !isAdmin)) {
    return { ok: false, status: 404, error: 'Not found' };
  }
  return { ok: true, upload: row, isAdmin };
}
