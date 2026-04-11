'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Crown, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ProRequest {
  id: string;
  user_id: string;
  points_at_request: number;
  status: string;
  screenshot_path: string | null;
  created_at: string;
  toshiki_tech_yomi_profiles: { display_name: string; points: number } | null;
}

export default function ProRequests({ requests }: { requests: ProRequest[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string>>({});
  const [redeemUrls, setRedeemUrls] = useState<Record<string, string>>({});
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleReview = async (requestId: string, action: 'approved' | 'rejected') => {
    if (action === 'approved' && !redeemUrls[requestId]?.trim()) {
      alert('Please enter the redeem URL for the user');
      return;
    }
    setLoading(requestId);
    const res = await fetch('/api/yomi/admin/pro-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        action,
        adminNote: action === 'approved' ? redeemUrls[requestId] : undefined,
      }),
    });
    if (res.ok) {
      setDone(prev => ({ ...prev, [requestId]: action }));
      setTimeout(() => window.location.reload(), 800);
    }
    setLoading(null);
  };

  if (requests.length === 0) {
    return <p className="text-[var(--muted-foreground)] py-8 text-center">No pending Pro requests.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map(req => {
        const date = new Date(req.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });

        if (done[req.id]) {
          return (
            <div key={req.id} className="p-5 border border-green-500/20 rounded-2xl bg-green-500/5">
              <span className="text-sm font-bold text-green-500">
                {done[req.id] === 'approved' ? '✓ Approved — URL sent to user' : '✗ Rejected'}
              </span>
            </div>
          );
        }

        return (
          <div key={req.id} className="p-5 border border-purple-500/20 rounded-2xl bg-purple-500/5">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold flex items-center gap-2">
                    <Crown size={16} className="text-purple-500" />
                    {req.toshiki_tech_yomi_profiles?.display_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Points at request: {req.points_at_request} · Current: {req.toshiki_tech_yomi_profiles?.points || 0} · {date}
                  </p>
                  {req.screenshot_path && (
                    <button
                      onClick={async () => {
                        const { createClient } = await import('@/lib/supabase-browser');
                        const supabase = createClient();
                        const { data } = await supabase.storage
                          .from('toshiki-tech-yomi-files')
                          .createSignedUrl(req.screenshot_path!, 300);
                        if (data?.signedUrl) setPreviewImg(data.signedUrl);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[rgb(var(--accent))] hover:underline"
                    >
                      <ImageIcon size={12} />
                      View Screenshot
                    </button>
                  )}
                </div>
              </div>

              {/* Redeem URL input */}
              <div>
                <label className="text-xs font-bold text-[var(--muted-foreground)] mb-1 block flex items-center gap-1">
                  <LinkIcon size={12} />
                  Redeem URL (user opens in Safari to activate Pro)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={redeemUrls[req.id] || ''}
                  onChange={e => setRedeemUrls(prev => ({ ...prev, [req.id]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReview(req.id, 'approved')}
                  disabled={loading === req.id}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  Approve & Send URL
                </button>
                <button
                  onClick={() => handleReview(req.id, 'rejected')}
                  disabled={loading === req.id}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <XCircle size={14} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Screenshot preview modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div className="max-w-2xl max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <img src={previewImg} alt="User screenshot" className="rounded-xl w-full" />
            <button
              onClick={() => setPreviewImg(null)}
              className="mt-3 w-full py-2 rounded-lg bg-[var(--muted)] text-sm font-bold text-[var(--muted-foreground)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
