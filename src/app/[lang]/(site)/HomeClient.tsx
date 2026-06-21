'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { products, localizeAppStoreUrl } from '@/data/products';
import { ArrowUpRight, Download, Apple, Puzzle, ExternalLink } from 'lucide-react';
import { Locale } from '@/lib/get-dictionary';
import { detectStore, STORE_LABELS } from '@/lib/external-store';
import type { WritingPostMeta } from '@/lib/writing';

const LOCALE_FORMAT: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  'zh-tw': 'zh-TW',
};

const SectionHeader = ({ title, subtitle, href, cta, lang }: { title: string; subtitle: string; href?: string; cta?: string; lang: Locale }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
    <div className="max-w-xl">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[rgb(var(--accent))] font-mono text-xs uppercase tracking-[0.2em] mb-3 font-bold"
      >
        {lang === 'en' ? 'Explore' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '探索' : '探索') : 'エクスプローラー'}
      </motion.p>
      <h2 className="section-title text-4xl md:text-5xl">{title}</h2>
      <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">{subtitle}</p>
    </div>
    {href && cta && (
      <Link href={`/${lang}${href}`} className="group mt-6 md:mt-0 text-sm font-bold text-[var(--foreground-rgb)] flex items-center gap-2 hover:text-[rgb(var(--accent))] transition-all">
        {cta}
        <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    )}
  </div>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomeClient({ lang, dict, posts }: { lang: Locale; dict: any; posts: WritingPostMeta[] }) {
  const hDict = dict.home;
  const dateFormatter = new Intl.DateTimeFormat(LOCALE_FORMAT[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      {/* Hero Section — Refined Minimalist Layout with Seamless Header Integration */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '60vh' }}>
        {/* Full-width minimalist background layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="/images/hero-banner.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.9) contrast(1.05)' }}
          />
          {/* Deep professional overlay for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--background-start-rgb))] via-[rgb(var(--background-start-rgb))]/40 to-transparent" />
        </motion.div>

        {/* Text content — Consistent left alignment with Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="container-custom w-full relative z-10 flex flex-col space-y-7 pt-40 pb-20"
        >
          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-[1.2] drop-shadow-2xl">
              {(lang === 'zh' || lang === 'zh-tw') ? (
                lang === 'zh' ? <>用代码、AI 与系统思维，构建真正可用的产品。</> : <>用代碼、AI 與系統思維，構築真正可用的產品。</>
              ) : hDict.hero.subtitle}
            </h1>

            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl font-medium">
              {hDict.hero.intro}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 pt-2">
            <Link href={`/${lang}/products`} className="group flex items-center gap-3 bg-white text-black px-9 py-3.5 rounded-2xl font-bold transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]">
              {hDict.hero.cta.viewProducts}
              <ArrowUpRight size={18} strokeWidth={3} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link href={`/${lang}/writing`} className="group px-9 py-3.5 rounded-2xl font-bold bg-white/5 border border-white/10 backdrop-blur-xl text-white transition-all hover:bg-white/10">
              {hDict.hero.cta.readNotes}
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="container-custom py-12 space-y-40">
        {/* Featured Products */}
        <section id="products">
          <SectionHeader
            title={hDict.products.title}
            subtitle={hDict.products.subtitle}
            href="/products"
            cta={hDict.products.all}
            lang={lang}
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {products.slice(0, 3).map((product) => (
              <motion.div key={product.id} variants={item}>
                <article className="group relative card p-0 flex flex-col h-full bg-gradient-to-b from-[var(--card)] to-[var(--muted)]/20 hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
                  <Link
                    href={`/${lang}/p/${product.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={product.translations[lang].title}
                  >
                    <span className="sr-only">{product.translations[lang].title}</span>
                  </Link>
                  <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-[var(--muted)] relative">
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--muted)]/50 to-transparent z-[1]" />
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.translations[lang].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="w-full h-full border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-xs font-mono text-[var(--muted-foreground)] opacity-50">
                          {product.translations[lang].title.toUpperCase()} VIEWPORT
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold tracking-tight">{product.translations[lang].title}</h3>
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(var(--accent))]" />
                    </div>
                    <p className="text-[var(--muted-foreground)] leading-relaxed text-sm h-12 line-clamp-2">
                      {product.translations[lang].subtitle}
                    </p>
                    {product.downloads && (
                      <div className="pt-4 mt-auto">
                        <Link
                          href={`/${lang}/p/${product.slug}#download`}
                          className="relative z-20 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/20 transition-colors"
                        >
                          <Download size={14} />
                          {lang === 'en' ? 'Free download · Mac & Windows' : lang === 'zh' ? '免费下载 · Mac & Windows' : lang === 'zh-tw' ? '免費下載 · Mac & Windows' : '無料ダウンロード · Mac & Windows'}
                        </Link>
                      </div>
                    )}
                    {!product.downloads && product.externalLinks.length > 0 && (() => {
                      const link = product.externalLinks[0];
                      const kind = detectStore(link.url);
                      const labels = STORE_LABELS[lang][kind];
                      const Icon = kind === 'app-store' ? Apple : kind === 'chrome-store' ? Puzzle : ExternalLink;
                      return (
                        <div className="pt-4 mt-auto">
                          <a
                            href={localizeAppStoreUrl(link.url, lang)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-20 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/20 transition-colors"
                          >
                            <Icon size={14} />
                            {labels.long}
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                </article>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Writing */}
        <section id="writing">
          <SectionHeader
            title={hDict.writing.title}
            subtitle={hDict.writing.subtitle}
            href={posts.length > 0 ? '/writing' : undefined}
            cta={posts.length > 0 ? hDict.writing.all : undefined}
            lang={lang}
          />
          {posts.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--muted)]/20">
              <p className="text-[var(--muted-foreground)] font-mono tracking-widest text-xs uppercase opacity-60">
                {hDict.writing.empty}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link
                    href={`/${lang}/writing/${post.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 py-6 items-start hover:bg-[var(--muted)]/30 -mx-4 px-4 rounded-xl transition-colors"
                  >
                    <time className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] pt-1">
                      {dateFormatter.format(new Date(post.date))}
                    </time>
                    <div className="space-y-1.5">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight group-hover:text-[rgb(var(--accent))] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(var(--accent))] mt-1"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-10 py-20 pb-40">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {lang === 'en' ? 'Need a builder?' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '有产品构建需求吗？' : '有產品構築需求嗎？') : '構築のご相談はありますか？'}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
            {lang === 'en'
              ? "I partner with founders and teams to build high-quality products and scalable technical systems."
              : lang === 'zh'
                ? "我与创始人及团队合作，构建高品质产品和可扩展的技术系统。"
                : lang === 'zh-tw'
                  ? "我與創始人及團隊合作，構築高品質產品和可擴展的技术系統。"
                  : "創業者やチームと協力し、高品質なプロダクトと拡張性のある技術システムの構築を支援します。"}
          </p>
          <div className="flex justify-center gap-4">
            <Link href={`/${lang}/work-with-me`} className="btn-primary px-8">
              {dict.common.nav.workWithMe}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
