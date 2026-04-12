'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

const locales = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'zh', label: '简体中文', short: 'ZH' },
  { id: 'zh-tw', label: '繁體中文', short: 'TW' },
  { id: 'ja', label: '日本語', short: 'JA' },
];

export default function LangSwitcher({
  currentLang,
  redirectedPathName,
}: {
  currentLang: string;
  redirectedPathName: (locale: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = locales.find((l) => l.id === currentLang) || locales[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded border border-transparent hover:border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground-rgb)] transition-colors"
        aria-label="Change language"
      >
        <Globe size={14} />
        <span>{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg py-1 z-50">
          {locales.map((loc) => (
            <Link
              key={loc.id}
              href={redirectedPathName(loc.id)}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-[var(--muted)] transition-colors ${
                currentLang === loc.id
                  ? 'text-[rgb(var(--accent))] font-bold'
                  : 'text-[var(--foreground-rgb)]'
              }`}
            >
              <span>{loc.label}</span>
              {currentLang === loc.id && <Check size={12} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
