import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import UploadForm from './UploadForm';

const content = {
  en: {
    title: 'Upload Subtitle',
    subtitle: 'Share your .yomi subtitle files with the community.',
  },
  zh: {
    title: '上传字幕',
    subtitle: '与社区分享你的 .yomi 字幕文件。',
  },
  'zh-tw': {
    title: '上傳字幕',
    subtitle: '與社區分享你的 .yomi 字幕檔案。',
  },
  ja: {
    title: '字幕をアップロード',
    subtitle: '.yomi 字幕ファイルをコミュニティと共有しましょう。',
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
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t.title}</h1>
        <p className="text-[var(--muted-foreground)]">{t.subtitle}</p>
      </div>
      <UploadForm lang={lang} />
    </div>
  );
}
