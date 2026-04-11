import { products, localizeAppStoreUrl } from '@/data/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
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
    <div className="container-custom py-12 md:py-24">
      <Link href={`/${params.lang}/products`} className="inline-flex items-center gap-2 mb-12 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        {dict.home.productDetail.back}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">{t.title}</h1>
            <p className="text-2xl font-medium text-[var(--accent)] leading-snug">{t.subtitle}</p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">{t.description}</p>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-bold tracking-tight uppercase tracking-wider text-xs text-[var(--muted-foreground)] border-b border-[var(--border)] pb-2">
              {dict.home.productDetail.features}
            </h2>
            <ul className="grid grid-cols-1 gap-6">
              {t.features.map((feature, i) => (
                <li key={i} className="flex gap-4 items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--foreground-rgb)]">{feature}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8 sticky top-24">
          <div className="aspect-[3/4] bg-[var(--muted)] rounded-3xl border border-[var(--border)] overflow-hidden flex items-center justify-center relative shadow-xl">
             <div className="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] m-12 rounded-2xl opacity-50">
               Feature Visualization
             </div>
          </div>

          <div className="card space-y-6">
            <h3 className="text-lg font-bold">
              {dict.home.productDetail.techStack}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.techStack.map((tech) => (
                <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-[var(--border)] font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             {product.externalLinks.map((link) => (
               <a key={link.url} href={localizeAppStoreUrl(link.url, params.lang)} target="_blank" className="btn-primary text-center">
                 {link.label}
               </a>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
