import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, Music, FileText, AlertTriangle, List, Settings, Crown, ArrowLeft } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES } from '@/lib/yomi-constants';
import AdminActions from './AdminActions';
import ReportActions from './ReportActions';
import PointsConfig from './PointsConfig';
import ProRequests from './ProRequests';
import EditUpload from './EditUpload';
import HidePinControls from './HidePinControls';

interface AdminUpload {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  visibility: string;
  status: string;
  source_platform: string | null;
  source_show: string | null;
  source_episode: string | null;
  audio_storage_path: string | null;
  language: string;
  translation_language: string | null;
  category: string | null;
  tags: string[] | null;
  is_hidden: boolean;
  sort_order: number;
  created_at: string;
  toshiki_tech_yomi_profiles: { display_name: string } | null;
}

interface Report {
  id: string;
  upload_id: string;
  reporter_email: string;
  reason: string;
  status: string;
  created_at: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Admin | YomiPlay Community' };
}

export default async function AdminPage({ params: { lang } }: { params: { lang: Locale } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/yomiplay/auth`);

  const { data: profile } = await supabase
    .from('toshiki_tech_yomi_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="container-custom py-20 text-center">
        <Shield size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-[var(--muted-foreground)]">You do not have admin privileges.</p>
      </div>
    );
  }

  // Fetch pending uploads
  const { data: pendingUploads } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*, toshiki_tech_yomi_profiles!inner(display_name)')
    .eq('status', 'pending')
    .eq('is_removed', false)
    .order('created_at', { ascending: true });

  // Fetch recent reports
  const { data: reports } = await supabase
    .from('toshiki_tech_yomi_reports')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch all uploads (recent, not removed)
  const { data: allUploads } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*, toshiki_tech_yomi_profiles!inner(display_name)')
    .eq('is_removed', false)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch pending Pro requests
  const { data: proRequests } = await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .select('*, toshiki_tech_yomi_profiles!inner(display_name, points)')
    .eq('status', 'pending')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order('created_at', { ascending: true }) as { data: any[] | null };

  return (
    <div className="container-custom py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Back to Site Admin
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <Shield size={24} className="text-[rgb(var(--accent))]" />
        <h1 className="text-3xl font-bold">YomiPlay Admin</h1>
      </div>

      {/* Pending Reports */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle size={18} />
          Pending Reports ({(reports || []).length})
        </h2>

        {!reports || reports.length === 0 ? (
          <p className="text-[var(--muted-foreground)] py-8 text-center">No pending reports.</p>
        ) : (
          <div className="space-y-3">
            {(reports as Report[]).map((report) => {
              const date = new Date(report.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              });

              return (
                <div key={report.id} className="p-5 border border-yellow-500/20 rounded-2xl bg-yellow-500/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm mb-1"><strong>Content:</strong>{' '}
                        <Link href={`/${lang}/yomiplay/community/${report.upload_id}`} className="text-[rgb(var(--accent))] hover:underline">
                          {report.upload_id}
                        </Link>
                      </p>
                      <p className="text-sm mb-1"><strong>Reporter:</strong> {report.reporter_email}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{report.reason}</p>
                      <ReportActions reportId={report.id} uploadId={report.upload_id} />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] shrink-0">{date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pending Uploads */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText size={18} />
          Pending Review ({(pendingUploads || []).length})
        </h2>

        {!pendingUploads || pendingUploads.length === 0 ? (
          <p className="text-[var(--muted-foreground)] py-8 text-center">No pending uploads.</p>
        ) : (
          <div className="space-y-3">
            {(pendingUploads as AdminUpload[]).map((upload) => {
              const platform = SOURCE_PLATFORMS.find(p => p.id === upload.source_platform);
              const langLabel = CONTENT_LANGUAGES.find(l => l.id === upload.language);
              const date = new Date(upload.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              });

              return (
                <div key={upload.id} className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/${lang}/yomiplay/community/${upload.id}`}
                          className="font-bold hover:text-[rgb(var(--accent))] transition-colors"
                        >
                          {upload.title}
                        </Link>
                        {upload.audio_storage_path && <Music size={14} className="text-green-600 shrink-0" />}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]">
                          {upload.content_type}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] flex flex-wrap gap-2 items-center">
                        <span>by {upload.toshiki_tech_yomi_profiles?.display_name || 'Unknown'}</span>
                        {langLabel && <span>· {langLabel.label}</span>}
                        {platform && <span>· {platform.name}</span>}
                        {upload.category && <span>· {upload.category}</span>}
                        <span>· {date}</span>
                        {upload.is_hidden && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600">Hidden</span>
                        )}
                        {upload.sort_order > 0 && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]">Pin {upload.sort_order}</span>
                        )}
                      </div>
                      {upload.tags && upload.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {upload.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <HidePinControls uploadId={upload.id} isHidden={upload.is_hidden} sortOrder={upload.sort_order} />
                      <EditUpload upload={upload} />
                      <AdminActions uploadId={upload.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* All Uploads */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <List size={18} />
          All Uploads ({(allUploads || []).length})
        </h2>

        {!allUploads || allUploads.length === 0 ? (
          <p className="text-[var(--muted-foreground)] py-8 text-center">No uploads.</p>
        ) : (
          <div className="space-y-3">
            {(allUploads as AdminUpload[]).map((upload) => {
              const platform = SOURCE_PLATFORMS.find(p => p.id === upload.source_platform);
              const langLabel = CONTENT_LANGUAGES.find(l => l.id === upload.language);
              const date = new Date(upload.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              });

              const statusColors: Record<string, string> = {
                pending: 'bg-yellow-500/10 text-yellow-600',
                approved: 'bg-green-500/10 text-green-600',
                rejected: 'bg-red-500/10 text-red-500',
              };

              return (
                <div key={upload.id} className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/${lang}/yomiplay/community/${upload.id}`}
                          className="font-bold hover:text-[rgb(var(--accent))] transition-colors"
                        >
                          {upload.title}
                        </Link>
                        {upload.audio_storage_path && <Music size={14} className="text-green-600 shrink-0" />}
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[upload.status] || ''}`}>
                          {upload.status}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] flex flex-wrap gap-2 items-center">
                        <span>by {upload.toshiki_tech_yomi_profiles?.display_name || 'Unknown'}</span>
                        {langLabel && <span>· {langLabel.label}</span>}
                        {platform && <span>· {platform.name}</span>}
                        {upload.category && <span>· {upload.category}</span>}
                        <span>· {date}</span>
                        {upload.is_hidden && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600">Hidden</span>
                        )}
                        {upload.sort_order > 0 && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]">Pin {upload.sort_order}</span>
                        )}
                      </div>
                      {upload.tags && upload.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {upload.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <HidePinControls uploadId={upload.id} isHidden={upload.is_hidden} sortOrder={upload.sort_order} />
                      <EditUpload upload={upload} />
                      <AdminActions uploadId={upload.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Points Config */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings size={18} />
          Points Configuration
        </h2>
        <PointsConfig />
      </section>

      {/* Pro Requests */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Crown size={18} className="text-purple-500" />
          Pro Membership Requests ({(proRequests || []).length})
        </h2>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProRequests requests={(proRequests || []) as any} />
      </section>
    </div>
  );
}
