'use client';

import { Locale } from "@/lib/get-dictionary";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function StandaloneLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const pathname = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Semi-transparent Mini Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container-custom h-14 flex items-center justify-between">
          <Link href={`/${params.lang}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Logo className="w-6 h-6" />
            <span className="text-sm font-bold tracking-tight uppercase">Toshiki Tech</span>
          </Link>

          <div className="flex gap-2">
            {[
              { id: 'en', label: 'EN' },
              { id: 'zh', label: 'ZH' },
              { id: 'zh-tw', label: 'TW' },
              { id: 'ja', label: 'JA' }
            ].map((loc) => (
              <Link
                key={loc.id}
                href={redirectedPathName(loc.id)}
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded border transition-colors ${params.lang === loc.id ? 'bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))]' : 'text-[var(--muted-foreground)] border-transparent hover:border-[var(--border)] hover:text-[var(--foreground-rgb)]'}`}
              >
                {loc.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Simple Footer with Copyright and secondary links */}
      <footer className="border-t border-[var(--border)] py-8 mt-12 bg-[var(--background)]">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            © 2026 Toshiki Tech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href={`/${params.lang}/yomiplay/terms`} className="text-xs text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))]">
              {params.lang === 'zh' ? '使用条款' : 
               params.lang === 'zh-tw' ? '使用條款' : 
               params.lang === 'ja' ? '利用規約' : 'Terms of Use'}
            </Link>
            <Link href={`/${params.lang}/yomiplay/privacy`} className="text-xs text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))]">
              {params.lang === 'zh' ? '隐私政策' : 
               params.lang === 'zh-tw' ? '隱私政策' : 
               params.lang === 'ja' ? 'プライバシー' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
