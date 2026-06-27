'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, MessageCircle } from 'lucide-react';

interface Props {
  lang: string;
  communityTitle: string;
  communitySub: string;
  communityBtn: string;
}

export default function CommunityCTASection({ lang, communityTitle, communitySub, communityBtn }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/yomiplay/feature-flags')
      .then((r) => r.json())
      .then((d) => {
        if (d?.community_enabled !== false) setVisible(true);
      })
      .catch(() => setVisible(true));
  }, []);

  if (!visible) return null;

  return (
    <section className="py-20 border-t border-[var(--border)] bg-[var(--muted)]/20">
      <div className="container-custom max-w-3xl mx-auto text-center space-y-8">
        <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto">
          <Users size={28} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight">{communityTitle}</h2>
          <p className="text-[var(--muted-foreground)]">{communitySub}</p>
        </div>
        <Link
          href={`/${lang}/yomiplay/community`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[rgb(var(--accent))] text-white font-bold hover:opacity-90 transition-opacity shadow-lg"
        >
          <MessageCircle size={18} />
          {communityBtn}
        </Link>
      </div>
    </section>
  );
}
