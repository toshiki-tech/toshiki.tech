'use client';

import { Locale } from "@/lib/get-dictionary";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, FolderOpen, LogOut, Star, Shield } from 'lucide-react';
import Logo from '@/components/Logo';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase-browser';
import LangSwitcher from '@/components/LangSwitcher';

function AuthNav({ lang }: { lang: Locale }) {
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const isCommunityPage = pathname?.includes('/yomiplay/community') || pathname?.includes('/yomiplay/admin');
  const [points, setPoints] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pointsFeatureEnabled, setPointsFeatureEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    // Fetch points and pro status
    supabase
      .from('toshiki_tech_yomi_profiles')
      .select('points, is_pro, role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPoints(data.points || 0);
          setIsPro(data.is_pro || false);
          setIsAdmin(data.role === 'admin');
        }
      });
    // Resolve feature flags from the public endpoint, then conditionally fire
    // the daily-login bonus once per session.
    fetch('/api/yomiplay/feature-flags')
      .then((r) => r.json())
      .then((data) => {
        const enabled = !!data?.points_feature_enabled;
        setPointsFeatureEnabled(enabled);
        if (!enabled) return;
        const key = `daily_login_${user.id}_${new Date().toISOString().split('T')[0]}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          fetch('/api/yomi/points/daily-login', { method: 'POST' });
        }
      })
      .catch(() => {
        // ignore — leave pointsFeatureEnabled false
      });
  }, [user]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!isCommunityPage) return null;

  if (isLoading) {
    return <div className="w-16 h-6 bg-[var(--muted)] rounded animate-pulse" />;
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const myUploadsLabel = lang === 'zh' ? '我的上传' : lang === 'zh-tw' ? '我的上傳' : lang === 'ja' ? 'マイ投稿' : 'My Uploads';
    const adminLabel = lang === 'zh' ? '管理后台' : lang === 'zh-tw' ? '管理後台' : lang === 'ja' ? '管理画面' : 'Admin Panel';
    const signOutLabel = lang === 'zh' ? '退出' : lang === 'zh-tw' ? '登出' : lang === 'ja' ? 'ログアウト' : 'Sign Out';

    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--muted)] transition-colors"
        >
          <span className="text-xs font-bold text-[var(--foreground-rgb)] hidden sm:inline">
            {displayName}
          </span>
          {isPro && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">
              PRO
            </span>
          )}
          {pointsFeatureEnabled && points !== null && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
              <Star size={10} />
              {points}
            </span>
          )}
          <ChevronDown size={12} className="text-[var(--muted-foreground)]" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-[var(--border)] sm:hidden">
              <p className="text-xs font-bold truncate">{displayName}</p>
            </div>
            <Link
              href={`/${lang}/yomiplay/community/my-uploads`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--foreground-rgb)] hover:bg-[var(--muted)] transition-colors"
            >
              <FolderOpen size={14} />
              {myUploadsLabel}
            </Link>
            {isAdmin && (
              <Link
                href={`/${lang}/yomiplay/admin`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[rgb(var(--accent))] hover:bg-[var(--muted)] transition-colors border-t border-[var(--border)]"
              >
                <Shield size={14} />
                {adminLabel}
              </Link>
            )}
            <button
              onClick={() => { setMenuOpen(false); signOut(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-[var(--muted)] transition-colors"
            >
              <LogOut size={14} />
              {signOutLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/${lang}/yomiplay/auth`}
      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[rgb(var(--accent))] text-white hover:opacity-90 transition-opacity"
    >
      {lang === 'zh' ? '登录' : lang === 'zh-tw' ? '登入' : lang === 'ja' ? 'ログイン' : 'Sign In'}
    </Link>
  );
}

function StandaloneLayoutInner({
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

  const footerLinks: { href: string; label: Record<Locale, string> }[] = [
    { href: 'pricing', label: { en: 'Pricing', zh: '价格', 'zh-tw': '價格', ja: '料金プラン' } },
    { href: 'download', label: { en: 'Download', zh: '下载', 'zh-tw': '下載', ja: 'ダウンロード' } },
    { href: 'help', label: { en: 'Help', zh: '帮助中心', 'zh-tw': '幫助中心', ja: 'ヘルプ' } },
    { href: 'contact', label: { en: 'Contact', zh: '联系我们', 'zh-tw': '聯絡我們', ja: 'お問い合わせ' } },
    { href: 'terms', label: { en: 'Terms of Use', zh: '使用条款', 'zh-tw': '使用條款', ja: '利用規約' } },
    { href: 'privacy', label: { en: 'Privacy Policy', zh: '隐私政策', 'zh-tw': '隱私政策', ja: 'プライバシー' } },
    { href: 'refund', label: { en: 'Refund Policy', zh: '退款政策', 'zh-tw': '退款政策', ja: '返金ポリシー' } },
    { href: 'legal', label: { en: 'Legal Notice', zh: '特商法标示', 'zh-tw': '特商法標示', ja: '特定商取引法表記' } },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Semi-transparent Mini Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container-custom h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${params.lang}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0">
              <Logo className="w-6 h-6" />
              <span className="text-sm font-bold tracking-tight uppercase hidden sm:inline">Toshiki Tech</span>
            </Link>
            <span className="text-[var(--border)] hidden sm:inline select-none">›</span>
            <Link
              href={`/${params.lang}/yomiplay`}
              className="text-sm font-bold text-[var(--foreground-rgb)] hover:text-[rgb(var(--accent))] transition-colors"
            >
              YomiPlay
            </Link>
            <Link
              href={`/${params.lang}/yomiplay/pricing`}
              className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors hidden sm:inline"
            >
              {params.lang === 'zh' ? '价格' : params.lang === 'zh-tw' ? '價格' : params.lang === 'ja' ? '料金' : 'Pricing'}
            </Link>
            <Link
              href={`/${params.lang}/yomiplay/community`}
              className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors hidden sm:inline"
            >
              {params.lang === 'zh' ? '社区' : params.lang === 'zh-tw' ? '社區' : params.lang === 'ja' ? 'コミュニティ' : 'Community'}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <AuthNav lang={params.lang} />
            <LangSwitcher currentLang={params.lang} redirectedPathName={redirectedPathName} />
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
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={`/${params.lang}/yomiplay/${l.href}`}
                className="text-xs text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))]"
              >
                {l.label[params.lang] || l.label.en}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function StandaloneLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <AuthProvider>
      <StandaloneLayoutInner params={params}>
        {children}
      </StandaloneLayoutInner>
    </AuthProvider>
  );
}
