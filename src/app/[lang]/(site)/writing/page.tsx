import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/get-dictionary';
import { getWritingPostsByLocale } from '@/lib/writing';

const LOCALE_FORMAT: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  'zh-tw': 'zh-TW',
};

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  return {
    title: `${dict.common.nav.writing} | Toshiki Tech`,
    description: dict.home.writing.subtitle,
  };
}

export default async function WritingPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const wDict = dict.home.writing;
  const posts = await getWritingPostsByLocale(lang);
  const formatter = new Intl.DateTimeFormat(LOCALE_FORMAT[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="container-custom py-12 md:py-24">
      <div className="mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{wDict.title}</h1>
        <p className="section-subtitle text-xl max-w-2xl leading-relaxed">{wDict.subtitle}</p>
      </div>

      {posts.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--muted)]/20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center mx-auto opacity-50">
              <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent))] animate-pulse" />
            </div>
            <p className="text-[var(--muted-foreground)] font-mono tracking-widest text-xs uppercase opacity-60">
              {wDict.empty}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)] mb-32">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/writing/${post.slug}`}
              className="group grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 py-8 items-start hover:bg-[var(--muted)]/30 -mx-4 px-4 rounded-xl transition-colors"
            >
              <time className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)] pt-1">
                {formatter.format(new Date(post.date))}
              </time>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-[rgb(var(--accent))] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono uppercase tracking-tight text-[var(--muted-foreground)] px-2 py-0.5 rounded border border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRight
                size={18}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(var(--accent))] mt-1"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
