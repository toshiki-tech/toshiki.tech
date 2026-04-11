import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Download, Upload, Search, FileText, Music } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES } from '@/lib/yomi-constants';
import Filters from './Filters';

interface YomiUpload {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  visibility: string;
  status: string;
  source_platform: string | null;
  source_show: string | null;
  source_episode: string | null;
  audio_storage_path: string | null;
  language: string;
  download_count: number;
  created_at: string;
  toshiki_tech_yomi_profiles: { display_name: string } | null;
}

const content = {
  en: {
    title: 'YomiPlay Community',
    subtitle: 'Browse and download .yomi subtitle files shared by the community.',
    upload: 'Upload',
    searchPlaceholder: 'Search subtitles...',
    allLanguages: 'All Languages',
    allPlatforms: 'All Platforms',
    noResults: 'No subtitles found. Be the first to upload!',
    downloads: 'downloads',
    pending: 'Pending Review',
    by: 'by',
    original: 'Original',
    episode: 'EP',
  },
  zh: {
    title: 'YomiPlay 社区',
    subtitle: '浏览和下载社区分享的 .yomi 字幕文件。',
    upload: '上传',
    searchPlaceholder: '搜索字幕...',
    allLanguages: '全部语言',
    allPlatforms: '全部平台',
    noResults: '暂无字幕。成为第一个上传者吧！',
    downloads: '次下载',
    pending: '审核中',
    by: '来自',
    original: '原创',
    episode: '第',
  },
  'zh-tw': {
    title: 'YomiPlay 社區',
    subtitle: '瀏覽和下載社區分享的 .yomi 字幕檔案。',
    upload: '上傳',
    searchPlaceholder: '搜尋字幕...',
    allLanguages: '全部語言',
    allPlatforms: '全部平台',
    noResults: '暫無字幕。成為第一個上傳者吧！',
    downloads: '次下載',
    pending: '審核中',
    by: '來自',
    original: '原創',
    episode: '第',
  },
  ja: {
    title: 'YomiPlay コミュニティ',
    subtitle: 'コミュニティで共有された .yomi 字幕ファイルを閲覧・ダウンロード。',
    upload: 'アップロード',
    searchPlaceholder: '字幕を検索...',
    allLanguages: 'すべての言語',
    allPlatforms: 'すべてのプラットフォーム',
    noResults: '字幕がまだありません。最初の投稿者になりましょう！',
    downloads: 'ダウンロード',
    pending: '審査中',
    by: '投稿者',
    original: 'オリジナル',
    episode: 'EP',
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return { title: `${t.title} | Toshiki Tech` };
}

export default async function CommunityPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: { q?: string; language?: string; platform?: string; page?: string };
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

  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*, toshiki_tech_yomi_profiles!inner(display_name)', { count: 'exact' })
    .eq('status', 'approved')
    .eq('visibility', 'public')
    .eq('is_removed', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`);
  }
  if (searchParams.language) {
    query = query.eq('language', searchParams.language);
  }
  if (searchParams.platform) {
    query = query.eq('source_platform', searchParams.platform);
  }

  const { data: uploads, count } = await query;
  const totalPages = Math.ceil((count || 0) / pageSize);

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (searchParams.q) sp.set('q', searchParams.q);
    if (searchParams.language) sp.set('language', searchParams.language);
    if (searchParams.platform) sp.set('platform', searchParams.platform);
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v); else sp.delete(k);
    });
    const qs = sp.toString();
    return `/${lang}/yomiplay/community${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-[var(--muted-foreground)] text-sm">{t.subtitle}</p>
        </div>
        <Link
          href={`/${lang}/yomiplay/community/upload`}
          className="btn-primary px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shrink-0"
        >
          <Upload size={16} />
          {t.upload}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form action={`/${lang}/yomiplay/community`} method="GET" className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            name="q"
            type="text"
            defaultValue={searchParams.q}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))]"
          />
          {searchParams.language && <input type="hidden" name="language" value={searchParams.language} />}
          {searchParams.platform && <input type="hidden" name="platform" value={searchParams.platform} />}
        </form>
        <Filters
          lang={lang}
          currentLanguage={searchParams.language}
          currentPlatform={searchParams.platform}
          currentQuery={searchParams.q}
          allLanguagesLabel={t.allLanguages}
          allPlatformsLabel={t.allPlatforms}
        />
      </div>

      {/* Results */}
      {!uploads || uploads.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
          <p className="text-[var(--muted-foreground)]">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(uploads as YomiUpload[]).map((upload) => {
            const platform = SOURCE_PLATFORMS.find(p => p.id === upload.source_platform);
            const langLabel = CONTENT_LANGUAGES.find(l => l.id === upload.language);

            return (
              <Link
                key={upload.id}
                href={`/${lang}/yomiplay/community/${upload.id}`}
                className="card p-5 border border-[var(--border)] rounded-2xl hover:border-[rgb(var(--accent))]/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg group-hover:text-[rgb(var(--accent))] transition-colors line-clamp-1">
                    {upload.title}
                  </h3>
                  {upload.audio_storage_path && (
                    <span className="shrink-0 ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                      <Music size={10} />
                      Audio
                    </span>
                  )}
                </div>

                {upload.source_show && (
                  <p className="text-sm text-[var(--muted-foreground)] mb-2 line-clamp-1">
                    {platform?.name || ''} · {upload.source_show}
                    {upload.source_episode ? ` · ${upload.source_episode}` : ''}
                  </p>
                )}

                {upload.content_type === 'original' && (
                  <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] mb-2">
                    {t.original}
                  </span>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                    {langLabel && (
                      <span className="px-2 py-0.5 rounded bg-[var(--muted)] font-medium">{langLabel.label}</span>
                    )}
                    <span>{t.by} {upload.toshiki_tech_yomi_profiles?.display_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Download size={12} />
                    {upload.download_count} {t.downloads}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildUrl({ page: String(p) })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-[rgb(var(--accent))] text-white'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
