'use client';

import { useState } from 'react';
import {
  TRANSLATION_LOCALES,
  TRANSLATION_LOCALE_LABELS,
  MAX_TRANSLATED_TITLE_LENGTH,
  MAX_TRANSLATED_DESCRIPTION_LENGTH,
  type UploadTranslations,
} from '@/lib/yomi-translations';

export type TranslationLocale = typeof TRANSLATION_LOCALES[number];
export type TranslationForm = Record<TranslationLocale, { title: string; description: string }>;

export function toTranslationForm(value: unknown): TranslationForm {
  const stored = (value ?? {}) as UploadTranslations;
  return Object.fromEntries(
    TRANSLATION_LOCALES.map((locale) => [
      locale,
      { title: stored[locale]?.title ?? '', description: stored[locale]?.description ?? '' },
    ])
  ) as TranslationForm;
}

export function hasAnyTranslation(value: TranslationForm) {
  return TRANSLATION_LOCALES.some((l) => value[l].title.trim() || value[l].description.trim());
}

interface Props {
  value: TranslationForm;
  onChange: (value: TranslationForm) => void;
  /** Shown as placeholders, so an empty field reads as "falls back to the original" */
  originalTitle: string;
  originalDescription: string;
  inputClass: string;
  disabled?: boolean;
}

/** Per-locale title and description inputs behind language tabs */
export default function TranslationFields({
  value,
  onChange,
  originalTitle,
  originalDescription,
  inputClass,
  disabled,
}: Props) {
  const [active, setActive] = useState<TranslationLocale>('en');

  const set = (field: 'title' | 'description', text: string) =>
    onChange({ ...value, [active]: { ...value[active], [field]: text } });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {TRANSLATION_LOCALES.map((locale) => {
          const filled = !!(value[locale].title.trim() || value[locale].description.trim());
          return (
            <button
              key={locale}
              type="button"
              onClick={() => setActive(locale)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                active === locale
                  ? 'bg-[rgb(var(--accent))] text-white'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {TRANSLATION_LOCALE_LABELS[locale]}
              {filled && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        value={value[active].title}
        onChange={(e) => set('title', e.target.value)}
        placeholder={originalTitle}
        maxLength={MAX_TRANSLATED_TITLE_LENGTH}
        disabled={disabled}
        lang={active}
        className={inputClass}
      />
      <textarea
        rows={3}
        value={value[active].description}
        onChange={(e) => set('description', e.target.value)}
        placeholder={originalDescription}
        maxLength={MAX_TRANSLATED_DESCRIPTION_LENGTH}
        disabled={disabled}
        lang={active}
        className={inputClass}
      />
    </div>
  );
}
