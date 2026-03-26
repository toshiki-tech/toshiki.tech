import { Locale, getDictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import WorkWithMeClient from './WorkWithMeClient';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.workWithMe} | Toshiki Tech`,
    description: params.lang === 'en' ? "Collaborate with Toshiki Tech to build digital products." : params.lang === 'zh' ? "与 Toshiki Tech 合作构建数字产品。" : "Toshiki Tech と協力してデジタルプロダクトを構築しましょう。",
  };
}

export default async function WorkWithMePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  return (
    <div className="container-custom py-12 md:py-24 max-w-4xl mx-auto">
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{dict.common.nav.workWithMe}</h1>
        <p className="section-subtitle text-xl leading-relaxed">
           {lang === 'en' 
             ? "I help businesses and teams build real, usable digital products. Whether you need a full product build or an AI-driven internal tool, I can help you bridge the gap between idea and deployment." 
             : lang === 'zh'
             ? "我帮助企业和团队构建真实、可用的数字产品。无论是完整的产品构建还是 AI 驱动的内部工具，我都能协助您跨过创意到部署的鸿沟。"
             : "ビジネスやチームが実用的で価値のあるデジタルプロダクトを構築するお手伝いをします。フルプロダクトの開発からAI主導の内部ツールまで、アイデアからデプロイメントまでのギャップを埋める支援をします。"}
        </p>
      </div>

      <div className="space-y-16">
        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-4">
            {lang === 'en' ? 'What I do' : lang === 'zh' ? '服务内容' : '提供できること'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                {lang === 'en' ? 'Business Websites' : lang === 'zh' ? '企业官网' : 'ビジネスサイト構築'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                 {lang === 'en'
                   ? "Strategic web design and development focused on speed, SEO, and conversion for growing businesses."
                   : lang === 'zh'
                   ? "专注于速度、SEO 和转化率的战略性网页设计与开发，助力企业增长。"
                   : "成長するビジネスのための、スピード、SEO、コンバージョンに焦点を当てた戦略的なウェブデザインと開発。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                {lang === 'en' ? 'Internal Systems' : lang === 'zh' ? '内部系统' : '社内システム構築'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                 {lang === 'en'
                   ? "Automation and custom dashboards that streamline operations and enhance team productivity."
                   : lang === 'zh'
                   ? "通过自动化和定制化仪表盘简化运营流程，提升团队生产力。"
                   : "業務を合理化し、チームの生産性を向上させる自動化やカスタムダッシュボード。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                {lang === 'en' ? 'MVP / Product Prototypes' : lang === 'zh' ? 'MVP / 产品原型' : 'MVP / プロトタイプ開発'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                 {lang === 'en'
                   ? "Rapidly turning ideas into working software, from concept to initial release."
                   : lang === 'zh'
                   ? "快速将创意转化为可运行的软件，覆盖从概念到初始版本的全过程。"
                   : "アイデアを迅速に動作するソフトウェアに変え、コンセプトから初期リリースまでをサポート。"}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                {lang === 'en' ? 'AI Feature Integration' : lang === 'zh' ? 'AI 功能集成' : 'AI機能統合'}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                 {lang === 'en'
                   ? "Practical application of Large Language Models and computer vision into existing workflows."
                   : lang === 'zh'
                   ? "将大语言模型（LLM）和计算机视觉（CV）实用化地应用到现有工作流中。"
                   : "大規模言語モデル（LLM）やコンピュータビジョンを既存のワークフローに実用的に組み込みます。"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8 bg-[var(--muted)]/50 p-8 rounded-2xl border border-[var(--border)]">
          <h2 className="text-2xl font-bold tracking-tight">
             {lang === 'en' ? 'How I work' : lang === 'zh' ? '协作方式' : '仕事のスタイル'}
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[rgb(var(--accent))] text-white flex items-center justify-center shrink-0 mt-1">
                 <span className="text-[10px] font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold">
                   {lang === 'en' ? 'Builder Mindset' : lang === 'zh' ? '构建者心态' : 'ビルダー・マインドセット'}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                   {lang === 'en' ? 'Focused on results and usability, not just writing code.' : lang === 'zh' ? '专注于结果和可用性，而不只是编写代码。' : 'コードを書くことだけでなく、成果と使いやすさにフォーカスします。'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[rgb(var(--accent))] text-white flex items-center justify-center shrink-0 mt-1">
                 <span className="text-[10px] font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold">
                   {lang === 'en' ? 'Focus on Maintainability' : lang === 'zh' ? '注重可维护性' : 'メンテナンス性の重視'}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                   {lang === 'en' ? 'Building clean, documented systems that teams can own and grow.' : lang === 'zh' ? '构建干净、文档齐全的系统，让团队能够掌握并持续发展。' : 'チームが所有し、成長させることができるクリーンで文書化されたシステムを構築します。'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[rgb(var(--accent))] text-white flex items-center justify-center shrink-0 mt-1">
                 <span className="text-[10px] font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold">
                   {lang === 'en' ? 'Tokyo-based, Globally Familiar' : lang === 'zh' ? '驻地东京，全球视野' : '東京拠点、グローバルな視点'}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                   {lang === 'en' ? 'Based in Tokyo, familiar with Japanese business context and international best practices.' : lang === 'zh' ? '驻地东京，熟悉日本商务背景及国际最佳实践。' : '東京を拠点とし、日本のビジネスコンテキストと国際的なベストプラクティスの両方に精通しています。'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <WorkWithMeClient lang={lang} dict={dict} />
      </div>
    </div>
  );
}
