'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

export default function BuyButton({
  plan,
  lang,
  highlight,
  label,
}: {
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime';
  lang: string;
  highlight: boolean;
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (plan === 'free') {
      window.location.href = `/${lang}/yomiplay/download`;
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = `/${lang}/yomiplay/auth`;
        return;
      }

      const origin = window.location.origin;
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          product: 'yomiplay',
          plan,
          success_url: `${origin}/${lang}/yomiplay/community?payment=success`,
          cancel_url: `${origin}/${lang}/yomiplay/pricing`,
        }),
      });

      const json = await res.json();
      if (json?.data?.url) {
        window.location.href = json.data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        highlight
          ? 'bg-[rgb(var(--accent))] text-white hover:opacity-90'
          : 'border border-[var(--border)] text-[var(--foreground-rgb)] hover:bg-[var(--muted)]'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin" />
        </span>
      ) : label}
    </button>
  );
}
