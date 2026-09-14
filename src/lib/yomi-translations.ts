import type { Locale } from '@/lib/get-dictionary';

/** Site locales a community upload's title and description can be translated into */
export const TRANSLATION_LOCALES = ['en', 'zh', 'ja', 'zh-tw'] as const satisfies readonly Locale[];

export const TRANSLATION_LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  ja: '日本語',
  'zh-tw': '繁體中文',
};

export const MAX_TRANSLATED_TITLE_LENGTH = 200;
export const MAX_TRANSLATED_DESCRIPTION_LENGTH = 5000;

export interface UploadTranslation {
  title?: string;
  description?: string;
}

/** Stored in the `translations` jsonb column; locales and fields are all optional */
export type UploadTranslations = Partial<Record<Locale, UploadTranslation>>;

/**
 * Title and description to show in a locale. Each field falls back to the
 * uploader's original text on its own, so a translated title with no translated
 * description still reads sensibly.
 */
export function localizeUpload(
  upload: { title: string; description: string | null; translations?: unknown },
  locale: string
): { title: string; description: string | null } {
  const translations = (upload.translations ?? {}) as UploadTranslations;
  const entry = translations[locale as Locale];
  return {
    title: entry?.title?.trim() || upload.title,
    description: entry?.description?.trim() || upload.description,
  };
}

/** Keeps only known locales and non-empty string fields, trimmed and length-capped */
export function sanitizeTranslations(input: unknown): UploadTranslations {
  const result: UploadTranslations = {};
  if (!input || typeof input !== 'object') return result;
  const source = input as Record<string, unknown>;

  for (const locale of TRANSLATION_LOCALES) {
    const entry = source[locale];
    if (!entry || typeof entry !== 'object') continue;
    const { title, description } = entry as Record<string, unknown>;
    const clean: UploadTranslation = {};
    if (typeof title === 'string' && title.trim()) {
      clean.title = title.trim().slice(0, MAX_TRANSLATED_TITLE_LENGTH);
    }
    if (typeof description === 'string' && description.trim()) {
      clean.description = description.trim().slice(0, MAX_TRANSLATED_DESCRIPTION_LENGTH);
    }
    if (clean.title || clean.description) result[locale] = clean;
  }
  return result;
}

/**
 * Maps an app-supplied UI language to a site locale ("zh-Hant", "zh_TW" and
 * "zh-HK" read as Traditional Chinese). Returns null for anything unsupported.
 */
export function parseUiLocale(value: string | null): Locale | null {
  if (!value) return null;
  const v = value.trim().toLowerCase().replace('_', '-');
  if (v === 'zh-tw' || v === 'zh-hant' || v === 'zh-hk' || v.startsWith('zh-hant-')) return 'zh-tw';
  if (v === 'zh' || v === 'zh-cn' || v === 'zh-hans' || v.startsWith('zh-hans-')) return 'zh';
  if (v === 'ja' || v.startsWith('ja-')) return 'ja';
  if (v === 'en' || v.startsWith('en-')) return 'en';
  return null;
}
