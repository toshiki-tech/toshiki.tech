import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import AuthForm from './AuthForm';

const content = {
  en: {
    title: 'YomiPlay Community',
    subtitle: 'Sign in to upload and share subtitle files.',
  },
  zh: {
    title: 'YomiPlay 社区',
    subtitle: '登录以上传和分享字幕文件。',
  },
  'zh-tw': {
    title: 'YomiPlay 社區',
    subtitle: '登入以上傳和分享字幕檔案。',
  },
  ja: {
    title: 'YomiPlay コミュニティ',
    subtitle: 'ログインして字幕ファイルをアップロード・共有しましょう。',
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return { title: `${t.title} | Toshiki Tech` };
}

export default function AuthPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t.title}</h1>
        <p className="text-[var(--muted-foreground)]">{t.subtitle}</p>
      </div>
      <AuthForm lang={lang} />
    </div>
  );
}
