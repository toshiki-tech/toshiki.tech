import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu, ArrowRight, Users, Upload, Download } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh', 'ja', 'zh-tw'];
  const params: { lang: Locale; slug: string }[] = [];

  for (const locale of locales) {
    for (const product of products) {
      params.push({ lang: locale, slug: product.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { params: { lang: Locale; slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  const t = product.translations[params.lang];
  return {
    title: `${t.title} | Toshiki Tech`,
    description: t.subtitle,
  };
}

export default async function ProductDetailPage({ params }: { params: { lang: Locale; slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  const dict = await getDictionary(params.lang);

  if (!product) {
    notFound();
  }

  const t = product.translations[params.lang];

  return (
    <div className="min-h-screen bg-[var(--background-start-rgb)]">
      {/* Product Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />

        <div className="container-custom">
          <Link href={`/${params.lang}/products`} className="inline-flex items-center gap-2 mb-16 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {params.lang === 'en' ? 'Back to Products' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '返回产品列表' : '返回產品列表') : 'プロダクト一覧へ'}
          </Link>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] text-xs font-black uppercase tracking-widest border border-[rgb(var(--accent))]/20">
              Official Product Location
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[var(--foreground-rgb)]">
              {t.title}
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-[var(--muted-foreground)] max-w-2xl mx-auto italic">
              &quot;{t.subtitle}&quot;
            </p>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      {/* Product Layout */}
      <section className="py-24 border-t border-[var(--border)] bg-[var(--muted)]/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {params.lang === 'en' ? 'Core Features' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '核心功能' : '核心功能') : '主な機能'}
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  {params.lang === 'en'
                    ? 'Built by a developer to solve real-world Japanese immersion pain points.'
                    : params.lang === 'zh'
                      ? '由开发者亲历打造，旨在解决日语沉浸学习中的核心痛点。'
                      : params.lang === 'zh-tw'
                        ? '由開發端親歷打造，旨在解決日語沉浸學習中的核心痛點。'
                        : '開発者自らが日本語学習で直面した課題を解決するために設計されています。'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {t.features.map((feature, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-12">
              {/* Primary Image */}
              <div className={`${product.portraitImageUrl ? 'aspect-[3/4.5] md:aspect-[3/4.5] lg:aspect-[2/3]' : 'aspect-[4/5] md:aspect-square'} bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden relative group`}>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent z-10" />
                {product.imageUrl ? (
                  <img 
                    src={product.portraitImageUrl || product.imageUrl} 
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 opacity-40">
                      <Cpu size={80} className="mx-auto text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Preview */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.gallery.map((img, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-zoom-in">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - YomiPlay only */}
      {product.slug === 'yomiplay' && (
        <section className="py-24 border-t border-[var(--border)]">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                  {params.lang === 'en' ? 'Community' : params.lang === 'zh' ? '社区' : params.lang === 'zh-tw' ? '社區' : 'コミュニティ'}
                </h2>
                <h3 className="text-4xl font-black tracking-tight">
                  {params.lang === 'en'
                    ? 'Subtitle Sharing Platform'
                    : params.lang === 'zh'
                      ? '字幕分享平台'
                      : params.lang === 'zh-tw'
                        ? '字幕分享平台'
                        : '字幕共有プラットフォーム'}
                </h3>
                <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
                  {params.lang === 'en'
                    ? 'Browse and download community-shared .yomi subtitle files, or upload your own polished subtitles to help other learners.'
                    : params.lang === 'zh'
                      ? '浏览和下载社区分享的 .yomi 字幕文件，或上传你精修的字幕帮助其他学习者。'
                      : params.lang === 'zh-tw'
                        ? '瀏覽和下載社區分享的 .yomi 字幕檔案，或上傳你精修的字幕幫助其他學習者。'
                        : 'コミュニティが共有する .yomi 字幕ファイルをダウンロード、またはあなたの字幕をアップロードして他の学習者をサポートしましょう。'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Download size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Download Subtitles' : params.lang === 'zh' ? '下载字幕' : params.lang === 'zh-tw' ? '下載字幕' : '字幕をダウンロード'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Find high-quality .yomi files for podcasts, news, and more.'
                      : params.lang === 'zh'
                        ? '获取播客、新闻等内容的高质量 .yomi 字幕文件。'
                        : params.lang === 'zh-tw'
                          ? '取得播客、新聞等內容的高品質 .yomi 字幕檔案。'
                          : 'ポッドキャスト、ニュースなどの高品質な .yomi ファイルを取得。'}
                  </p>
                </Link>
                <Link
                  href={`/${params.lang}/yomiplay/community/upload`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Upload size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Share Your Work' : params.lang === 'zh' ? '分享你的成果' : params.lang === 'zh-tw' ? '分享你的成果' : 'あなたの成果を共有'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Upload polished subtitles to help learners with lower-spec devices.'
                      : params.lang === 'zh'
                        ? '上传精修字幕，帮助设备性能较低的学习者。'
                        : params.lang === 'zh-tw'
                          ? '上傳精修字幕，幫助裝置效能較低的學習者。'
                          : '精修した字幕をアップロードし、低スペックデバイスの学習者を支援。'}
                  </p>
                </Link>
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Users size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Community Driven' : params.lang === 'zh' ? '社区驱动' : params.lang === 'zh-tw' ? '社區驅動' : 'コミュニティ主導'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Built by learners, for learners. Quality subtitles from real users.'
                      : params.lang === 'zh'
                        ? '学习者为学习者打造，来自真实用户的高质量字幕。'
                        : params.lang === 'zh-tw'
                          ? '學習者為學習者打造，來自真實用戶的高品質字幕。'
                          : '学習者が学習者のために。実際のユーザーによる高品質字幕。'}
                  </p>
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="btn-primary inline-flex gap-2 items-center px-8 py-3 rounded-xl font-bold"
                >
                  {params.lang === 'en' ? 'Explore Community' : params.lang === 'zh' ? '进入社区' : params.lang === 'zh-tw' ? '進入社區' : 'コミュニティを見る'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tech Breakdown */}
      <section className="py-24 border-t border-[var(--border)]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                {params.lang === 'en' ? 'Technical Stack' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '技术栈详情' : '技術棧詳情') : '技術スタック詳細'}
              </h2>
              <h3 className="text-4xl font-black tracking-tight">
                {params.lang === 'en' ? 'Powered by.' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '驱动产品的技术' : '驅動產品的技術') : 'プロダクトを支える技術'}
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.techStack.map((tech) => (
                <div key={tech} className="p-4 text-center rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <p className="font-mono text-xs font-bold uppercase">{tech}</p>
                </div>
              ))}
            </div>

            <div className="card p-12 text-center space-y-8 bg-black text-white dark:border-[var(--muted)]">
              <h4 className="text-2xl font-bold">
                {params.lang === 'en'
                  ? 'Interested in the implementation?'
                  : params.lang === 'zh'
                    ? '对此项目的实现感兴趣吗？'
                    : params.lang === 'zh-tw'
                      ? '對此項目的實現感興趣嗎？'
                      : 'この実装に興味がありますか？'}
              </h4>
              <p className="text-gray-400">
                {params.lang === 'en'
                  ? 'This project is part of the Toshiki Tech internal ecosystem.'
                  : params.lang === 'zh'
                    ? '该项目是 Toshiki Tech 内部生态系统的一部分。'
                    : params.lang === 'zh-tw'
                      ? '該項目是 Toshiki Tech 內部生態系統的一部分。'
                      : 'このプロジェクトは Toshiki Tech の内部エコシステムの一部です。'}
              </p>
              <Link href={`/${params.lang}/work-with-me`} className="btn-primary inline-flex gap-2 items-center">
                {dict.common.nav.workWithMe}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
