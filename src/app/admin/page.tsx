import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, MessageSquare, ExternalLink, Package } from 'lucide-react';
import { getSupabase, requireAdmin } from '@/lib/supabase-server-api';
import ContactActions from './ContactActions';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
}

export const metadata: Metadata = {
  title: 'Admin | Toshiki Tech',
  robots: { index: false, follow: false },
};

export default async function SiteAdminPage() {
  const supabase = getSupabase();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    redirect('/en/yomiplay/auth');
  }

  // Fetch active contacts (not archived)
  const { data: contacts } = await supabase
    .from('toshiki_tech_contacts')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch stats
  const { count: newContactsCount } = await supabase
    .from('toshiki_tech_contacts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  const { count: pendingUploadsCount } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .eq('is_removed', false);

  const { count: pendingReportsCount } = await supabase
    .from('toshiki_tech_yomi_reports')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: proRequestsCount } = await supabase
    .from('toshiki_tech_yomi_pro_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-600',
    responded: 'bg-green-500/10 text-green-600',
    archived: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-custom py-12 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={24} className="text-[rgb(var(--accent))]" />
          <h1 className="text-3xl font-bold">Site Admin</h1>
        </div>

        {/* Quick links to sub-admin panels */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">
            Panels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/en/yomiplay/admin"
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[rgb(var(--accent))]/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-[rgb(var(--accent))]" />
                  <span className="font-bold">YomiPlay Community</span>
                </div>
                <ExternalLink size={14} className="text-[var(--muted-foreground)] group-hover:text-[rgb(var(--accent))]" />
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Uploads, reports, points, Pro membership requests
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs">
                {(pendingUploadsCount || 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 font-bold">
                    {pendingUploadsCount} pending upload{pendingUploadsCount !== 1 ? 's' : ''}
                  </span>
                )}
                {(pendingReportsCount || 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">
                    {pendingReportsCount} report{pendingReportsCount !== 1 ? 's' : ''}
                  </span>
                )}
                {(proRequestsCount || 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-bold">
                    {proRequestsCount} Pro request{proRequestsCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </section>

        {/* Contact Form Submissions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Mail size={20} />
              Contact Form ({(contacts || []).length})
            </h2>
            {(newContactsCount || 0) > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                {newContactsCount} new
              </span>
            )}
          </div>

          {!contacts || contacts.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted-foreground)]">
              <MessageSquare size={36} className="mx-auto mb-2 opacity-40" />
              <p>No contact messages.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(contacts as Contact[]).map((c) => {
                const date = new Date(c.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                });

                return (
                  <div key={c.id} className="p-4 sm:p-5 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
                    {/* Header: name + status */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="font-bold">{c.name}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[c.status] || statusColors.new}`}>
                        {c.status}
                      </span>
                    </div>

                    {/* Meta: email / company / date */}
                    <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-xs text-[var(--muted-foreground)] mb-3">
                      <dt className="font-bold uppercase tracking-wider">Email</dt>
                      <dd>
                        <a href={`mailto:${c.email}`} className="hover:text-[rgb(var(--accent))] hover:underline break-all">
                          {c.email}
                        </a>
                      </dd>
                      {c.company && (
                        <>
                          <dt className="font-bold uppercase tracking-wider">Company</dt>
                          <dd className="break-words">{c.company}</dd>
                        </>
                      )}
                      <dt className="font-bold uppercase tracking-wider">Date</dt>
                      <dd>{date}</dd>
                    </dl>

                    {/* Message */}
                    <p className="text-sm whitespace-pre-wrap break-words text-[var(--foreground-rgb)] p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                      {c.message}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex justify-end">
                      <ContactActions id={c.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
