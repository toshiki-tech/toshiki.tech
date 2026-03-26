import { getDictionary, Locale } from '@/lib/get-dictionary';
import HomeClient from './HomeClient';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  return <HomeClient lang={lang} dict={dict} />;
}
