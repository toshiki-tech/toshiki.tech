import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.about} | Toshiki Tech`,
    description: params.lang === 'en' ? "Learn more about the vision behind Toshiki Tech." : params.lang === 'zh' ? "了解 Toshiki Tech 背后的愿景。" : "Toshiki Tech の背後にあるビジョンについて。",
  };
}

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  return (
    <div className="container-custom py-12 md:py-24 max-w-2xl mx-auto space-y-16">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{dict.common.nav.about}</h1>
        <p className="text-xl text-[var(--foreground-rgb)] leading-relaxed italic border-l-4 border-[rgb(var(--accent))] pl-6 py-2">
          {lang === 'en'
            ? '"I build things. Sometimes software, sometimes thoughts."'
            : lang === 'zh'
              ? "“我构建的，有时是软件，有时是想法。”"
              : "「私はモノを作ります。時にはソフトウェア、時には思考を。」"}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert space-y-8">
        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
          {lang === 'en'
            ? "Based in Tokyo, I work across the intersections of embedded systems, AI, and modern product development."
            : lang === 'zh'
              ? "驻地东京，我从事嵌入式系统、AI 与现代产品开发的交叉领域工作。"
              : "東京を拠点に、組込みシステム、AI、そしてモダンなプロダクト開発の交差点で活動しています。"}
        </p>

        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
          {lang === 'en'
            ? "Toshiki Tech is a personal operating system for building. My goal is to create real-world solutions that are both technically deep and practically usable. I focus on making complex systems approachable through thoughtful design and engineering excellence."
            : lang === 'zh'
              ? "Toshiki Tech 是构建事物的个人操作系统。我的目标是创建既有技术深度又具实用性的现实世界解决方案。我致力于通过周到的设计和卓越的工程，让复杂的系统变得易于接近。"
              : "Toshiki Tech は、構築のための個人的なオペレーティングシステムです。私の目標は、技術的な深さと実用性を兼ね備えた現実世界のソリューションを作り出すことです。思慮深いデザインとエンジニアリングの卓越性を通じて、複雑なシステムを親しみやすいものにすることに注力しています。"}
        </p>

        <section className="pt-12 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {lang === 'en' ? 'Guiding Principles' : lang === 'zh' ? '核心理念' : '指針'}
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'Applied AI' : lang === 'zh' ? '应用级 AI' : '応用 AI'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Exploring on-device inference and practical AI integration in real products like YomiPlay."
                  : lang === 'zh'
                    ? "探索在 YomiPlay 等实际产品中的设备端推理和实用的 AI 集成。"
                    : "YomiPlay のような実際のプロダクトにおける、オンデバイス推論と実用的なAI統合の探求。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'System Thinking' : lang === 'zh' ? '系统思维' : 'システム思考'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Designing software that scales not just in code, but in utility and maintenance."
                  : lang === 'zh'
                    ? "设计的软件不仅在代码上可扩展，在效用和维护上也具备可持续性。"
                    : "コードだけでなく、実用性とメンテナンス性においても拡張可能なソフトウェアの設計。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'Minimalism' : lang === 'zh' ? '极简主义' : 'ミニマリズム'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Focus on the core essentials, removing noise to create clarity in tools and systems."
                  : lang === 'zh'
                    ? "关注核心本质，消除冗余，在工具和系统中创造清晰度。"
                    : "本質的な核心に集中し、ノイズを取り除いてツールやシステムに明快さをもたらす。"}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="pt-20 border-t border-[var(--border)] text-center space-y-6">
        <p className="text-sm font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          {lang === 'en' ? 'Location' : lang === 'zh' ? '驻地' : '拠点'}
        </p>
        <p className="text-lg font-medium">Tokyo, Japan</p>
        <p className="text-xs text-[var(--muted-foreground)]">
          {lang === 'en'
            ? 'Working across zones, building for the world.'
            : lang === 'zh'
              ? '跨时区协作，为世界而建。'
              : 'タイムゾーンを越え、世界のために。'}
        </p>
      </section>
    </div>
  );
}
