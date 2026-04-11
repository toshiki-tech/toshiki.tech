import Link from 'next/link';
import { products, localizeAppStoreUrl } from '@/data/products';
import { Locale, getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.home.products.title} | Toshiki Tech`,
    description: dict.home.products.subtitle,
  };
}

export default async function ProductsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const pDict = dict.home.products;

  return (
    <div className="container-custom py-12">
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{pDict.title}</h1>
        <p className="section-subtitle text-xl">
          {pDict.subtitle}
        </p>
      </div>

      <div className="space-y-40">
        {products.map((product, index) => {
          const t = product.translations[lang];
          return (
            <div key={product.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}>
              <div className="flex-1 w-full order-1">
                <div className="aspect-[16/10] bg-[var(--muted)] rounded-2xl border border-[var(--border)] relative overflow-hidden group shadow-2xl transition-all hover:-translate-y-1 duration-500">
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--muted)]/50 to-transparent z-10" />
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border)] m-8 rounded-xl opacity-50">
                      {lang === 'en' ? 'Product Preview' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '产品预览' : '產品預覽') : 'プロダクトプレビュー'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
                  <p className="text-xl font-medium text-[rgb(var(--accent))]">{t.subtitle}</p>
                </div>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  {t.description}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pb-4">
                  {t.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm items-start text-[var(--muted-foreground)] leading-snug">
                      <div className="mt-0.5 shrink-0 text-[rgb(var(--accent))]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <Link href={`/${lang}/p/${product.slug}`} className="btn-primary">
                    {lang === 'en' ? 'View Details' : (lang === 'zh' || lang === 'zh-tw') ? (lang === 'zh' ? '查看详情' : '查看詳情') : '詳細を見る'}
                  </Link>
                  {product.externalLinks.length > 0 && (
                    <a href={localizeAppStoreUrl(product.externalLinks[0].url, lang)} target="_blank" className="btn-secondary">
                      {product.externalLinks[0].label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
