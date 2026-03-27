import { works } from '@/data/works';
import Link from 'next/link';
import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.works} | Toshiki Tech`,
    description: dict.home.works.subtitle,
  };
}

export default async function WorksPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const wDict = dict.home.works;

  return (
    <div className="container-custom py-12 md:py-24">
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{wDict.title}</h1>
        <p className="section-subtitle text-xl max-w-2xl leading-relaxed">
          {wDict.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
        {works.map((work) => {
          const t = work.translations[lang];
          return (
            <div key={work.id} className="group card h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[var(--muted)] relative mb-6">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--muted)]/50 to-transparent z-10" />
                  {work.imageUrl ? (
                    <img 
                      src={work.imageUrl} 
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-[var(--muted-foreground)] opacity-50 border border-dashed border-[var(--border)] rounded-lg">
                      Project Visual
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-[rgb(var(--accent))] transition-colors">{t.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed text-sm">
                  {t.description}
                </p>
              </div>
              
              <div className="pt-10 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {work.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono uppercase tracking-tight text-[var(--muted-foreground)] px-2 py-1 rounded border border-[var(--border)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[rgb(var(--accent))]/5 dark:bg-[rgb(var(--accent))]/10 rounded-3xl p-12 md:p-20 text-center space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {lang === 'en' ? 'Looking to build something?' : lang === 'zh' ? '想要开始构建吗？' : '構築をお考えですか？'}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
           {lang === 'en' 
             ? 'Whether you need a full product build or an AI-driven internal tool, I can help you bridge the gap between idea and deployment.' 
             : lang === 'zh'
             ? '无论是完整的产品构建还是 AI 驱动的内部工具，我都能协助您跨过创意到部署的鸿沟。'
             : 'フルプロダクトの構築からAI主導の内部ツールまで、アイデアからデプロイメントまでのギャップを埋めるお手伝いをします。'}
        </p>
        <div className="pt-4">
          <Link href={`/${lang}/work-with-me`} className="btn-primary inline-flex gap-2 items-center">
            {dict.common.nav.workWithMe}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
