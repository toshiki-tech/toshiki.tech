'use client';

import { useState } from 'react';
import { Pencil, X, Save, Languages, Loader2 } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES, CONTENT_CATEGORIES, parseTranslationLanguages, serializeTranslationLanguages } from '@/lib/yomi-constants';
import TranslationFields, { toTranslationForm, hasAnyTranslation, type TranslationForm } from '@/components/TranslationFields';

interface UploadData {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  visibility: string;
  source_platform: string | null;
  source_show: string | null;
  source_episode: string | null;
  language: string;
  translation_language: string | null;
  category: string | null;
  tags: string[] | null;
  translations?: unknown;
}

export default function EditUpload({ upload }: { upload: UploadData }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [primaryTranslation, secondaryTranslation] = parseTranslationLanguages(
    upload.translation_language
  ) as string[];
  const [form, setForm] = useState({
    title: upload.title || '',
    description: upload.description || '',
    content_type: upload.content_type || 'third_party',
    visibility: upload.visibility || 'public',
    source_platform: upload.source_platform || '',
    source_show: upload.source_show || '',
    source_episode: upload.source_episode || '',
    language: upload.language || '',
    translation_language: primaryTranslation || '',
    secondary_translation_language: secondaryTranslation || '',
    category: upload.category || '',
    tagsInput: (upload.tags || []).join(', '),
  });
  const [translations, setTranslations] = useState<TranslationForm>(() => toTranslationForm(upload.translations));
  const [translating, setTranslating] = useState(false);

  // Drafts all four languages from the current (possibly unsaved) original text;
  // nothing is stored until the admin saves the form.
  const handleTranslate = async () => {
    if (hasAnyTranslation(translations) && !confirm('Replace the existing translations with a new draft?')) return;
    setTranslating(true);
    const res = await fetch('/api/yomi/admin/translate-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, description: form.description, language: form.language }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setTranslations(toTranslationForm(data.translations));
    } else {
      alert('Auto-translate failed: ' + (data.error || 'Unknown error'));
    }
    setTranslating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const tags = form.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const { tagsInput, secondary_translation_language, ...rest } = form;
    void tagsInput;
    const updates = {
      ...rest,
      tags,
      translations,
      translation_language: serializeTranslationLanguages([
        form.translation_language,
        secondary_translation_language,
      ]),
    };
    const res = await fetch('/api/yomi/admin/edit-upload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: upload.id, updates }),
    });
    if (res.ok) {
      setOpen(false);
      window.location.reload();
    } else {
      const err = await res.json().catch(() => ({}));
      alert('Failed to save: ' + (err.error || 'Unknown error'));
      setSaving(false);
    }
  };

  const input = 'w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))]';
  const label = 'block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-bold hover:bg-blue-500/20 transition-colors"
      >
        <Pencil size={14} />
        Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="w-full max-w-xl my-8 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Pencil size={18} />
                Edit Upload
              </h3>
              <button
                onClick={() => !saving && setOpen(false)}
                className="p-1 rounded hover:bg-[var(--muted)]"
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={label}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={input}
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`${label} mb-0`}>Translations</span>
                  <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={translating || saving || !form.title.trim()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-xs font-bold hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                  >
                    {translating ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
                    {translating ? 'Translating…' : 'Auto-translate'}
                  </button>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Empty fields fall back to the original title and description above. Review drafts before saving.
                </p>
                <TranslationFields
                  value={translations}
                  onChange={setTranslations}
                  originalTitle={form.title || 'Title'}
                  originalDescription={form.description || 'Description'}
                  inputClass={input}
                  disabled={translating}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Content Type</label>
                  <select
                    value={form.content_type}
                    onChange={(e) => setForm({ ...form, content_type: e.target.value })}
                    className={input}
                  >
                    <option value="third_party">Third-party</option>
                    <option value="original">Original</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Visibility</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                    className={input}
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={input}
                  >
                    <option value="">—</option>
                    {CONTENT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.labels.en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tagsInput}
                    onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                    placeholder="e.g., JLPT-N2, business, interview"
                    className={input}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Language</label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className={input}
                  >
                    <option value="">—</option>
                    {CONTENT_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Translation Language (primary)</label>
                  <select
                    value={form.translation_language}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        translation_language: e.target.value,
                        secondary_translation_language:
                          !e.target.value || e.target.value === form.secondary_translation_language
                            ? ''
                            : form.secondary_translation_language,
                      })
                    }
                    className={input}
                  >
                    <option value="">None</option>
                    {CONTENT_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {form.translation_language && (
                <div>
                  <label className={label}>Translation Language (secondary)</label>
                  <select
                    value={form.secondary_translation_language}
                    onChange={(e) =>
                      setForm({ ...form, secondary_translation_language: e.target.value })
                    }
                    className={input}
                  >
                    <option value="">None</option>
                    {CONTENT_LANGUAGES.filter((l) => l.id !== form.translation_language).map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={label}>Source Platform</label>
                <select
                  value={form.source_platform}
                  onChange={(e) => setForm({ ...form, source_platform: e.target.value })}
                  className={input}
                >
                  <option value="">—</option>
                  {SOURCE_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Source Show</label>
                  <input
                    type="text"
                    value={form.source_show}
                    onChange={(e) => setForm({ ...form, source_show: e.target.value })}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Episode</label>
                  <input
                    type="text"
                    value={form.source_episode}
                    onChange={(e) => setForm({ ...form, source_episode: e.target.value })}
                    className={input}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-bold text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || translating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--accent))] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
