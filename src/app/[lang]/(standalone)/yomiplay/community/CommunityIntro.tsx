'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface Props {
  aboutTitle: string;
  aboutBody: string;
  termsTitle: string;
  termsBody: string;
  terms: string[];
  expandLabel: string;
  collapseLabel: string;
}

export default function CommunityIntro({
  aboutTitle,
  aboutBody,
  termsTitle,
  termsBody,
  terms,
  expandLabel,
  collapseLabel,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-start gap-3">
        <Info size={20} className="text-[rgb(var(--accent))] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm mb-1">{aboutTitle}</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{aboutBody}</p>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-yellow-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-1">{termsTitle}</h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">{termsBody}</p>
              <ul className="space-y-2 text-xs text-[var(--muted-foreground)] leading-relaxed list-disc pl-4">
                {terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="mt-3 text-xs font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors inline-flex items-center gap-1"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {open ? collapseLabel : expandLabel}
      </button>
    </div>
  );
}
