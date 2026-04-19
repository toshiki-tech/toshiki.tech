'use client';

import { useRouter } from 'next/navigation';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES, CONTENT_CATEGORIES, CONTENT_SORT_OPTIONS } from '@/lib/yomi-constants';
import type { Locale } from '@/lib/get-dictionary';

interface FiltersProps {
  lang: Locale;
  currentLanguage?: string;
  currentPlatform?: string;
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
  currentTag?: string;
  allLanguagesLabel: string;
  allPlatformsLabel: string;
  allCategoriesLabel: string;
  sortLabel: string;
}

export default function Filters({
  lang,
  currentLanguage,
  currentPlatform,
  currentCategory,
  currentSort,
  currentQuery,
  currentTag,
  allLanguagesLabel,
  allPlatformsLabel,
  allCategoriesLabel,
  sortLabel,
}: FiltersProps) {
  const router = useRouter();

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (currentQuery) sp.set('q', currentQuery);
    if (currentLanguage) sp.set('language', currentLanguage);
    if (currentPlatform) sp.set('platform', currentPlatform);
    if (currentCategory) sp.set('category', currentCategory);
    if (currentSort) sp.set('sort', currentSort);
    if (currentTag) sp.set('tag', currentTag);
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v); else sp.delete(k);
    });
    sp.delete('page');
    const qs = sp.toString();
    return `/${lang}/yomiplay/community${qs ? `?${qs}` : ''}`;
  };

  const selectClass = 'px-3 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm';

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentCategory || ''}
        onChange={(e) => router.push(buildUrl({ category: e.target.value }))}
        className={selectClass}
      >
        <option value="">{allCategoriesLabel}</option>
        {CONTENT_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>{c.labels[lang] || c.labels.en}</option>
        ))}
      </select>
      <select
        value={currentLanguage || ''}
        onChange={(e) => router.push(buildUrl({ language: e.target.value }))}
        className={selectClass}
      >
        <option value="">{allLanguagesLabel}</option>
        {CONTENT_LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>{l.label}</option>
        ))}
      </select>
      <select
        value={currentPlatform || ''}
        onChange={(e) => router.push(buildUrl({ platform: e.target.value }))}
        className={selectClass}
      >
        <option value="">{allPlatformsLabel}</option>
        {SOURCE_PLATFORMS.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select
        value={currentSort || 'newest'}
        onChange={(e) => router.push(buildUrl({ sort: e.target.value }))}
        className={selectClass}
        aria-label={sortLabel}
      >
        {CONTENT_SORT_OPTIONS.map((s) => (
          <option key={s.id} value={s.id}>{s.labels[lang] || s.labels.en}</option>
        ))}
      </select>
    </div>
  );
}
