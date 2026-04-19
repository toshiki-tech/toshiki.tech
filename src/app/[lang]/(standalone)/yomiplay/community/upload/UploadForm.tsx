'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Locale } from '@/lib/get-dictionary';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES, CONTENT_CATEGORIES, MAX_YOMI_FILE_SIZE, MAX_ZIP_FILE_SIZE } from '@/lib/yomi-constants';
import { Upload, FileText, Music, AlertCircle, CheckCircle2 } from 'lucide-react';

const content = {
  en: {
    contentTypeLabel: 'Content Type',
    original: 'Original / Self-recorded',
    originalDesc: 'Audio recorded by yourself. Can include audio + .yomi in a zip.',
    thirdParty: 'Third-party platform content',
    thirdPartyDesc: 'Subtitles for content from podcasts, YouTube, etc. Upload .yomi only.',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g., NHK News 2026-01-15',
    descriptionLabel: 'Description (optional)',
    descriptionPlaceholder: 'Brief description of the content...',
    categoryLabel: 'Category',
    selectCategory: 'Select category',
    languageLabel: 'Content Language',
    translationLanguageLabel: 'Translation Language',
    selectLanguage: 'Select language',
    noTranslation: 'None (no translation)',
    sourcePlatformLabel: 'Source Platform',
    selectPlatform: 'Select platform',
    sourceShowLabel: 'Show / Channel Name',
    sourceShowPlaceholder: 'e.g., ゆる言語学ラジオ',
    sourceEpisodeLabel: 'Episode (optional)',
    sourceEpisodePlaceholder: 'e.g., EP85',
    visibilityLabel: 'Visibility',
    public: 'Public',
    publicDesc: 'Visible to everyone',
    unlisted: 'Unlisted',
    unlistedDesc: 'Only accessible via share link',
    fileLabel: 'File',
    fileHintZip: 'Upload a .zip (containing .yomi + audio) or a standalone .yomi file',
    fileHintYomi: 'Upload a .yomi file',
    submit: 'Upload',
    submitting: 'Uploading...',
    successPending: 'Upload successful! Your content is pending review.',
    successApproved: 'Upload successful! Your content is now live.',
    error: 'Upload failed. Please try again.',
    loginRequired: 'Please sign in to upload.',
    signIn: 'Sign In',
  },
  zh: {
    contentTypeLabel: '内容类型',
    original: '原创 / 自录内容',
    originalDesc: '自己录制的音频。可上传包含音频和 .yomi 的 zip 包。',
    thirdParty: '第三方平台内容',
    thirdPartyDesc: '播客、YouTube 等内容的字幕。仅上传 .yomi 文件。',
    titleLabel: '标题',
    titlePlaceholder: '如：NHK 新闻 2026-01-15',
    descriptionLabel: '描述（可选）',
    descriptionPlaceholder: '简要描述内容...',
    categoryLabel: '内容分类',
    selectCategory: '选择分类',
    languageLabel: '内容语言',
    translationLanguageLabel: '翻译语言',
    selectLanguage: '选择语言',
    noTranslation: '无（无翻译）',
    sourcePlatformLabel: '来源平台',
    selectPlatform: '选择平台',
    sourceShowLabel: '节目 / 频道名称',
    sourceShowPlaceholder: '如：ゆる言語学ラジオ',
    sourceEpisodeLabel: '集数（可选）',
    sourceEpisodePlaceholder: '如：EP85',
    visibilityLabel: '可见性',
    public: '公开',
    publicDesc: '所有人可见',
    unlisted: '不公开',
    unlistedDesc: '仅通过分享链接访问',
    fileLabel: '文件',
    fileHintZip: '上传 .zip（包含 .yomi + 音频）或单独的 .yomi 文件',
    fileHintYomi: '上传 .yomi 文件',
    submit: '上传',
    submitting: '上传中...',
    successPending: '上传成功！内容正在等待审核。',
    successApproved: '上传成功！内容已发布。',
    error: '上传失败，请重试。',
    loginRequired: '请先登录再上传。',
    signIn: '登录',
  },
  'zh-tw': {
    contentTypeLabel: '內容類型',
    original: '原創 / 自錄內容',
    originalDesc: '自己錄製的音訊。可上傳包含音訊和 .yomi 的 zip 包。',
    thirdParty: '第三方平台內容',
    thirdPartyDesc: '播客、YouTube 等內容的字幕。僅上傳 .yomi 檔案。',
    titleLabel: '標題',
    titlePlaceholder: '如：NHK 新聞 2026-01-15',
    descriptionLabel: '描述（可選）',
    descriptionPlaceholder: '簡要描述內容...',
    categoryLabel: '內容分類',
    selectCategory: '選擇分類',
    languageLabel: '內容語言',
    translationLanguageLabel: '翻譯語言',
    selectLanguage: '選擇語言',
    noTranslation: '無（無翻譯）',
    sourcePlatformLabel: '來源平台',
    selectPlatform: '選擇平台',
    sourceShowLabel: '節目 / 頻道名稱',
    sourceShowPlaceholder: '如：ゆる言語学ラジオ',
    sourceEpisodeLabel: '集數（可選）',
    sourceEpisodePlaceholder: '如：EP85',
    visibilityLabel: '可見性',
    public: '公開',
    publicDesc: '所有人可見',
    unlisted: '不公開',
    unlistedDesc: '僅透過分享連結存取',
    fileLabel: '檔案',
    fileHintZip: '上傳 .zip（包含 .yomi + 音訊）或單獨的 .yomi 檔案',
    fileHintYomi: '上傳 .yomi 檔案',
    submit: '上傳',
    submitting: '上傳中...',
    successPending: '上傳成功！內容正在等待審核。',
    successApproved: '上傳成功！內容已發布。',
    error: '上傳失敗，請重試。',
    loginRequired: '請先登入再上傳。',
    signIn: '登入',
  },
  ja: {
    contentTypeLabel: 'コンテンツタイプ',
    original: 'オリジナル / 自分で録音',
    originalDesc: '自分で録音した音声。音声 + .yomi を zip にまとめてアップロードできます。',
    thirdParty: '外部プラットフォームのコンテンツ',
    thirdPartyDesc: 'ポッドキャスト、YouTube などの字幕。.yomi ファイルのみアップロード。',
    titleLabel: 'タイトル',
    titlePlaceholder: '例：NHK ニュース 2026-01-15',
    descriptionLabel: '説明（任意）',
    descriptionPlaceholder: 'コンテンツの簡単な説明...',
    categoryLabel: 'カテゴリ',
    selectCategory: 'カテゴリを選択',
    languageLabel: 'コンテンツの言語',
    translationLanguageLabel: '翻訳言語',
    selectLanguage: '言語を選択',
    noTranslation: 'なし（翻訳なし）',
    sourcePlatformLabel: 'ソースプラットフォーム',
    selectPlatform: 'プラットフォームを選択',
    sourceShowLabel: '番組 / チャンネル名',
    sourceShowPlaceholder: '例：ゆる言語学ラジオ',
    sourceEpisodeLabel: 'エピソード（任意）',
    sourceEpisodePlaceholder: '例：EP85',
    visibilityLabel: '公開設定',
    public: '公開',
    publicDesc: '全員に表示',
    unlisted: '限定公開',
    unlistedDesc: '共有リンクでのみアクセス可能',
    fileLabel: 'ファイル',
    fileHintZip: '.zip（.yomi + 音声を含む）または .yomi ファイルをアップロード',
    fileHintYomi: '.yomi ファイルをアップロード',
    submit: 'アップロード',
    submitting: 'アップロード中...',
    successPending: 'アップロード成功！コンテンツは審査待ちです。',
    successApproved: 'アップロード成功！コンテンツが公開されました。',
    error: 'アップロードに失敗しました。もう一度お試しください。',
    loginRequired: 'アップロードするにはログインが必要です。',
    signIn: 'ログイン',
  },
};

export default function UploadForm({ lang }: { lang: Locale }) {
  const t = content[lang] || content.en;
  const { user, isLoading } = useAuth();

  const [contentTypeChoice, setContentTypeChoice] = useState<'original' | 'third_party'>('third_party');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('');
  const [sourceShow, setSourceShow] = useState('');
  const [sourceEpisode, setSourceEpisode] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted'>('public');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'creating' | 'success_pending' | 'success_approved' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (isLoading) {
    return <div className="text-center py-20 text-[var(--muted-foreground)]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="mx-auto text-[var(--muted-foreground)]" size={48} />
        <p className="text-[var(--muted-foreground)]">{t.loginRequired}</p>
        <a href={`/${lang}/yomiplay/auth`} className="btn-primary inline-block px-6 py-2 rounded-xl">
          {t.signIn}
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Client-side validation
    const fileName = file.name.toLowerCase();
    const isZip = fileName.endsWith('.zip');
    if (!isZip && !fileName.endsWith('.yomi')) {
      setErrorMessage('Only .zip or .yomi files are accepted');
      setStatus('error');
      return;
    }
    if (isZip && file.size > MAX_ZIP_FILE_SIZE) {
      setErrorMessage(`ZIP file too large (max ${MAX_ZIP_FILE_SIZE / 1024 / 1024}MB)`);
      setStatus('error');
      return;
    }
    if (!isZip && file.size > MAX_YOMI_FILE_SIZE) {
      setErrorMessage(`.yomi file too large (max ${MAX_YOMI_FILE_SIZE / 1024 / 1024}MB)`);
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      // 1. Get presigned upload URL from our API
      const urlRes = await fetch('/api/yomi/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileSize: file.size, isZip }),
      });
      const urlData = await urlRes.json();
      if (!urlRes.ok) {
        setErrorMessage(urlData.error || 'Failed to prepare upload');
        setStatus('error');
        return;
      }
      const { uploadId, storagePath, presignedUrl, contentType: uploadContentType } = urlData;

      // 2. PUT file directly to R2 via presigned URL, tracking progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', uploadContentType);

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      // Now create DB record
      setStatus('creating');
      const res = await fetch('/api/yomi/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          storagePath,
          fileName: file.name,
          isZip,
          title,
          description: description || undefined,
          contentType: contentTypeChoice,
          visibility,
          category: category || undefined,
          language,
          translationLanguage: translationLanguage || undefined,
          sourcePlatform: sourcePlatform || undefined,
          sourceShow: sourceShow || undefined,
          sourceEpisode: sourceEpisode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || t.error);
        setStatus('error');
        return;
      }
      setStatus(data.status === 'pending' ? 'success_pending' : 'success_approved');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t.error);
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-rgb)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-colors';
  const labelClass = 'block text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2';

  if (status === 'success_pending' || status === 'success_approved') {
    return (
      <div className="text-center py-20 space-y-4">
        <CheckCircle2 className="mx-auto text-green-500" size={48} />
        <p className="text-lg font-medium">
          {status === 'success_pending' ? t.successPending : t.successApproved}
        </p>
        <a
          href={`/${lang}/yomiplay/community`}
          className="btn-primary inline-block px-6 py-2 rounded-xl"
        >
          {lang === 'zh' ? '返回社区' : lang === 'zh-tw' ? '返回社區' : lang === 'ja' ? 'コミュニティに戻る' : 'Back to Community'}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {/* Content Type Selection */}
      <div>
        <label className={labelClass}>{t.contentTypeLabel}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setContentTypeChoice('original')}
            className={`p-4 rounded-xl border text-left transition-all ${
              contentTypeChoice === 'original'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Music size={16} className={contentTypeChoice === 'original' ? 'text-[rgb(var(--accent))]' : ''} />
              <span className="font-bold text-sm">{t.original}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{t.originalDesc}</p>
          </button>
          <button
            type="button"
            onClick={() => setContentTypeChoice('third_party')}
            className={`p-4 rounded-xl border text-left transition-all ${
              contentTypeChoice === 'third_party'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className={contentTypeChoice === 'third_party' ? 'text-[rgb(var(--accent))]' : ''} />
              <span className="font-bold text-sm">{t.thirdParty}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{t.thirdPartyDesc}</p>
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>{t.titleLabel}</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.titlePlaceholder}
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>{t.descriptionLabel}</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descriptionPlaceholder}
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>{t.categoryLabel}</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">{t.selectCategory}</option>
          {CONTENT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.labels[lang] || c.labels.en}</option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label className={labelClass}>{t.languageLabel}</label>
        <select
          required
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={inputClass}
        >
          <option value="">{t.selectLanguage}</option>
          {CONTENT_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Translation Language */}
      <div>
        <label className={labelClass}>{t.translationLanguageLabel}</label>
        <select
          value={translationLanguage}
          onChange={(e) => setTranslationLanguage(e.target.value)}
          className={inputClass}
        >
          <option value="">{t.noTranslation}</option>
          {CONTENT_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Source info (third_party only) */}
      {contentTypeChoice === 'third_party' && (
        <>
          <div>
            <label className={labelClass}>{t.sourcePlatformLabel}</label>
            <select
              required
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value)}
              className={inputClass}
            >
              <option value="">{t.selectPlatform}</option>
              {SOURCE_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t.sourceShowLabel}</label>
            <input
              type="text"
              required
              value={sourceShow}
              onChange={(e) => setSourceShow(e.target.value)}
              placeholder={t.sourceShowPlaceholder}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t.sourceEpisodeLabel}</label>
            <input
              type="text"
              value={sourceEpisode}
              onChange={(e) => setSourceEpisode(e.target.value)}
              placeholder={t.sourceEpisodePlaceholder}
              className={inputClass}
            />
          </div>
        </>
      )}

      {/* Visibility */}
      <div>
        <label className={labelClass}>{t.visibilityLabel}</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setVisibility('public')}
            className={`flex-1 p-3 rounded-xl border text-center text-sm font-medium transition-all ${
              visibility === 'public'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5 text-[rgb(var(--accent))]'
                : 'border-[var(--border)] text-[var(--muted-foreground)]'
            }`}
          >
            {t.public}
            <p className="text-xs mt-1 font-normal">{t.publicDesc}</p>
          </button>
          <button
            type="button"
            onClick={() => setVisibility('unlisted')}
            className={`flex-1 p-3 rounded-xl border text-center text-sm font-medium transition-all ${
              visibility === 'unlisted'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5 text-[rgb(var(--accent))]'
                : 'border-[var(--border)] text-[var(--muted-foreground)]'
            }`}
          >
            {t.unlisted}
            <p className="text-xs mt-1 font-normal">{t.unlistedDesc}</p>
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className={labelClass}>{t.fileLabel}</label>
        <div className="relative">
          <input
            type="file"
            required
            accept={contentTypeChoice === 'original' ? '.zip,.yomi' : '.yomi,.zip'}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center gap-3 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] transition-colors text-center">
            <Upload size={24} className="text-[var(--muted-foreground)] mx-auto" />
            <div className="text-left">
              <p className="text-sm font-medium">
                {file ? file.name : (contentTypeChoice === 'original' ? t.fileHintZip : t.fileHintYomi)}
              </p>
              {file && (
                <p className="text-xs text-[var(--muted-foreground)]">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {(status === 'uploading' || status === 'creating') && (
        <div>
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
            <span>
              {status === 'uploading'
                ? (lang === 'zh' ? '上传中...' : lang === 'zh-tw' ? '上傳中...' : lang === 'ja' ? 'アップロード中...' : 'Uploading...')
                : (lang === 'zh' ? '创建记录...' : lang === 'zh-tw' ? '建立記錄...' : lang === 'ja' ? 'レコード作成中...' : 'Creating record...')
              }
            </span>
            <span>{status === 'uploading' ? `${progress}%` : ''}</span>
          </div>
          <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[rgb(var(--accent))] transition-all"
              style={{ width: status === 'creating' ? '100%' : `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          {errorMessage || t.error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'uploading' || status === 'creating' || !file}
        className="btn-primary w-full py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Upload size={18} />
        {status === 'uploading' || status === 'creating' ? t.submitting : t.submit}
      </button>
    </form>
  );
}
