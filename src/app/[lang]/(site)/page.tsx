import { getDictionary, Locale } from '@/lib/get-dictionary';
import { getWritingPostsByLocale } from '@/lib/writing';
import HomeClient from './HomeClient';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const posts = (await getWritingPostsByLocale(lang)).slice(0, 4);
  return <HomeClient lang={lang} dict={dict} posts={posts} />;
}
