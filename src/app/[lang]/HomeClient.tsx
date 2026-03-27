'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { works } from '@/data/works';
import { experiments } from '@/data/experiments';
import { ArrowUpRight } from 'lucide-react';
import { Locale } from '@/lib/get-dictionary';

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
        Explore
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
export default function HomeClient({ lang, dict }: { lang: Locale; dict: any }) {
  const hDict = dict.home;

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
              {lang === 'zh' ? (
                <>用代码、AI 与系统思维，构建真正可用的产品。</>
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
            <Link href={`/${lang}/works`} className="group px-9 py-3.5 rounded-2xl font-bold bg-white/5 border border-white/10 backdrop-blur-xl text-white transition-all hover:bg-white/10">
              {hDict.hero.cta.exploreWork}
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
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {products.slice(0, 2).map((product) => (
              <motion.div key={product.id} variants={item}>
                <Link href={`/${lang}/p/${product.slug}`} className="group block h-full">
                  <article className="card p-0 flex flex-col h-full bg-gradient-to-b from-[var(--card)] to-[var(--muted)]/20 hover:-translate-y-1 transition-transform duration-300">
                    <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-[var(--muted)] relative">
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--muted)]/50 to-transparent z-10" />
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
                    <div className="p-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold tracking-tight">{product.translations[lang].title}</h3>
                        <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(var(--accent))]" />
                      </div>
                      <p className="text-[var(--muted-foreground)] leading-relaxed text-sm h-12 line-clamp-2">
                        {product.translations[lang].subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {product.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[var(--border)]/50 border border-[var(--border)] text-[var(--muted-foreground)]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Selected Works */}
        <section id="works">
          <SectionHeader
            title={hDict.works.title}
            subtitle={hDict.works.subtitle}
            href="/works"
            cta={hDict.works.all}
            lang={lang}
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {works.map((work) => (
              <motion.div key={work.id} variants={item} className="p-8 card bg-[var(--card)] flex flex-col justify-between hover:border-[rgb(var(--accent))] transition-colors">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{work.translations[lang].title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
                    {work.translations[lang].description}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-bold text-[var(--muted-foreground)] tracking-widest uppercase">
                  <span>READY.SYS</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full border border-[var(--border)]" />
                    <div className="w-2 h-2 rounded-full border border-[rgb(var(--accent))] bg-[rgb(var(--accent))]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Experiments */}
        <section id="experiments">
          <div className="mb-12">
            <SectionHeader
              title={dict.common.nav.experiments}
              subtitle={lang === 'en' ? "Deep tech exploration, research prototypes, and system designs." : lang === 'zh' ? "深度技术探索、研究原型与系统设计。" : "深層技術の探求、リサーチプロトタイプ、そしてシステム設計。"}
              href="/ai-lab"
              cta={lang === 'en' ? "all experiments" : lang === 'zh' ? "所有实验" : "全ラボ実績"}
              lang={lang}
            />
          </div>
          <div className="space-y-2">
            {experiments.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] hover:bg-[var(--muted)]/40 transition-colors"
              >
                <div className="flex gap-6 items-center">
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">0{idx + 1}</span>
                  <h3 className="text-lg font-bold group-hover:text-[rgb(var(--accent))] transition-colors">{exp.translations[lang].title}</h3>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] md:max-w-md lg:max-w-xl">
                  {exp.translations[lang].description}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* CTA Section */}
        <section className="text-center space-y-10 py-20 pb-40">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {lang === 'en' ? 'Need a builder?' : lang === 'zh' ? '有产品构建需求吗？' : '構築のご相談はありますか？'}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
            {lang === 'en'
              ? "I partner with founders and teams to build high-quality products and scalable technical systems."
              : lang === 'zh'
                ? "我与创始人及团队合作，构建高品质产品和可扩展的技术系统。"
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
