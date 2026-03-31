import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.about} | Toshiki Tech`,
    description: params.lang === 'en' ? "Learn more about the vision behind Toshiki Tech." : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? "了解 Toshiki Tech 背后的愿景。" : "瞭解 Toshiki Tech 背後的願景。") : "Toshiki Tech の背後にあるビジョンについて。",
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
              : lang === 'zh-tw'
                ? "「我構建的，有時是軟件，有時是想法。」"
                : "「私はモノを作ります。時にはソフトウェア、時には思考を。」"}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert space-y-8">
        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
          {lang === 'en'
            ? "Based in Tokyo, I work across the intersections of embedded systems, AI, and modern product development."
            : lang === 'zh'
              ? "驻地东京，我从事嵌入式系统、AI 与现代产品开发的交叉领域工作。"
              : lang === 'zh-tw'
                ? "駐地東京，我從事嵌入式系統、AI 與現代產品開發的交叉領域工作。"
                : "東京を拠点に、組込みシステム、AI、そしてモダンなプロダクト開発の交差点で活動しています。"}
        </p>

        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
          {lang === 'en'
            ? "Toshiki Tech is a personal operating system for building. My goal is to create real-world solutions that are both technically deep and practically usable. I focus on making complex systems approachable through thoughtful design and engineering excellence."
            : lang === 'zh'
              ? "Toshiki Tech 是构建事物的个人操作系统。我的目标是创建既有技术深度又具实用性的现实世界解决方案。我致力于通过周到的设计和卓越的工程，让复杂的系统变得易于接近。"
              : lang === 'zh-tw'
                ? "Toshiki Tech 是構建事物的個人操作系統。我的目標是創建既有技術深度又具實用性的現實世界解決方案。我致力於通過周到的設計和卓越的工程，讓複雜的系統變得易於接近。"
                : "Toshiki Tech は、構築のための個人的なオペレーティングシステムです。私の目標は、技術的な深さと実用性を兼ね備えた現実世界のソリューションを作り出すことです。思慮深いデザインとエンジニアリングの卓越性を通じて、複雑なシステムを親しみやすいものにすることに注力しています。"}
        </p>

        <section className="pt-12 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {lang === 'en' ? 'Guiding Principles' : (lang === 'zh' || lang === 'zh-tw') ? '核心理念' : '指針'}
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'Applied AI' : (lang === 'zh' || lang === 'zh-tw') ? '應用級 AI' : '応用 AI'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Exploring on-device inference and practical AI integration in real products like YomiPlay."
                  : lang === 'zh'
                    ? "探索在 YomiPlay 等实际产品中的设备端推理和实用的 AI 集成。"
                    : lang === 'zh-tw'
                      ? "探索在 YomiPlay 等實際產品中的設備端推理和實用的 AI 集成。"
                      : "YomiPlay のような実際のプロダクトにおける、オンデバイス推論と実用的なAI統合の探求。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'System Thinking' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '系统思维' : '系統思維') : 'システム思考'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Designing software that scales not just in code, but in utility and maintenance."
                  : lang === 'zh'
                    ? "设计的软件不仅在代码上可扩展，在效用和维护上也具备可持续性。"
                    : lang === 'zh-tw'
                      ? "設計的軟件不僅在代碼上可擴展，在效用和維護上也具備持續性。"
                      : "コードだけでなく、実用性とメンテナンス性においても拡張可能なソフトウェアの設計。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs text-[rgb(var(--accent))]">
                {lang === 'en' ? 'Minimalism' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '极简主义' : '極簡主義') : 'ミニマリズム'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {lang === 'en'
                  ? "Focus on the core essentials, removing noise to create clarity in tools and systems."
                  : lang === 'zh'
                    ? "关注核心本质，消除冗余，在工具和系统中创造清晰度。"
                    : lang === 'zh-tw'
                      ? "關注核心本質，消除冗余，在工具和系統中創造清晰度。"
                      : "本質的な核心に集中し、ノイズを取り除いてツールやシステムに明快さをもたらす。"}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="pt-24 border-t border-[var(--border)] relative overflow-hidden group">
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
              {lang === 'en' ? 'Location' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '驻地' : '駐地') : '拠点'}
            </p>
            <h3 className="text-2xl font-black tracking-tight text-[var(--foreground-rgb)] lowercase">
              tokyo, japan
            </h3>
          </div>
          
          {/* Abstract Map of Japan */}
          <div className="w-full max-w-sm aspect-[4/3] relative flex items-center justify-center group/map">
            {/* Topographic Lines Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden h-full flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-[150%] h-[150%] blur-[2px] transition-transform duration-1000 group-hover/map:scale-110">
                <circle cx="265" cy="148" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
                <circle cx="265" cy="148" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
                <circle cx="265" cy="148" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
                <circle cx="265" cy="148" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 6" />
                <circle cx="265" cy="148" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 7" />
              </svg>
            </div>

            <svg viewBox="0 0 400 300" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
              {/* Detailed Japan Outline */}
              <g className="text-[rgb(var(--accent))] fill-none stroke-current" strokeWidth="1.2" strokeLinejoin="round">
                {/* Hokkaido */}
                <path d="M335,35 L355,25 L370,40 L360,70 L340,75 L335,35 Z" fill="rgba(var(--accent), 0.05)" className="animate-pulse" />
                {/* Honshu */}
                <path d="M320,85 L325,105 L295,130 L270,140 L250,165 L225,175 L200,185 L180,190 L150,205 L130,215 L110,220 L95,235 L75,245 L65,250 L60,240 L85,220 L115,205 L145,195 L175,190 L205,180 L235,165 L265,145 L285,125 L305,105 L320,85 Z" fill="rgba(var(--accent), 0.08)" />
                {/* Shikoku */}
                <path d="M125,225 L145,220 L155,230 L130,235 L125,225 Z" fill="rgba(var(--accent), 0.1)" />
                {/* Kyushu */}
                <path d="M95,250 L115,245 L120,255 L100,260 L95,250 Z" fill="rgba(var(--accent), 0.1)" />
              </g>

              {/* Circuit Path Glow (Abstract) */}
              <path 
                d="M360,35 Q300,100 265,148" 
                className="stroke-[rgb(var(--accent))] opacity-20" 
                fill="none" 
                strokeWidth="0.5" 
                strokeDasharray="4 4"
              />
              <path 
                d="M60,240 Q150,200 265,148" 
                className="stroke-[rgb(var(--accent))] opacity-20" 
                fill="none" 
                strokeWidth="0.5" 
                strokeDasharray="4 4"
              />

              {/* Tokyo Marker (Core Glow) */}
              <g className="filter drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]">
                <circle cx="265" cy="148" r="4" className="text-[rgb(var(--accent))] fill-current" />
                <circle cx="265" cy="148" r="12" className="text-[rgb(var(--accent))] fill-none stroke-current opacity-30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" strokeWidth="2" />
                <circle cx="265" cy="148" r="20" className="text-[rgb(var(--accent))] fill-none stroke-current opacity-10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" strokeWidth="1" />
              </g>
            </svg>
            
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_265px_148px,rgb(var(--accent))_0%,transparent_70%)] opacity-[0.07] pointer-events-none" />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-[var(--muted-foreground)] tracking-tight italic opacity-60">
              {lang === 'en'
                ? '"Working across zones, building for the world."'
                : lang === 'zh'
                  ? '“跨时区协作，为世界而建。”'
                  : lang === 'zh-tw'
                    ? '「跨時區協作，為世界而建。」'
                    : '「タイムゾーンを越え、世界のために。」'}
            </p>
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[8px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tokyo Status: Active / UTC+9
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
