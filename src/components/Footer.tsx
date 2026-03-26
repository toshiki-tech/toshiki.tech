import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Footer = ({ lang, dict }: { lang: Locale; dict: any }) => {
  const footerDict = dict.common.footer;
  
  return (
    <footer className="py-12 mt-20 border-t border-[var(--border)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4 tracking-tight">Toshiki Tech</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto md:mx-0">
              {footerDict.desc}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase">{footerDict.pages}</h4>
            <div className="flex flex-col gap-2">
              <Link href={`/${lang}/products`} className="text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors">{dict.common.nav.products}</Link>
              <Link href={`/${lang}/works`} className="text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors">{dict.common.nav.works}</Link>
              <Link href={`/${lang}/experiments`} className="text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors">{dict.common.nav.experiments}</Link>
              <Link href={`/${lang}/about`} className="text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors">{dict.common.nav.about}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wider uppercase">{footerDict.connect}</h4>
            <div className="flex flex-col gap-2">
              <Link href={`/${lang}/work-with-me`} className="text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors">{dict.common.nav.workWithMe}</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} Toshiki Tech. {footerDict.rights}</p>
          <div className="flex gap-4">
            <Link href={`/${lang}/privacy`} className="hover:text-[rgb(var(--accent))] transition-colors">Privacy</Link>
            <Link href={`/${lang}/terms`} className="hover:text-[rgb(var(--accent))] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
