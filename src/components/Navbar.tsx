'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import Logo from '@/components/Logo';
import LangSwitcher from '@/components/LangSwitcher';
import { Locale } from '@/lib/get-dictionary';
import { createClient } from '@/lib/supabase-browser';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />
    )}
  </Link>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserNav({ lang, dict }: { lang: Locale; dict: any }) {
  const [user, setUser] = useState<SupabaseUser | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Still loading — render nothing to avoid flicker
  if (user === undefined) return null;

  if (!user) {
    return (
      <Link
        href={`/${lang}/yomiplay/auth`}
        className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground-rgb)] transition-colors whitespace-nowrap"
      >
        {dict.common.nav.signIn}
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/account`}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(var(--accent))]/20 hover:bg-[rgb(var(--accent))]/30 transition-colors text-[rgb(var(--accent))] font-bold text-sm"
      title={dict.common.nav.account}
    >
      {user.email?.[0].toUpperCase() ?? <User size={14} />}
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Navbar = ({ lang, dict }: { lang: Locale; dict: any }) => {
  const pathname = usePathname();
  const navDict = dict.common.nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }
  }, [mobileOpen]);

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const links = [
    { href: `/${lang}/products`, label: navDict.products, match: (p: string) => p.includes('/products') || p.includes('/p/') },
    { href: `/${lang}/writing`, label: navDict.writing, match: (p: string) => p.includes('/writing') },
    { href: `/${lang}/about`, label: navDict.about, match: (p: string) => p.includes('/about') },
    { href: `/${lang}/work-with-me`, label: navDict.workWithMe, match: (p: string) => p.includes('/work-with-me') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="container-custom flex items-center justify-between h-20">
        <Link href={`/${lang}`} className="group flex items-center gap-4">
          <Logo className="w-10 h-10 transition-transform group-hover:scale-110" />
          <span className="text-xl font-black tracking-wide uppercase group-hover:text-[rgb(var(--accent))] transition-colors">
            Toshiki Tech
          </span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-10">
          {/* Desktop nav */}
          <div className="hidden md:flex gap-4 lg:gap-10 items-center">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} active={l.match(pathname || '')}>
                <span className="whitespace-nowrap">{l.label}</span>
              </NavLink>
            ))}
          </div>

          <UserNav lang={lang} dict={dict} />

          <LangSwitcher currentLang={lang} redirectedPathName={redirectedPathName} />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          ref={mobilePanelRef}
          className="md:hidden border-t border-white/5 bg-[var(--background)]/95 backdrop-blur-md"
        >
          <div className="container-custom py-3 flex flex-col">
            {links.map((l) => {
              const active = l.match(pathname || '');
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-2 py-3 text-sm font-bold border-b border-white/5 last:border-0 transition-colors ${
                    active ? 'text-[rgb(var(--accent))]' : 'text-[var(--foreground-rgb)] hover:text-[rgb(var(--accent))]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href={`/${lang}/account`}
              onClick={() => setMobileOpen(false)}
              className="px-2 py-3 text-sm font-bold text-[var(--foreground-rgb)] hover:text-[rgb(var(--accent))] transition-colors"
            >
              {dict.common.nav.account}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
