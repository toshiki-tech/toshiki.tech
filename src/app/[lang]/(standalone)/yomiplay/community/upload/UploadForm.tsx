'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Locale } from '@/lib/get-dictionary';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES, CONTENT_CATEGORIES, MAX_YOMI_FILE_SIZE, MAX_ZIP_FILE_SIZE, MAX_AUDIO_FILE_SIZE, MAX_YOMIBOOK_FILE_SIZE, ALLOWED_MEDIA_EXTENSIONS, YOMIBOOK_EXTENSION, serializeTranslationLanguages } from '@/lib/yomi-constants';
import { Upload, FileText, Music, AlertCircle, CheckCircle2, BookMarked, Languages, ChevronDown } from 'lucide-react';
import TranslationFields, { toTranslationForm, type TranslationForm } from '@/components/TranslationFields';

const content = {
  en: {
    contentTypeLabel: 'Content Type',
    original: 'Original / Self-recorded',
    originalDesc: 'Audio or video recorded by yourself. Upload the media and .yomi as separate files, or together as a .zip.',
    thirdParty: 'Third-party platform content',
    thirdPartyDesc: 'Subtitles for content from podcasts, YouTube, etc. Upload .yomi only.',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g., NHK News 2026-01-15',
    descriptionLabel: 'Description (optional)',
    descriptionPlaceholder: 'Brief description of the content...',
    translationsToggle: 'Add title and description in other languages (optional)',
    translationsHint: 'Visitors browsing in these languages see your translation; empty fields show the original above. Admins may polish translations later.',
    categoryLabel: 'Category',
    selectCategory: 'Select category',
    languageLabel: 'Content Language',
    uploadKindLabel: 'What are you sharing?',
    kindSubtitle: 'Subtitles',
    kindSubtitleDesc: 'A .yomi transcript, optionally bundled with its audio.',
    kindDeck: 'Deck',
    kindDeckDesc: 'A .yomibook memorization deck exported from the app.',
    deckFileLabel: 'Deck File',
    deckFileHint: 'Choose a .yomibook file (max 200MB)',
    deckNotice: 'Export a deck from the YomiPlay app, then share it here. Every deck is reviewed by an admin before it appears in the community.',
    translationLanguageLabel: 'Primary Translation Language',
    secondaryTranslationLanguageLabel: 'Secondary Translation Language (optional)',
    selectLanguage: 'Select language',
    noTranslation: 'None (no translation)',
    sourcePlatformLabel: 'Source Platform',
    selectPlatform: 'Select platform',
    sourceShowLabel: 'Show / Channel Name',
    sourceShowPlaceholder: 'e.g., ゆる言語学ラジオ',
    sourceEpisodeLabel: 'Episode (optional)',
    sourceEpisodePlaceholder: 'e.g., EP85',
    sourceUrlLabel: 'Source URL (optional)',
    sourceUrlPlaceholder: 'e.g., https://www.youtube.com/watch?v=...',
    visibilityLabel: 'Visibility',
    public: 'Public',
    publicDesc: 'Visible to everyone',
    unlisted: 'Unlisted',
    unlistedDesc: 'Only accessible via share link',
    fileLabel: 'File',
    fileHintZip: 'Upload a .zip (containing .yomi + audio) or a standalone .yomi file',
    fileHintYomi: 'Upload a .yomi file',
    originalModeLabel: 'Upload mode',
    bundleMode: 'ZIP bundle',
    bundleModeDesc: 'A single .zip containing both the .yomi and audio/video',
    separateMode: 'Subtitle + media (separate files)',
    separateModeDesc: 'Upload your .yomi and the media file as two separate files',
    yomiFileLabel: 'Subtitle file (.yomi)',
    yomiFileHint: 'Upload a .yomi file (max 10MB)',
    mediaFileLabel: 'Media file',
    mediaFileHint: `Upload ${ALLOWED_MEDIA_EXTENSIONS.join(' / ')} (max ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB)`,
    mediaRequired: 'Please select a media file',
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
    originalDesc: '自己录制的音视频。可分别上传媒体和 .yomi 文件，也可打包成 zip 上传。',
    thirdParty: '第三方平台内容',
    thirdPartyDesc: '播客、YouTube 等内容的字幕。仅上传 .yomi 文件。',
    titleLabel: '标题',
    titlePlaceholder: '如：NHK 新闻 2026-01-15',
    descriptionLabel: '描述（可选）',
    descriptionPlaceholder: '简要描述内容...',
    translationsToggle: '添加其他语言的标题和描述（可选）',
    translationsHint: '用这些语言浏览的访客会看到你的译文，留空则显示上面的原文。管理员之后可能会润色译文。',
    categoryLabel: '内容分类',
    selectCategory: '选择分类',
    languageLabel: '内容语言',
    uploadKindLabel: '你要分享什么？',
    kindSubtitle: '字幕',
    kindSubtitleDesc: '.yomi 文稿，可选择连同音频一起打包。',
    kindDeck: '暗记本',
    kindDeckDesc: '从 App 导出的 .yomibook 暗记本文件。',
    deckFileLabel: '暗记本文件',
    deckFileHint: '选择 .yomibook 文件（最大 200MB）',
    deckNotice: '在 YomiPlay App 里导出暗记本后上传到这里。所有暗记本都需管理员审核通过，才会出现在社区。',
    translationLanguageLabel: '主翻译语言',
    secondaryTranslationLanguageLabel: '副翻译语言（可选）',
    selectLanguage: '选择语言',
    noTranslation: '无（无翻译）',
    sourcePlatformLabel: '来源平台',
    selectPlatform: '选择平台',
    sourceShowLabel: '节目 / 频道名称',
    sourceShowPlaceholder: '如：ゆる言語学ラジオ',
    sourceEpisodeLabel: '集数（可选）',
    sourceEpisodePlaceholder: '如：EP85',
    sourceUrlLabel: '来源链接（可选）',
    sourceUrlPlaceholder: '如：https://www.youtube.com/watch?v=...',
    visibilityLabel: '可见性',
    public: '公开',
    publicDesc: '所有人可见',
    unlisted: '不公开',
    unlistedDesc: '仅通过分享链接访问',
    fileLabel: '文件',
    fileHintZip: '上传 .zip（包含 .yomi + 音频）或单独的 .yomi 文件',
    fileHintYomi: '上传 .yomi 文件',
    originalModeLabel: '上传方式',
    bundleMode: 'ZIP 压缩包',
    bundleModeDesc: '一个 .zip，里面同时包含 .yomi 和音视频文件',
    separateMode: '字幕 + 媒体（分文件上传）',
    separateModeDesc: '将 .yomi 字幕和媒体文件作为两个文件分别上传',
    yomiFileLabel: '字幕文件（.yomi）',
    yomiFileHint: '上传 .yomi 文件（最大 10MB）',
    mediaFileLabel: '媒体文件',
    mediaFileHint: `上传 ${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}（最大 ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB）`,
    mediaRequired: '请选择媒体文件',
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
    originalDesc: '自己錄製的影音。可分別上傳媒體和 .yomi 檔案，也可打包成 zip 上傳。',
    thirdParty: '第三方平台內容',
    thirdPartyDesc: '播客、YouTube 等內容的字幕。僅上傳 .yomi 檔案。',
    titleLabel: '標題',
    titlePlaceholder: '如：NHK 新聞 2026-01-15',
    descriptionLabel: '描述（可選）',
    descriptionPlaceholder: '簡要描述內容...',
    translationsToggle: '新增其他語言的標題和描述（選填）',
    translationsHint: '以這些語言瀏覽的訪客會看到你的譯文，留空則顯示上面的原文。管理員之後可能會潤飾譯文。',
    categoryLabel: '內容分類',
    selectCategory: '選擇分類',
    languageLabel: '內容語言',
    uploadKindLabel: '你要分享什麼？',
    kindSubtitle: '字幕',
    kindSubtitleDesc: '.yomi 文稿，可選擇連同音訊一起打包。',
    kindDeck: '暗記本',
    kindDeckDesc: '從 App 匯出的 .yomibook 暗記本檔案。',
    deckFileLabel: '暗記本檔案',
    deckFileHint: '選擇 .yomibook 檔案（最大 200MB）',
    deckNotice: '在 YomiPlay App 匯出暗記本後上傳到這裡。所有暗記本都需管理員審核通過，才會出現在社區。',
    translationLanguageLabel: '主翻譯語言',
    secondaryTranslationLanguageLabel: '副翻譯語言（選填）',
    selectLanguage: '選擇語言',
    noTranslation: '無（無翻譯）',
    sourcePlatformLabel: '來源平台',
    selectPlatform: '選擇平台',
    sourceShowLabel: '節目 / 頻道名稱',
    sourceShowPlaceholder: '如：ゆる言語学ラジオ',
    sourceEpisodeLabel: '集數（可選）',
    sourceEpisodePlaceholder: '如：EP85',
    sourceUrlLabel: '來源連結（可選）',
    sourceUrlPlaceholder: '如：https://www.youtube.com/watch?v=...',
    visibilityLabel: '可見性',
    public: '公開',
    publicDesc: '所有人可見',
    unlisted: '不公開',
    unlistedDesc: '僅透過分享連結存取',
    fileLabel: '檔案',
    fileHintZip: '上傳 .zip（包含 .yomi + 音訊）或單獨的 .yomi 檔案',
    fileHintYomi: '上傳 .yomi 檔案',
    originalModeLabel: '上傳方式',
    bundleMode: 'ZIP 壓縮包',
    bundleModeDesc: '一個 .zip，內含 .yomi 與影音檔案',
    separateMode: '字幕 + 媒體（分檔案上傳）',
    separateModeDesc: '將 .yomi 字幕和媒體檔案作為兩個檔案分別上傳',
    yomiFileLabel: '字幕檔案（.yomi）',
    yomiFileHint: '上傳 .yomi 檔案（最大 10MB）',
    mediaFileLabel: '媒體檔案',
    mediaFileHint: `上傳 ${ALLOWED_MEDIA_EXTENSIONS.join(' / ')}（最大 ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB）`,
    mediaRequired: '請選擇媒體檔案',
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
    originalDesc: '自分で録音・撮影した音声・動画。メディアと .yomi を別ファイルでアップロード、または .zip にまとめてアップロードできます。',
    thirdParty: '外部プラットフォームのコンテンツ',
    thirdPartyDesc: 'ポッドキャスト、YouTube などの字幕。.yomi ファイルのみアップロード。',
    titleLabel: 'タイトル',
    titlePlaceholder: '例：NHK ニュース 2026-01-15',
    descriptionLabel: '説明（任意）',
    descriptionPlaceholder: 'コンテンツの簡単な説明...',
    translationsToggle: '他の言語のタイトルと説明を追加（任意）',
    translationsHint: 'その言語で閲覧している人には翻訳が表示され、空欄の項目は上の原文が表示されます。翻訳は後で管理者が調整することがあります。',
    categoryLabel: 'カテゴリ',
    selectCategory: 'カテゴリを選択',
    languageLabel: 'コンテンツの言語',
    uploadKindLabel: '何を共有しますか？',
    kindSubtitle: '字幕',
    kindSubtitleDesc: '.yomi の文字起こし。音声を同梱することもできます。',
    kindDeck: '暗記帳',
    kindDeckDesc: 'アプリから書き出した .yomibook の暗記帳。',
    deckFileLabel: '暗記帳ファイル',
    deckFileHint: '.yomibook ファイルを選択（最大 200MB）',
    deckNotice: 'YomiPlay アプリで暗記帳を書き出してからアップロードしてください。暗記帳はすべて管理者の審査を通過してからコミュニティに表示されます。',
    translationLanguageLabel: '主翻訳言語',
    secondaryTranslationLanguageLabel: '副翻訳言語（任意）',
    selectLanguage: '言語を選択',
    noTranslation: 'なし（翻訳なし）',
    sourcePlatformLabel: 'ソースプラットフォーム',
    selectPlatform: 'プラットフォームを選択',
    sourceShowLabel: '番組 / チャンネル名',
    sourceShowPlaceholder: '例：ゆる言語学ラジオ',
    sourceEpisodeLabel: 'エピソード（任意）',
    sourceEpisodePlaceholder: '例：EP85',
    sourceUrlLabel: 'ソース URL（任意）',
    sourceUrlPlaceholder: '例：https://www.youtube.com/watch?v=...',
    visibilityLabel: '公開設定',
    public: '公開',
    publicDesc: '全員に表示',
    unlisted: '限定公開',
    unlistedDesc: '共有リンクでのみアクセス可能',
    fileLabel: 'ファイル',
    fileHintZip: '.zip（.yomi + 音声を含む）または .yomi ファイルをアップロード',
    fileHintYomi: '.yomi ファイルをアップロード',
    originalModeLabel: 'アップロード方法',
    bundleMode: 'ZIP バンドル',
    bundleModeDesc: '.yomi と音声・動画をまとめた 1 つの .zip',
    separateMode: '字幕 + メディア（別ファイル）',
    separateModeDesc: '.yomi 字幕とメディアファイルを別々にアップロード',
    yomiFileLabel: '字幕ファイル（.yomi）',
    yomiFileHint: '.yomi ファイルをアップロード（最大 10MB）',
    mediaFileLabel: 'メディアファイル',
    mediaFileHint: `${ALLOWED_MEDIA_EXTENSIONS.join(' / ')} をアップロード（最大 ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB）`,
    mediaRequired: 'メディアファイルを選択してください',
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

  const [uploadKind, setUploadKind] = useState<'yomi' | 'yomibook'>('yomi');
  const [contentTypeChoice, setContentTypeChoice] = useState<'original' | 'third_party'>('third_party');
  const [originalMode, setOriginalMode] = useState<'bundle' | 'separate'>('bundle');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showTranslations, setShowTranslations] = useState(false);
  const [translations, setTranslations] = useState<TranslationForm>(() => toTranslationForm(null));
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [secondaryTranslationLanguage, setSecondaryTranslationLanguage] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('');
  const [sourceShow, setSourceShow] = useState('');
  const [sourceEpisode, setSourceEpisode] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
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

  // A deck is always the uploader's own export, so the third-party / bundled-media
  // branches below never apply to it.
  const isDeck = uploadKind === 'yomibook';
  const useSeparate = !isDeck && contentTypeChoice === 'original' && originalMode === 'separate';

  async function uploadOne(
    f: File,
    kind: 'yomi' | 'zip' | 'media' | 'yomibook'
  ): Promise<{ uploadId: string; storagePath: string }> {
    const urlRes = await fetch('/api/yomi/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: f.name, fileSize: f.size, kind, isZip: kind === 'zip' }),
    });
    const urlData = await urlRes.json();
    if (!urlRes.ok) {
      throw new Error(urlData.error || 'Failed to prepare upload');
    }
    const { uploadId, storagePath, presignedUrl, contentType: uploadContentType } = urlData;
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
      xhr.send(f);
    });
    return { uploadId, storagePath };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Client-side validation
    const fileName = file.name.toLowerCase();
    const isZip = !isDeck && !useSeparate && fileName.endsWith('.zip');

    if (isDeck) {
      if (!fileName.endsWith(YOMIBOOK_EXTENSION)) {
        setErrorMessage(`Deck file must be a ${YOMIBOOK_EXTENSION}`);
        setStatus('error');
        return;
      }
      if (file.size > MAX_YOMIBOOK_FILE_SIZE) {
        setErrorMessage(`.yomibook file too large (max ${MAX_YOMIBOOK_FILE_SIZE / 1024 / 1024}MB)`);
        setStatus('error');
        return;
      }
    } else if (useSeparate) {
      if (!fileName.endsWith('.yomi')) {
        setErrorMessage('Subtitle file must be a .yomi');
        setStatus('error');
        return;
      }
      if (file.size > MAX_YOMI_FILE_SIZE) {
        setErrorMessage(`.yomi file too large (max ${MAX_YOMI_FILE_SIZE / 1024 / 1024}MB)`);
        setStatus('error');
        return;
      }
      if (!mediaFile) {
        setErrorMessage(t.mediaRequired);
        setStatus('error');
        return;
      }
      const mediaExt = `.${mediaFile.name.split('.').pop()?.toLowerCase()}` as typeof ALLOWED_MEDIA_EXTENSIONS[number];
      if (!ALLOWED_MEDIA_EXTENSIONS.includes(mediaExt)) {
        setErrorMessage(`Unsupported media type. Allowed: ${ALLOWED_MEDIA_EXTENSIONS.join(', ')}`);
        setStatus('error');
        return;
      }
      if (mediaFile.size > MAX_AUDIO_FILE_SIZE) {
        setErrorMessage(`Media file too large (max ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB)`);
        setStatus('error');
        return;
      }
    } else {
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
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      // 1. Upload primary file (.yomi, .zip or .yomibook). Its uploadId becomes
      //    the DB record id.
      const { uploadId, storagePath } = await uploadOne(
        file,
        isDeck ? 'yomibook' : isZip ? 'zip' : 'yomi'
      );

      // 2. If separate mode, upload the media file too
      let audioStoragePath: string | undefined;
      let audioFileName: string | undefined;
      if (useSeparate && mediaFile) {
        setProgress(0);
        const mediaResult = await uploadOne(mediaFile, 'media');
        audioStoragePath = mediaResult.storagePath;
        audioFileName = mediaFile.name;
      }

      // 3. Create DB record
      setStatus('creating');
      const res = await fetch('/api/yomi/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          storagePath,
          fileName: file.name,
          isZip,
          fileKind: uploadKind,
          audioStoragePath,
          audioFileName,
          title,
          description: description || undefined,
          translations,
          contentType: isDeck ? 'original' : contentTypeChoice,
          visibility,
          category: isDeck ? undefined : category || undefined,
          language,
          translationLanguage:
            serializeTranslationLanguages([translationLanguage, secondaryTranslationLanguage]) ||
            undefined,
          sourcePlatform: sourcePlatform || undefined,
          sourceShow: sourceShow || undefined,
          sourceEpisode: sourceEpisode || undefined,
          sourceUrl: sourceUrl || undefined,
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
      {/* Upload kind — subtitles vs. memorization deck */}
      <div>
        <label className={labelClass}>{t.uploadKindLabel}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setUploadKind('yomi'); setFile(null); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              uploadKind === 'yomi'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className={uploadKind === 'yomi' ? 'text-[rgb(var(--accent))]' : ''} />
              <span className="font-bold text-sm">{t.kindSubtitle}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{t.kindSubtitleDesc}</p>
          </button>
          <button
            type="button"
            onClick={() => { setUploadKind('yomibook'); setFile(null); setMediaFile(null); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              uploadKind === 'yomibook'
                ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <BookMarked size={16} className={uploadKind === 'yomibook' ? 'text-[rgb(var(--accent))]' : ''} />
              <span className="font-bold text-sm">{t.kindDeck}</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{t.kindDeckDesc}</p>
          </button>
        </div>
      </div>

      {isDeck && (
        <div className="p-4 rounded-xl bg-[rgb(var(--accent))]/5 border border-[rgb(var(--accent))]/20 text-sm text-[var(--muted-foreground)] leading-relaxed">
          {t.deckNotice}
        </div>
      )}

      {/* Content Type Selection */}
      {!isDeck && (
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
      )}

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

      {/* Title and description in other languages */}
      <div className="rounded-xl border border-[var(--border)]">
        <button
          type="button"
          onClick={() => setShowTranslations(!showTranslations)}
          aria-expanded={showTranslations}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-left"
        >
          <span className="inline-flex items-center gap-2">
            <Languages size={16} className="shrink-0 text-[rgb(var(--accent))]" />
            {t.translationsToggle}
          </span>
          <ChevronDown size={16} className={`shrink-0 transition-transform ${showTranslations ? 'rotate-180' : ''}`} />
        </button>
        {showTranslations && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-[var(--muted-foreground)]">{t.translationsHint}</p>
            <TranslationFields
              value={translations}
              onChange={setTranslations}
              originalTitle={title || t.titlePlaceholder}
              originalDescription={description || t.descriptionPlaceholder}
              inputClass={inputClass}
            />
          </div>
        )}
      </div>

      {/* Category */}
      {!isDeck && (
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
      )}

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

      {/* Translation languages (primary + optional secondary) */}
      <div>
        <label className={labelClass}>{t.translationLanguageLabel}</label>
        <select
          value={translationLanguage}
          onChange={(e) => {
            setTranslationLanguage(e.target.value);
            // Clearing the primary drops the secondary; picking the same
            // language for both is not allowed.
            if (!e.target.value || e.target.value === secondaryTranslationLanguage) {
              setSecondaryTranslationLanguage('');
            }
          }}
          className={inputClass}
        >
          <option value="">{t.noTranslation}</option>
          {CONTENT_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>
      </div>

      {translationLanguage && (
        <div>
          <label className={labelClass}>{t.secondaryTranslationLanguageLabel}</label>
          <select
            value={secondaryTranslationLanguage}
            onChange={(e) => setSecondaryTranslationLanguage(e.target.value)}
            className={inputClass}
          >
            <option value="">{t.noTranslation}</option>
            {CONTENT_LANGUAGES.filter((l) => l.id !== translationLanguage).map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Source info (third_party only) */}
      {!isDeck && contentTypeChoice === 'third_party' && (
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
          <div>
            <label className={labelClass}>{t.sourceUrlLabel}</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder={t.sourceUrlPlaceholder}
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

      {/* Original upload mode sub-toggle */}
      {!isDeck && contentTypeChoice === 'original' && (
        <div>
          <label className={labelClass}>{t.originalModeLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setOriginalMode('bundle'); setMediaFile(null); }}
              className={`p-4 rounded-xl border text-left transition-all ${
                originalMode === 'bundle'
                  ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                  : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className={originalMode === 'bundle' ? 'text-[rgb(var(--accent))]' : ''} />
                <span className="font-bold text-sm">{t.bundleMode}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">{t.bundleModeDesc}</p>
            </button>
            <button
              type="button"
              onClick={() => { setOriginalMode('separate'); setFile(null); }}
              className={`p-4 rounded-xl border text-left transition-all ${
                originalMode === 'separate'
                  ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/5'
                  : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Music size={16} className={originalMode === 'separate' ? 'text-[rgb(var(--accent))]' : ''} />
                <span className="font-bold text-sm">{t.separateMode}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">{t.separateModeDesc}</p>
            </button>
          </div>
        </div>
      )}

      {/* File Upload — one input for a deck or a bundle/third_party upload, two
          inputs when the media travels separately */}
      {isDeck ? (
        <div>
          <label className={labelClass}>{t.deckFileLabel}</label>
          <div className="relative">
            <input
              type="file"
              required
              accept={YOMIBOOK_EXTENSION}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-3 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] transition-colors text-center">
              <BookMarked size={24} className="text-[var(--muted-foreground)] mx-auto" />
              <div className="text-left">
                <p className="text-sm font-medium">{file ? file.name : t.deckFileHint}</p>
                {file && (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : useSeparate ? (
        <>
          <div>
            <label className={labelClass}>{t.yomiFileLabel}</label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".yomi"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center gap-3 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] transition-colors text-center">
                <FileText size={24} className="text-[var(--muted-foreground)] mx-auto" />
                <div className="text-left">
                  <p className="text-sm font-medium">{file ? file.name : t.yomiFileHint}</p>
                  {file && (
                    <p className="text-xs text-[var(--muted-foreground)]">{(file.size / 1024).toFixed(1)} KB</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.mediaFileLabel}</label>
            <div className="relative">
              <input
                type="file"
                required
                accept={ALLOWED_MEDIA_EXTENSIONS.join(',')}
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center gap-3 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] transition-colors text-center">
                <Music size={24} className="text-[var(--muted-foreground)] mx-auto" />
                <div className="text-left">
                  <p className="text-sm font-medium">{mediaFile ? mediaFile.name : t.mediaFileHint}</p>
                  {mediaFile && (
                    <p className="text-xs text-[var(--muted-foreground)]">{(mediaFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
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
      )}

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
