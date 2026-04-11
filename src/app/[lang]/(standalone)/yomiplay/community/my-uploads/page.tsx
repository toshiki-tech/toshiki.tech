import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Upload, FileText, Music, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { SOURCE_PLATFORMS, CONTENT_LANGUAGES } from '@/lib/yomi-constants';
import DeleteButton from './DeleteButton';
import ShareButton from './ShareButton';
import PointsPanel from './PointsPanel';

const content = {
  en: {
    title: 'My Uploads',
    subtitle: 'Manage your uploaded subtitle files.',
    upload: 'Upload New',
    noUploads: 'You haven\'t uploaded anything yet.',
    status: { pending: 'Pending Review', approved: 'Approved', rejected: 'Rejected' },
    visibility: { public: 'Public', unlisted: 'Unlisted' },
    downloads: 'downloads',
    shareLink: 'Copy Share Link',
    delete: 'Delete',
    community: 'Back to Community',
  },
  zh: {
    title: '我的上传',
    subtitle: '管理你上传的字幕文件。',
    upload: '上传新文件',
    noUploads: '你还没有上传过任何文件。',
    status: { pending: '审核中', approved: '已通过', rejected: '已拒绝' },
    visibility: { public: '公开', unlisted: '不公开' },
    downloads: '次下载',
    shareLink: '复制分享链接',
    delete: '删除',
    community: '返回社区',
  },
  'zh-tw': {
    title: '我的上傳',
    subtitle: '管理你上傳的字幕檔案。',
    upload: '上傳新檔案',
    noUploads: '你還沒有上傳過任何檔案。',
    status: { pending: '審核中', approved: '已通過', rejected: '已拒絕' },
    visibility: { public: '公開', unlisted: '不公開' },
    downloads: '次下載',
    shareLink: '複製分享連結',
    delete: '刪除',
    community: '返回社區',
  },
  ja: {
    title: 'マイアップロード',
    subtitle: 'アップロードした字幕ファイルを管理します。',
    upload: '新規アップロード',
    noUploads: 'まだアップロードがありません。',
    status: { pending: '審査中', approved: '承認済み', rejected: '却下' },
    visibility: { public: '公開', unlisted: '限定公開' },
    downloads: 'ダウンロード',
    shareLink: '共有リンクをコピー',
    delete: '削除',
    community: 'コミュニティに戻る',
  },
};

interface MyUpload {
  id: string;
  title: string;
  content_type: string;
  visibility: string;
  status: string;
  source_platform: string | null;
  source_show: string | null;
  audio_storage_path: string | null;
  language: string;
  download_count: number;
  share_token: string;
  created_at: string;
}

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return { title: `${t.title} | YomiPlay Community` };
}

export default async function MyUploadsPage({ params: { lang } }: { params: { lang: Locale } }) {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/yomiplay/auth`);
  }

  const { data: uploads } = await supabase
    .from('toshiki_tech_yomi_uploads')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_removed', false)
    .order('created_at', { ascending: false });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    approved: 'bg-green-500/10 text-green-600',
    rejected: 'bg-red-500/10 text-red-500',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock size={12} />,
    approved: <CheckCircle2 size={12} />,
    rejected: <XCircle size={12} />,
  };

  return (
    <div className="container-custom py-12">
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

      {!uploads || uploads.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="mx-auto text-[var(--muted-foreground)] mb-4" />
          <p className="text-[var(--muted-foreground)] mb-4">{t.noUploads}</p>
          <Link href={`/${lang}/yomiplay/community`} className="text-sm text-[rgb(var(--accent))] hover:underline">
            {t.community}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {(uploads as MyUpload[]).map((upload) => {
            const platform = SOURCE_PLATFORMS.find(p => p.id === upload.source_platform);
            const langLabel = CONTENT_LANGUAGES.find(l => l.id === upload.language);
            const statusKey = upload.status as keyof typeof t.status;

            return (
              <div
                key={upload.id}
                className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--card)] flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/${lang}/yomiplay/community/${upload.id}`}
                      className="font-bold hover:text-[rgb(var(--accent))] transition-colors truncate"
                    >
                      {upload.title}
                    </Link>
                    {upload.audio_storage_path && (
                      <Music size={14} className="shrink-0 text-green-600" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    {langLabel && <span className="px-2 py-0.5 rounded bg-[var(--muted)]">{langLabel.label}</span>}
                    {platform && <span>{platform.name}{upload.source_show ? ` · ${upload.source_show}` : ''}</span>}
                    <span>{upload.download_count} {t.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[upload.status] || ''}`}>
                    {statusIcons[upload.status]}
                    {t.status[statusKey] || upload.status}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                    {t.visibility[upload.visibility as keyof typeof t.visibility] || upload.visibility}
                  </span>
                  {upload.visibility === 'unlisted' && (
                    <ShareButton lang={lang} uploadId={upload.id} />
                  )}
                  <DeleteButton uploadId={upload.id} label={t.delete} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Points & Pro */}
      <PointsPanel lang={lang} />
    </div>
  );
}
