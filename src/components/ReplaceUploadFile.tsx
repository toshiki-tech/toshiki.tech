'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, FileText, Music, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ALLOWED_MEDIA_EXTENSIONS } from '@/lib/yomi-constants';
import type { ReplaceOutcome } from '@/lib/yomi-upload-files';

const content = {
  en: {
    button: 'New version',
    title: 'Upload a new version',
    primaryLabel: 'New file',
    primaryHint: (ext: string) => `Choose a ${ext} file — same type as the current one`,
    mediaLabel: 'New media file (optional)',
    mediaHint: `Leave empty to keep the current media. ${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}`,
    noteLabel: 'What changed? (optional)',
    notePlaceholder: 'e.g., Fixed timing in the second half',
    review: 'An admin reviews the new version before it goes live. Until then the current version stays available.',
    immediate: 'The new version replaces the current file right away.',
    resubmit: 'The new version replaces the rejected file and goes back into the review queue.',
    adminImmediate: 'As an admin, your version replaces the current file right away, without review.',
    submit: 'Upload',
    cancel: 'Cancel',
    close: 'Close',
    uploading: 'Uploading…',
    saving: 'Saving…',
    nothingChosen: 'Choose at least one file.',
    donePending: 'Submitted. The new version will go live once it is approved.',
    doneApplied: 'The file has been replaced with the new version.',
    error: 'Upload failed. Please try again.',
  },
  zh: {
    button: '更新版本',
    title: '上传新版本',
    primaryLabel: '新文件',
    primaryHint: (ext: string) => `选择 ${ext} 文件，需与原文件类型相同`,
    mediaLabel: '新媒体文件（可选）',
    mediaHint: `不选择则保留原媒体文件。${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}`,
    noteLabel: '更新说明（可选）',
    notePlaceholder: '例如：修正了后半段的时间轴',
    review: '新版本需要管理员审核后才会上线，在此之前旧版本仍可正常下载。',
    immediate: '新版本会立即替换当前文件。',
    resubmit: '新版本会替换被拒绝的文件，并重新进入审核队列。',
    adminImmediate: '你是管理员，新版本会直接替换当前文件，无需审核。',
    submit: '上传',
    cancel: '取消',
    close: '关闭',
    uploading: '上传中…',
    saving: '保存中…',
    nothingChosen: '请至少选择一个文件。',
    donePending: '已提交，新版本审核通过后即会上线。',
    doneApplied: '已替换为新版本。',
    error: '上传失败，请重试。',
  },
  'zh-tw': {
    button: '更新版本',
    title: '上傳新版本',
    primaryLabel: '新檔案',
    primaryHint: (ext: string) => `選擇 ${ext} 檔案，需與原檔案類型相同`,
    mediaLabel: '新媒體檔案（選填）',
    mediaHint: `不選擇則保留原媒體檔案。${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}`,
    noteLabel: '更新說明（選填）',
    notePlaceholder: '例如：修正了後半段的時間軸',
    review: '新版本需要管理員審核後才會上線，在此之前舊版本仍可正常下載。',
    immediate: '新版本會立即取代目前的檔案。',
    resubmit: '新版本會取代被拒絕的檔案，並重新進入審核佇列。',
    adminImmediate: '你是管理員，新版本會直接取代目前的檔案，無需審核。',
    submit: '上傳',
    cancel: '取消',
    close: '關閉',
    uploading: '上傳中…',
    saving: '儲存中…',
    nothingChosen: '請至少選擇一個檔案。',
    donePending: '已送出，新版本審核通過後即會上線。',
    doneApplied: '已取代為新版本。',
    error: '上傳失敗，請再試一次。',
  },
  ja: {
    button: '新バージョン',
    title: '新しいバージョンをアップロード',
    primaryLabel: '新しいファイル',
    primaryHint: (ext: string) => `${ext} ファイルを選択（現在と同じ形式）`,
    mediaLabel: '新しいメディアファイル（任意）',
    mediaHint: `空欄なら現在のメディアをそのまま使います。${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}`,
    noteLabel: '変更内容（任意）',
    notePlaceholder: '例：後半のタイミングを修正',
    review: '新しいバージョンは管理者の審査後に公開されます。それまでは現在のバージョンがダウンロードできます。',
    immediate: '新しいバージョンはすぐに現在のファイルと置き換わります。',
    resubmit: '新しいバージョンは却下されたファイルと置き換わり、再び審査待ちになります。',
    adminImmediate: '管理者のため、新しいバージョンは審査なしですぐに置き換わります。',
    submit: 'アップロード',
    cancel: 'キャンセル',
    close: '閉じる',
    uploading: 'アップロード中…',
    saving: '保存中…',
    nothingChosen: 'ファイルを1つ以上選択してください。',
    donePending: '送信しました。承認されると新しいバージョンが公開されます。',
    doneApplied: '新しいバージョンに置き換えました。',
    error: 'アップロードに失敗しました。もう一度お試しください。',
  },
};

interface Props {
  lang: string;
  uploadId: string;
  /** Kind of the primary file, which the new version has to match */
  primaryKind: 'yomi' | 'zip' | 'yomibook';
  hasSeparateMedia: boolean;
  outcome: ReplaceOutcome;
}

export default function ReplaceUploadFile({ lang, uploadId, primaryKind, hasSeparateMedia, outcome }: Props) {
  const t = content[lang as keyof typeof content] || content.en;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const ext = `.${primaryKind}`;
  const busy = status === 'uploading' || status === 'saving';

  function close() {
    if (busy) return;
    setOpen(false);
    setFile(null);
    setMediaFile(null);
    setNote('');
    setStatus('idle');
    setProgress(0);
    setMessage('');
  }

  async function uploadOne(f: File, target: 'primary' | 'media') {
    const urlRes = await fetch(`/api/yomi/uploads/${uploadId}/replace-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, fileName: f.name, fileSize: f.size }),
    });
    const urlData = await urlRes.json();
    if (!urlRes.ok) throw new Error(urlData.error || t.error);

    setProgress(0);
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', urlData.presignedUrl);
      xhr.setRequestHeader('Content-Type', urlData.contentType);
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
      });
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(t.error)));
      xhr.onerror = () => reject(new Error(t.error));
      xhr.send(f);
    });
    return urlData.storagePath as string;
  }

  async function submit() {
    if (!file && !mediaFile) {
      setMessage(t.nothingChosen);
      setStatus('error');
      return;
    }
    setStatus('uploading');
    setMessage('');
    try {
      const storagePath = file ? await uploadOne(file, 'primary') : undefined;
      const audioStoragePath = mediaFile ? await uploadOne(mediaFile, 'media') : undefined;

      setStatus('saving');
      const res = await fetch(`/api/yomi/uploads/${uploadId}/replace-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storagePath,
          fileName: file?.name,
          audioStoragePath,
          audioFileName: mediaFile?.name,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.error);

      setMessage(data.mode === 'pending' ? t.donePending : t.doneApplied);
      setStatus('done');
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.error);
      setStatus('error');
    }
  }

  const notice =
    outcome === 'review' ? t.review
    : outcome === 'resubmit' ? t.resubmit
    : outcome === 'admin' ? t.adminImmediate
    : t.immediate;

  const pickerClass =
    'flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] cursor-pointer transition-colors';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold hover:bg-[var(--border)] transition-colors"
        title={t.title}
      >
        <RefreshCw size={12} />
        {t.button}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold">{t.title}</h2>
              <button onClick={close} disabled={busy} className="text-[var(--muted-foreground)] disabled:opacity-30">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs p-3 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]">{notice}</p>

            {status === 'done' ? (
              <div className="flex items-start gap-2 text-sm text-green-600">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            ) : (
              <>
                <div>
                  <label className={labelClass}>{t.primaryLabel}</label>
                  <label className={pickerClass}>
                    <FileText size={18} className="shrink-0 text-[var(--muted-foreground)]" />
                    <span className="text-sm truncate">{file ? file.name : t.primaryHint(ext)}</span>
                    <input
                      type="file"
                      accept={ext}
                      className="hidden"
                      disabled={busy}
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                {hasSeparateMedia && (
                  <div>
                    <label className={labelClass}>{t.mediaLabel}</label>
                    <label className={pickerClass}>
                      <Music size={18} className="shrink-0 text-[var(--muted-foreground)]" />
                      <span className="text-sm truncate">{mediaFile ? mediaFile.name : t.mediaHint}</span>
                      <input
                        type="file"
                        accept={ALLOWED_MEDIA_EXTENSIONS.join(',')}
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                )}

                {outcome === 'review' && (
                  <div>
                    <label className={labelClass}>{t.noteLabel}</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={500}
                      rows={2}
                      disabled={busy}
                      placeholder={t.notePlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[rgb(var(--accent))]"
                    />
                  </div>
                )}

                {busy && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                      <span>{status === 'saving' ? t.saving : t.uploading}</span>
                      {status === 'uploading' && <span>{progress}%</span>}
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                      <div
                        className="h-full bg-[rgb(var(--accent))] rounded-full transition-all"
                        style={{ width: `${status === 'saving' ? 100 : progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-start gap-2 text-sm text-red-500">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{message}</span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={close}
                disabled={busy}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-30"
              >
                {status === 'done' ? t.close : t.cancel}
              </button>
              {status !== 'done' && (
                <button
                  onClick={submit}
                  disabled={busy || (!file && !mediaFile)}
                  className="btn-primary px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {t.submit}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
