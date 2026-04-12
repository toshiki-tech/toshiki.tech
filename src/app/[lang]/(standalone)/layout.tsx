'use client';

import { Locale } from "@/lib/get-dictionary";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase-browser';
import LangSwitcher from './LangSwitcher';

function AuthNav({ lang }: { lang: Locale }) {
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const isCommunityPage = pathname?.includes('/yomiplay/community') || pathname?.includes('/yomiplay/admin');
  const [points, setPoints] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    // Fetch points and pro status
    supabase
      .from('toshiki_tech_yomi_profiles')
      .select('points, is_pro')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPoints(data.points || 0);
          setIsPro(data.is_pro || false);
        }
      });
    // Trigger daily login (once per session)
    const key = `daily_login_${user.id}_${new Date().toISOString().split('T')[0]}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      fetch('/api/yomi/points/daily-login', { method: 'POST' });
    }
  }, [user]);

  if (!isCommunityPage) return null;

  if (isLoading) {
    return <div className="w-16 h-6 bg-[var(--muted)] rounded animate-pulse" />;
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[var(--foreground-rgb)] hidden sm:inline">
          {displayName}
          {isPro && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400">PRO</span>
          )}
        </span>
        {points !== null && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 hidden sm:inline">
            {points} pts
          </span>
        )}
        <Link
          href={`/${lang}/yomiplay/community/my-uploads`}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
        >
          {lang === 'zh' ? '我的上传' : lang === 'zh-tw' ? '我的上傳' : lang === 'ja' ? 'マイ投稿' : 'My Uploads'}
        </Link>
        <button
          onClick={() => signOut()}
          className="text-xs font-bold text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
        >
          {lang === 'zh' ? '退出' : lang === 'zh-tw' ? '登出' : lang === 'ja' ? 'ログアウト' : 'Sign Out'}
        </button>
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Semi-transparent Mini Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container-custom h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${params.lang}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Logo className="w-6 h-6" />
              <span className="text-sm font-bold tracking-tight uppercase">Toshiki Tech</span>
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
