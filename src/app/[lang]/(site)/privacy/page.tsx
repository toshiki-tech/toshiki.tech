import { Locale } from '@/lib/get-dictionary';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }) {
  return {
    title: lang === 'en' ? 'Privacy Policy | Toshiki Tech' : lang === 'zh' ? '隐私政策 | Toshiki Tech' : 'プライバシーポリシー | Toshiki Tech',
  };
}

export default function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">
        {lang === 'en' ? 'Privacy Policy' : lang === 'zh' ? '隐私政策' : 'プライバシーポリシー'}
      </h1>
      
      <div className="space-y-8 text-[var(--muted-foreground)] leading-relaxed">
        <p>
          {lang === 'en' 
            ? "This site is a personal technical hub for Toshiki Tech. We respect your privacy and do not collect any personal data through this website directly, unless you contact us via email." 
            : lang === 'zh'
            ? "本网站是 Toshiki Tech 的个人技术枢纽。我们尊重您的隐私，不会直接通过本网站收集任何个人数据，除非您通过电子邮件与我们联系。"
            : "このサイトは Toshiki Tech の個人的な技術ハブです。私たちはあなたのプライバシーを尊重し、メールでのお問い合わせがない限り、このウェブサイトを通じて直接個人データを収集することはありません。"}
        </p>
        
        <h2 className="text-xl font-bold text-[var(--foreground-rgb)]">
          {lang === 'en' ? 'Data Collection' : lang === 'zh' ? '数据收集' : 'データの収集'}
        </h2>
        
        <p>
          {lang === 'en' 
            ? "We do not use tracking cookies or third-party analytics that identify individual visitors." 
            : lang === 'zh'
            ? "我们不使用跟踪 Cookie 或识别个人访问者的第三方分析工具。"
            : "私たちは、個々の訪問者を特定するようなトラッキングクッキーやサードパーティの分析ツールを使用していません。"}
        </p>
      </div>
    </div>
  );
}
