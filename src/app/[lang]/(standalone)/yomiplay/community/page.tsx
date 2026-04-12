import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Download, Upload, Search, FileText, Music } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES } from '@/lib/yomi-constants';
import Filters from './Filters';
import CommunityIntro from './CommunityIntro';
import PointsRules from './PointsRules';

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
  yomi_storage_path: string | null;
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
    aboutTitle: 'About this community',
    aboutBody: 'YomiPlay Community is a place for Japanese learners to share .yomi subtitle files (transcripts with furigana, timing, and annotations) they have created for their favorite podcasts, videos, and audio programs. Share your work, benefit from others\', and help each other progress.',
    termsTitle: 'Terms & disclaimer',
    termsBody: 'Please read before uploading or downloading:',
    terms: [
      'Upload only content you have the right to share. Do not upload copyrighted audio/video without permission from the rights holder.',
      'For third-party content (podcasts, YouTube, etc.), please upload .yomi subtitle files only — do not redistribute the original audio or video.',
      'Users are responsible for the content they upload. The platform is not liable for user-generated content but will remove infringing material upon valid request.',
      'Uploaded content is shared as-is without warranty. Downloaders are responsible for how they use it.',
      'Prohibited: malware, illegal content, hate speech, personal information of others, or content that violates local laws.',
      'Report issues by clicking the report button on any content page, or contact the admin directly.',
    ],
    viewTerms: 'View terms',
    hideTerms: 'Hide terms',
    learnMore: 'Learn more about YomiPlay →',
    pointsTitle: 'How to earn points',
    pointsSubtitle: 'Earn points through community contributions. Redeem for Pro membership once you reach the threshold.',
    pointsRules: {
      upload_yomi: 'Upload a .yomi file (once approved)',
      upload_zip: 'Upload a ZIP bundle (once approved)',
      download_received: 'Each time someone downloads your content',
      daily_login: 'Daily login bonus',
      pro_threshold: 'Points needed to apply for Pro membership',
    },
    pointsUnit: 'pts',
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
    aboutTitle: '关于本社区',
    aboutBody: 'YomiPlay 社区是一个供日语学习者分享 .yomi 字幕文件（含假名注音、时间轴、注释的文稿）的平台。你可以分享自己为喜爱的播客、视频、音频节目制作的字幕，也能从别人的成果中受益，大家一起进步。',
    termsTitle: '使用条款与免责声明',
    termsBody: '上传或下载前请阅读：',
    terms: [
      '请仅上传你有权分享的内容。未经版权方授权，请勿上传受版权保护的音视频原文件。',
      '对于第三方平台内容（播客、YouTube 等），请只上传 .yomi 字幕文件，不要重新分发原始音视频。',
      '用户需对自己上传的内容负责。本平台对用户生成的内容不承担法律责任，但会在收到有效投诉后及时删除侵权内容。',
      '上传内容按现状分享，不提供任何担保。下载使用者需自行承担使用后果。',
      '严禁上传：恶意软件、非法内容、仇恨言论、他人隐私信息，或违反当地法律的内容。',
      '发现问题请通过内容页的"举报"按钮反馈，或直接联系管理员。',
    ],
    viewTerms: '查看使用条款',
    hideTerms: '收起使用条款',
    learnMore: '了解更多 YomiPlay →',
    pointsTitle: '如何获取积分',
    pointsSubtitle: '通过社区贡献获得积分，积累到门槛后可申请 Pro 会员。',
    pointsRules: {
      upload_yomi: '上传 .yomi 文件（审核通过后）',
      upload_zip: '上传 ZIP 压缩包（审核通过后）',
      download_received: '你的内容每被下载一次',
      daily_login: '每日登录奖励',
      pro_threshold: '申请 Pro 会员所需积分',
    },
    pointsUnit: '分',
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
    aboutTitle: '關於本社區',
    aboutBody: 'YomiPlay 社區是一個供日語學習者分享 .yomi 字幕檔案（含假名注音、時間軸、注釋的文稿）的平台。你可以分享自己為喜愛的播客、影片、音訊節目製作的字幕，也能從別人的成果中受益，大家一起進步。',
    termsTitle: '使用條款與免責聲明',
    termsBody: '上傳或下載前請閱讀：',
    terms: [
      '請僅上傳你有權分享的內容。未經版權方授權，請勿上傳受版權保護的音視訊原檔案。',
      '對於第三方平台內容（播客、YouTube 等），請只上傳 .yomi 字幕檔案，不要重新散佈原始音視訊。',
      '用戶需對自己上傳的內容負責。本平台對用戶生成的內容不承擔法律責任，但會在收到有效投訴後及時刪除侵權內容。',
      '上傳內容按現狀分享，不提供任何擔保。下載使用者需自行承擔使用後果。',
      '嚴禁上傳：惡意軟體、非法內容、仇恨言論、他人隱私資訊，或違反當地法律的內容。',
      '發現問題請透過內容頁的「舉報」按鈕反饋，或直接聯繫管理員。',
    ],
    viewTerms: '查看使用條款',
    hideTerms: '收起使用條款',
    learnMore: '了解更多 YomiPlay →',
    pointsTitle: '如何獲取積分',
    pointsSubtitle: '透過社區貢獻獲得積分，達到門檻後可申請 Pro 會員。',
    pointsRules: {
      upload_yomi: '上傳 .yomi 檔案（審核通過後）',
      upload_zip: '上傳 ZIP 壓縮包（審核通過後）',
      download_received: '你的內容每被下載一次',
      daily_login: '每日登入獎勵',
      pro_threshold: '申請 Pro 會員所需積分',
    },
    pointsUnit: '分',
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
    aboutTitle: 'このコミュニティについて',
    aboutBody: 'YomiPlay コミュニティは、日本語学習者が自作の .yomi 字幕ファイル（ふりがな、タイムライン、注釈付きの文字起こし）を共有する場です。お気に入りのポッドキャスト、動画、音声番組のために作成した字幕を共有し、他の人の成果からも学びながら、一緒に日本語学習を進めましょう。',
    termsTitle: '利用規約と免責事項',
    termsBody: 'アップロードまたはダウンロードの前にお読みください：',
    terms: [
      '共有する権利を有するコンテンツのみをアップロードしてください。権利者の許可なく著作権保護された音声・動画原本を投稿しないでください。',
      '第三者プラットフォームのコンテンツ（ポッドキャスト、YouTube 等）については、.yomi 字幕ファイルのみをアップロードし、元の音声・動画を再配布しないでください。',
      'アップロードしたコンテンツに対してはユーザーが責任を負います。本プラットフォームはユーザー生成コンテンツについて法的責任を負いませんが、正当な申立てを受けた場合は侵害コンテンツを速やかに削除します。',
      'アップロードされたコンテンツは現状有姿で共有され、いかなる保証もありません。ダウンロードしたユーザーはその使用について自己責任となります。',
      '禁止事項：マルウェア、違法コンテンツ、ヘイトスピーチ、他人の個人情報、現地法律に違反するコンテンツ。',
      '問題を発見した場合はコンテンツページの「通報」ボタンからご報告いただくか、管理者に直接ご連絡ください。',
    ],
    viewTerms: '利用規約を見る',
    hideTerms: '利用規約を閉じる',
    learnMore: 'YomiPlay について詳しく →',
    pointsTitle: 'ポイントの獲得方法',
    pointsSubtitle: 'コミュニティへの貢献でポイントを獲得。一定数を達成すると Pro メンバーシップの申請ができます。',
    pointsRules: {
      upload_yomi: '.yomi ファイルのアップロード（審査通過後）',
      upload_zip: 'ZIP バンドルのアップロード（審査通過後）',
      download_received: 'あなたの投稿がダウンロードされるたびに',
      daily_login: '毎日ログインボーナス',
      pro_threshold: 'Pro メンバーシップ申請に必要なポイント',
    },
    pointsUnit: 'pt',
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

  // Fetch points config
  const { data: pointsConfigData } = await supabase
    .from('toshiki_tech_yomi_points_config')
    .select('key, value');
  const pointsConfig: Record<string, number> = {};
  (pointsConfigData || []).forEach((c: { key: string; value: number }) => {
    pointsConfig[c.key] = c.value;
  });

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

      {/* Community intro & terms */}
      <CommunityIntro
        aboutTitle={t.aboutTitle}
        aboutBody={t.aboutBody}
        termsTitle={t.termsTitle}
        termsBody={t.termsBody}
        terms={t.terms}
        expandLabel={t.viewTerms}
        collapseLabel={t.hideTerms}
        learnMoreLabel={t.learnMore}
        learnMoreHref={`/${lang}/p/yomiplay`}
      />

      {/* Points rules */}
      <PointsRules
        config={pointsConfig}
        title={t.pointsTitle}
        subtitle={t.pointsSubtitle}
        rules={t.pointsRules}
        unit={t.pointsUnit}
      />

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
                  {(upload.audio_storage_path || upload.yomi_storage_path?.startsWith('zip/')) && (
                    <span className="shrink-0 ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                      <Music size={10} />
                      Bundle
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
