import { experiments } from '@/data/experiments';
import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.experiments} | Toshiki Tech`,
    description: params.lang === 'en' ? "Technical exploration and research prototypes." : params.lang === 'zh' ? "技术探索与研究原型。" : "技術探求とリサーチプロトタイプ。",
  };
}

export default async function ExperimentsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const eDict = dict.common.nav;

  return (
    <div className="container-custom py-12 md:py-24">
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 uppercase tracking-wider">{eDict.experiments}</h1>
        <p className="section-subtitle text-xl leading-relaxed max-w-none">
           {lang === 'en' 
             ? "The engineering lab where curiosity meets code. These are research prototypes and deep dives into technology that pushes the boundaries of our current products." 
             : lang === 'zh'
             ? "好奇心与代码碰撞的工程实验室。这些是研究原型和深入技术探索，旨在推向现有产品的边界。"
             : "好奇心がコードと出会うエンジニアリングラボ。これらはリサーチプロトタイプであり、現在のプロダクトの限界を押し広げる技術の深掘りです。"}
        </p>
      </div>

      <div className="space-y-12">
        {experiments.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-[var(--border)] rounded-4xl bg-[var(--muted)]/20 shadow-inner">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center mx-auto opacity-50">
                <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent))] animate-pulse" />
              </div>
              <p className="text-[var(--muted-foreground)] font-mono tracking-widest text-xs uppercase opacity-60">
                {lang === 'en' ? 'AI Lab expansion in progress' : lang === 'zh' ? 'AI 实验室项目筹备中' : 'AIラボ・プロジェクト準備中'}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]/40 px-8">
                {lang === 'en' 
                  ? 'I am currently refining new internal research initiatives. Detailed logs and prototypes will be published here soon.'
                  : lang === 'zh'
                  ? '目前正在筹备新的内部研究项目。详细的研究日志与原型将很快在此发布。'
                  : '現在、新しい内部研究プロジェクトを準備しています。詳細なログとプロトタイプは近日公開予定です。'}
              </p>
            </div>
          </div>
        ) : (
          experiments.map((exp) => {
            const t = exp.translations[lang];
            return (
              <div key={exp.id} className="p-10 card border-0 bg-[var(--muted)]/50 rounded-4xl flex flex-col md:flex-row justify-between gap-12 group transition-all hover:bg-[var(--muted)]/80">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                      exp.status === 'prototype' 
                        ? 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border-[rgb(var(--accent))]/20' 
                        : 'bg-[var(--foreground-rgb)]/5 text-[var(--foreground-rgb)]/60 border-[var(--border)]'
                    }`}>
                      {exp.status === 'prototype' ? (lang === 'en' ? 'Prototype' : lang === 'zh' ? '原型阶段' : 'プロトタイプ') : (lang === 'en' ? 'Research' : lang === 'zh' ? '深入研究' : '研究中')}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-[rgb(var(--accent))] transition-colors">{t.title}</h2>
                  <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-4">
                    {t.description}
                  </p>
                </div>
                
                <div className="flex-1 hidden md:block aspect-square max-w-[240px] border border-[var(--border)] rounded-3xl relative overflow-hidden bg-gradient-to-br from-[var(--muted)] to-[var(--background-start-rgb)]">
                   <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono leading-tight text-[var(--muted-foreground)] p-12 text-center opacity-30">
                      {t.title.toUpperCase().split(' ').join('\n')}
                   </div>
                   {/* Pattern overlay */}
                   <div className="absolute inset-0 pointer-events-none grid grid-cols-8 grid-rows-8 opacity-5">
                     {Array.from({ length: 64 }).map((_, i) => (
                       <div key={i} className="border border-[var(--foreground-rgb)]" />
                     ))}
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
