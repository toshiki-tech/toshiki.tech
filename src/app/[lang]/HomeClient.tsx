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
    <div className="container-custom py-12 space-y-40">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between relative gap-12 pt-20 md:pt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 z-10"
        >
          <div 
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--muted)]/50 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {lang === 'en' ? 'Active Building' : lang === 'zh' ? '正在构建中' : '構築中'}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--foreground-rgb)] to-[var(--muted-foreground)] leading-[0.9] md:leading-[1]">
            {hDict.hero.title}
          </h1>
          
          <div className="max-w-xl space-y-6">
            <p className="text-2xl md:text-3xl font-medium text-[var(--foreground-rgb)] leading-tight">
              {hDict.hero.subtitle}
            </p>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] leading-relaxed">
              {hDict.hero.intro}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 pt-4">
            <Link href={`/${lang}/products`} className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 px-8 py-3.5 rounded-xl">
              {hDict.hero.cta.viewProducts}
              <ArrowUpRight size={18} />
            </Link>
            <Link href={`/${lang}/works`} className="btn-secondary px-8 py-3.5 rounded-xl">
              {hDict.hero.cta.exploreWork}
            </Link>
          </div>
        </motion.div>

        <div className="flex-1 w-full relative h-[400px] md:h-[600px] pointer-events-none select-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <img 
              src="/images/hero-banner.png" 
              alt="Toshiki Tech Abstract" 
              className="w-full h-full object-contain object-center opacity-80 dark:opacity-90 rounded-3xl"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)'
              }}
            />
            {/* Ambient glows */}
            <div className="absolute top-1/4 right-1/4 -z-10 w-80 h-80 bg-[rgb(var(--accent))]/15 rounded-full blur-[120px]" />
          </motion.div>
        </div>
      </section>

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
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--muted)]/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                       <div className="w-full h-full border border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-xs font-mono text-[var(--muted-foreground)] opacity-50">
                          {product.translations[lang].title.toUpperCase()} VIEWPORT
                       </div>
                    </div>
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
  );
}
