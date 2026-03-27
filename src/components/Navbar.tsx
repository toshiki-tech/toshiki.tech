'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { Locale } from '@/lib/get-dictionary';

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
  <Link 
    href={href} 
    className={`relative group text-sm font-bold transition-colors ${active ? 'text-[rgb(var(--accent))]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground-rgb)]'}`}
  >
    {children}
    {active && (
      <motion.div 
        layoutId="underline"
        className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[rgb(var(--accent))] rounded-full" 
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    )}
  </Link>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Navbar = ({ lang, dict }: { lang: Locale; dict: any }) => {
  const pathname = usePathname();
  const navDict = dict.common.nav;

  // Function to switch locale in the current path
  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="container-custom flex items-center justify-between h-20">
        <Link href={`/${lang}`} className="group flex items-center gap-4">
          <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
          <span className="text-xl font-black tracking-tighter uppercase group-hover:text-[rgb(var(--accent))] transition-colors">
            Toshiki Tech
          </span>
        </Link>
        <div className="hidden md:flex gap-4 lg:gap-10 items-center">
          <NavLink href={`/${lang}/products`} active={pathname.includes('/products') || pathname.includes('/p/')}>
            <span className="whitespace-nowrap">{navDict.products}</span>
          </NavLink>
          <NavLink href={`/${lang}/works`} active={pathname.includes('/works')}>
            <span className="whitespace-nowrap">{navDict.works}</span>
          </NavLink>
          <NavLink href={`/${lang}/ai-lab`} active={pathname.includes('/ai-lab')}>
            <span className="whitespace-nowrap">{navDict.experiments}</span>
          </NavLink>
          <NavLink href={`/${lang}/about`} active={pathname.includes('/about')}>
            <span className="whitespace-nowrap">{navDict.about}</span>
          </NavLink>
          <NavLink href={`/${lang}/work-with-me`} active={pathname.includes('/work-with-me')}>
            <span className="whitespace-nowrap">{navDict.workWithMe}</span>
          </NavLink>
          
          <div className="flex gap-2 ml-2 lg:ml-4 border-l border-[var(--border)] pl-4 lg:pl-6 shrink-0">
            {['en', 'zh', 'ja'].map((loc) => (
              <Link
                key={loc}
                href={redirectedPathName(loc)}
                className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${lang === loc ? 'bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))]' : 'text-[var(--muted-foreground)] border-transparent hover:border-[var(--border)]'}`}
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
