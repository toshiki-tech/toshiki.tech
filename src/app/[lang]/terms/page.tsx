import { Locale } from '@/lib/get-dictionary';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }) {
  return {
    title: lang === 'en' ? 'Terms of Service | Toshiki Tech' : lang === 'zh' ? '服务条款 | Toshiki Tech' : '利用規約 | Toshiki Tech',
  };
}

export default function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">
        {lang === 'en' ? 'Terms of Service' : lang === 'zh' ? '服务条款' : '利用規約'}
      </h1>
      
      <div className="space-y-8 text-[var(--muted-foreground)] leading-relaxed">
        <p>
          {lang === 'en' 
            ? "All content on Toshiki Tech is for informational purposes. This site is a showcase of my personal and professional work." 
            : lang === 'zh'
            ? "Toshiki Tech 上的所有内容仅供参考。本网站是我个人及专业作品的展示平台。"
            : "Toshiki Tech 上のすべてのコンテンツは情報提供を目的としています。このサイトは、私の個人的および専門的な活動のショーケースです。"}
        </p>
        
        <h2 className="text-xl font-bold text-[var(--foreground-rgb)]">
          {lang === 'en' ? 'Intellectual Property' : lang === 'zh' ? '知识产权' : '知的財産権'}
        </h2>
        
        <p>
          {lang === 'en' 
            ? "Unless otherwise stated, all product designs, code samples, and technical experiments are the intellectual property of Toshiki Tech." 
            : lang === 'zh'
            ? "除非另有说明，否则所有产品设计、代码示例和技术实验均为 Toshiki Tech 的知识产权。"
            : "特に断りのない限り、すべてのプロダクトデザイン、コードサンプル、および技術的な実験は、Toshiki Tech の知的財産です。"}
        </p>
      </div>
    </div>
  );
}
