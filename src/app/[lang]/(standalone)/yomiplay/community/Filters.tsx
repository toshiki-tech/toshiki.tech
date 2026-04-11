'use client';

import { useRouter } from 'next/navigation';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES } from '@/lib/yomi-constants';

interface FiltersProps {
  lang: string;
  currentLanguage?: string;
  currentPlatform?: string;
  currentQuery?: string;
  allLanguagesLabel: string;
  allPlatformsLabel: string;
}

export default function Filters({
  lang,
  currentLanguage,
  currentPlatform,
  currentQuery,
  allLanguagesLabel,
  allPlatformsLabel,
}: FiltersProps) {
  const router = useRouter();

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (currentQuery) sp.set('q', currentQuery);
    if (currentLanguage) sp.set('language', currentLanguage);
    if (currentPlatform) sp.set('platform', currentPlatform);
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v); else sp.delete(k);
    });
    sp.delete('page');
    const qs = sp.toString();
    return `/${lang}/yomiplay/community${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="flex gap-3">
      <select
        defaultValue={currentLanguage || ''}
        onChange={(e) => router.push(buildUrl({ language: e.target.value }))}
        className="px-3 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm"
      >
        <option value="">{allLanguagesLabel}</option>
        {CONTENT_LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>{l.label}</option>
        ))}
      </select>
      <select
        defaultValue={currentPlatform || ''}
        onChange={(e) => router.push(buildUrl({ platform: e.target.value }))}
        className="px-3 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm"
      >
        <option value="">{allPlatformsLabel}</option>
        {SOURCE_PLATFORMS.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}
