import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UploadForm from './UploadForm';

const content = {
  en: {
    title: 'Upload Subtitle',
    subtitle: 'Share your .yomi subtitle files with the community.',
    back: 'Back to Community',
  },
  zh: {
    title: '上传字幕',
    subtitle: '与社区分享你的 .yomi 字幕文件。',
    back: '返回社区',
  },
  'zh-tw': {
    title: '上傳字幕',
    subtitle: '與社區分享你的 .yomi 字幕檔案。',
    back: '返回社區',
  },
  ja: {
    title: '字幕をアップロード',
    subtitle: '.yomi 字幕ファイルをコミュニティと共有しましょう。',
    back: 'コミュニティに戻る',
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return { title: `${t.title} | YomiPlay Community` };
}

export default function UploadPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12">
      <Link
        href={`/${lang}/yomiplay/community`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {t.back}
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t.title}</h1>
        <p className="text-[var(--muted-foreground)]">{t.subtitle}</p>
      </div>
      <UploadForm lang={lang} />
    </div>
  );
}
