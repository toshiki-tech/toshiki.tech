'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, FolderOpen, ShieldCheck, LogOut, UserCircle } from 'lucide-react';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const navDict = dict.common.nav;
  const labels = {
    account:  navDict.account,
    uploads:  lang === 'zh' ? '我的上传' : lang === 'zh-tw' ? '我的上傳' : lang === 'ja' ? 'マイアップロード' : 'My Uploads',
    admin:    lang === 'zh' ? '管理后台' : lang === 'zh-tw' ? '管理後台' : lang === 'ja' ? '管理画面' : 'Admin Panel',
    signOut:  lang === 'zh' ? '退出' : lang === 'zh-tw' ? '退出' : lang === 'ja' ? 'ログアウト' : 'Sign Out',
    signIn:   navDict.signIn,
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) return;
      supabase
        .from('toshiki_tech_yomi_profiles')
        .select('role')
        .eq('id', u.id)
        .single()
        .then(({ data }) => { if (data?.role === 'admin') setIsAdmin(true); });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${lang}`;
  };

  if (user === undefined) return null;

  if (!user) {
    return (
      <Link
        href={`/${lang}/yomiplay/auth`}
        className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground-rgb)] transition-colors whitespace-nowrap"
      >
        {labels.signIn}
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--muted)] transition-colors"
      >
        <span className="text-xs font-bold text-[var(--foreground-rgb)] max-w-[80px] truncate hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown size={12} className={`text-[var(--muted-foreground)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-[var(--border)] sm:hidden">
            <p className="text-xs font-bold truncate">{displayName}</p>
          </div>
          <Link
            href={`/${lang}/account`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground-rgb)] hover:bg-[var(--muted)] transition-colors"
          >
            <UserCircle size={14} className="text-[var(--muted-foreground)]" />
            {labels.account}
          </Link>
          <Link
            href={`/${lang}/yomiplay/community/my-uploads`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground-rgb)] hover:bg-[var(--muted)] transition-colors"
          >
            <FolderOpen size={14} className="text-[var(--muted-foreground)]" />
            {labels.uploads}
          </Link>
          {isAdmin && (
            <Link
              href={`/${lang}/admin`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[rgb(var(--accent))] hover:bg-[var(--muted)] transition-colors"
            >
              <ShieldCheck size={14} />
              {labels.admin}
            </Link>
          )}
          <div className="h-px bg-[var(--border)] my-1" />
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-[var(--muted)] transition-colors"
          >
            <LogOut size={14} />
            {labels.signOut}
          </button>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Navbar = ({ lang, dict }: { lang: Locale; dict: any }) => {
  const pathname = usePathname();
  const navDict = dict.common.nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
