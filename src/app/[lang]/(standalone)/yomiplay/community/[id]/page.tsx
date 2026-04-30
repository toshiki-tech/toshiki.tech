import { Locale } from '@/lib/get-dictionary';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Music, FileText, Calendar, User, ExternalLink } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES, CONTENT_CATEGORIES } from '@/lib/yomi-constants';
import ReportForm from './ReportForm';

const content = {
  en: {
    back: 'Back to Community',
    download: 'Download .yomi',
    downloadBundle: 'Download Bundle',
    downloadMedia: 'Download Media',
    source: 'Source',
    language: 'Language',
    uploadedBy: 'Uploaded by',
    uploadedOn: 'Uploaded on',
    downloads: 'downloads',
    description: 'Description',
    original: 'Original Content',
    hasAudio: 'Includes Audio',
    listenAt: 'Listen at',
    pending: 'This content is pending review.',
    hiddenNotice: 'This content is currently hidden by an administrator. Only you and admins can see this page.',
  },
  zh: {
    back: '返回社区',
    download: '下载 .yomi',
    downloadBundle: '下载完整包',
    downloadMedia: '下载媒体',
    source: '来源',
    language: '语言',
    uploadedBy: '上传者',
    uploadedOn: '上传时间',
    downloads: '次下载',
    description: '描述',
    original: '原创内容',
    hasAudio: '包含音频',
    listenAt: '收听来源',
    pending: '此内容正在等待审核。',
    hiddenNotice: '此内容当前被管理员隐藏，仅你本人和管理员可见。',
  },
  'zh-tw': {
    back: '返回社區',
    download: '下載 .yomi',
    downloadBundle: '下載完整包',
    downloadMedia: '下載媒體',
    source: '來源',
    language: '語言',
    uploadedBy: '上傳者',
    uploadedOn: '上傳時間',
    downloads: '次下載',
    description: '描述',
    original: '原創內容',
    hasAudio: '包含音訊',
    listenAt: '收聽來源',
    pending: '此內容正在等待審核。',
    hiddenNotice: '此內容目前被管理員隱藏，僅你本人和管理員可見。',
  },
  ja: {
    back: 'コミュニティに戻る',
    download: '.yomi をダウンロード',
    downloadBundle: 'バンドルをダウンロード',
    downloadMedia: 'メディアをダウンロード',
    source: 'ソース',
    language: '言語',
    uploadedBy: '投稿者',
    uploadedOn: '投稿日',
    downloads: 'ダウンロード',
    description: '説明',
    original: 'オリジナルコンテンツ',
    hasAudio: '音声あり',
    listenAt: '配信元',
    pending: 'このコンテンツは審査待ちです。',
    hiddenNotice: 'このコンテンツは現在管理者により非表示にされています。投稿者本人と管理者のみが閲覧できます。',
  },
};

export default async function SubtitleDetailPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  const t = content[lang] || content.en;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: upload } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*, toshiki_tech_yomi_profiles!inner(display_name)')
    .eq('id', id)
    .eq('is_removed', false)
    .single();

  if (!upload) {
    notFound();
  }

  // Hidden uploads are visible only to the uploader and admins.
  if (upload.is_hidden) {
    const { data: { user: viewer } } = await supabase.auth.getUser();
    let allowed = false;
    if (viewer) {
      if (viewer.id === upload.user_id) {
        allowed = true;
      } else {
        const { data: viewerProfile } = await supabase
          .from('toshiki_tech_yomi_profiles')
          .select('role')
          .eq('id', viewer.id)
          .single();
        if (viewerProfile?.role === 'admin') allowed = true;
      }
    }
    if (!allowed) notFound();
  }

  const profile = upload.toshiki_tech_yomi_profiles as Record<string, string> | null;
  const platform = SOURCE_PLATFORMS.find(p => p.id === upload.source_platform);
  const langLabel = CONTENT_LANGUAGES.find(l => l.id === upload.language);
  const categoryDef = CONTENT_CATEGORIES.find(c => c.id === upload.category);
  const categoryLabel = categoryDef ? (categoryDef.labels[lang] || categoryDef.labels.en) : null;
  const tagList: string[] = Array.isArray(upload.tags) ? upload.tags : [];
  const createdDate = new Date(upload.created_at).toLocaleDateString(
    lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : lang === 'zh-tw' ? 'zh-TW' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="container-custom py-12 max-w-3xl">
      <Link
        href={`/${lang}/yomiplay/community`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        {t.back}
      </Link>

      {/* Status banner */}
      {upload.status === 'pending' && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm font-medium">
          {t.pending}
        </div>
      )}
      {upload.is_hidden && (
        <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-medium">
          {t.hiddenNotice}
        </div>
      )}

      {/* Title & badges */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{upload.title}</h1>
        <div className="flex flex-wrap gap-2">
          {categoryLabel && (
            <Link
              href={`/${lang}/yomiplay/community?category=${upload.category}`}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase px-3 py-1 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/20 transition-colors"
            >
              {categoryLabel}
            </Link>
          )}
          {upload.content_type === 'original' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-600">
              <FileText size={12} />
              {t.original}
            </span>
          )}
          {(upload.audio_storage_path || upload.yomi_storage_path?.startsWith('zip/')) && (
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-600">
              <Music size={12} />
              {t.hasAudio}
            </span>
          )}
          {langLabel && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--muted)]">
              {langLabel.label}
            </span>
          )}
        </div>
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tagList.map((tag) => (
              <Link
                key={tag}
                href={`/${lang}/yomiplay/community?tag=${encodeURIComponent(tag)}`}
                className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[rgb(var(--accent))]/10 hover:text-[rgb(var(--accent))] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <User size={16} />
          <span>{t.uploadedBy}: <strong className="text-[var(--foreground-rgb)]">{profile?.display_name || 'Anonymous'}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <Calendar size={16} />
          <span>{t.uploadedOn}: {createdDate}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <Download size={16} />
          <span>{upload.download_count} {t.downloads}</span>
        </div>
      </div>

      {/* Source info */}
      {upload.source_platform && (
        <div className="mb-8 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">{t.source}</h2>
          <p className="font-medium">
            {platform?.name || upload.source_platform} · {upload.source_show}
            {upload.source_episode && ` · ${upload.source_episode}`}
          </p>
          {platform?.domain && (
            <a
              href={`https://${platform.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-[rgb(var(--accent))] hover:underline"
            >
              {t.listenAt} {platform.name}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Description */}
      {upload.description && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">{t.description}</h2>
          <p className="text-[var(--muted-foreground)] whitespace-pre-wrap">{upload.description}</p>
        </div>
      )}

      {/* Download buttons */}
      {upload.status === 'approved' && (() => {
        const isZip = upload.yomi_storage_path?.startsWith('zip/');
        const hasSeparateMedia = !isZip && !!upload.audio_storage_path;
        const primaryLabel = isZip ? t.downloadBundle : t.download;
        return (
          <div className="mb-8 flex flex-wrap gap-3">
            <a
              href={`/api/yomi/download/${upload.id}`}
              className="btn-primary px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
            >
              <Download size={18} />
              {primaryLabel}
            </a>
            {hasSeparateMedia && (
              <a
                href={`/api/yomi/download/${upload.id}?type=media`}
                className="px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 border border-[var(--border)] hover:border-[rgb(var(--accent))]/50 transition-colors"
              >
                <Music size={18} />
                {t.downloadMedia}
              </a>
            )}
          </div>
        );
      })()}

      {/* Report */}
      <ReportForm uploadId={upload.id} lang={lang} />
    </div>
  );
}
