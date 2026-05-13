import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import type { Locale } from '@/lib/get-dictionary';

export interface WritingFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export interface WritingPostMeta extends WritingFrontmatter {
  slug: string;
  locale: Locale;
}

export interface WritingPost extends WritingPostMeta {
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'writing');
const POST_FILE_RE = /^(.+?)\.(en|zh|ja|zh-tw)\.md$/;

async function listFiles(): Promise<string[]> {
  try {
    return await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
}

function parseFilename(name: string): { slug: string; locale: Locale } | null {
  const match = name.match(POST_FILE_RE);
  if (!match) return null;
  return { slug: match[1], locale: match[2] as Locale };
}

async function loadFrontmatter(file: string): Promise<WritingPostMeta | null> {
  const parsed = parseFilename(file);
  if (!parsed) return null;
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8');
  const { data } = matter(raw);
  if (!data.title || !data.date || !data.excerpt) return null;
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: String(data.title),
    date: String(data.date),
    excerpt: String(data.excerpt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
  };
}

export async function getWritingPostsByLocale(locale: Locale): Promise<WritingPostMeta[]> {
  const files = await listFiles();
  const metas = await Promise.all(files.map(loadFrontmatter));
  return metas
    .filter((m): m is WritingPostMeta => !!m && m.locale === locale)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllWritingSlugs(): Promise<{ slug: string; locale: Locale }[]> {
  const files = await listFiles();
  return files
    .map(parseFilename)
    .filter((p): p is { slug: string; locale: Locale } => !!p);
}

export async function getWritingPost(slug: string, locale: Locale): Promise<WritingPost | null> {
  const filename = `${slug}.${locale}.md`;
  let raw: string;
  try {
    raw = await fs.readFile(path.join(CONTENT_DIR, filename), 'utf8');
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  if (!data.title || !data.date || !data.excerpt) return null;
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);
  return {
    slug,
    locale,
    title: String(data.title),
    date: String(data.date),
    excerpt: String(data.excerpt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    html: String(processed),
  };
}
