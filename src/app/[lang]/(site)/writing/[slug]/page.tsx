import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/get-dictionary';
import { getAllWritingSlugs, getWritingPost } from '@/lib/writing';

const LOCALE_FORMAT: Record<Locale, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  'zh-tw': 'zh-TW',
};

const BACK_LABEL: Record<Locale, string> = {
  en: 'Back to Writing',
  zh: '返回札记列表',
  ja: 'ノート一覧へ',
  'zh-tw': '返回札記列表',
};

export async function generateStaticParams() {
  const entries = await getAllWritingSlugs();
  return entries.map(({ slug, locale }) => ({ slug, lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale; slug: string } }) {
  const post = await getWritingPost(params.slug, params.lang);
  if (!post) return {};
  return {
    title: `${post.title} | Toshiki Tech`,
    description: post.excerpt,
  };
}

export default async function WritingPostPage({ params }: { params: { lang: Locale; slug: string } }) {
  const post = await getWritingPost(params.slug, params.lang);
  await getDictionary(params.lang);
  if (!post) notFound();
  const formatter = new Intl.DateTimeFormat(LOCALE_FORMAT[params.lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container-custom py-12 md:py-24">
      <Link
        href={`/${params.lang}/writing`}
        className="inline-flex items-center gap-2 mb-12 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors group"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        {BACK_LABEL[params.lang]}
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-12 space-y-4">
          <time className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
            {formatter.format(new Date(post.date))}
          </time>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">{post.excerpt}</p>
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
        </header>

        <div
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-[rgb(var(--accent))] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[var(--muted)] prose-pre:border prose-pre:border-[var(--border)] prose-img:mx-auto prose-img:max-w-[280px] prose-img:rounded-xl prose-img:border prose-img:border-[var(--border)] prose-img:shadow-sm [&_td]:align-middle [&_td_img]:my-0 [&_table]:my-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  );
}
