import { redirect } from 'next/navigation';
import { Locale } from '@/lib/get-dictionary';

export default function OldAdminRedirect({ params: { lang } }: { params: { lang: Locale } }) {
  redirect(`/${lang}/admin`);
}
