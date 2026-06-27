'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Locale } from '@/lib/get-dictionary';
import type { User } from '@supabase/supabase-js';
import { Smartphone, CreditCard, Shield, ExternalLink, Loader2, LogOut } from 'lucide-react';

const t = {
  en: {
    title: 'My Account',
    email: 'Email',
    joinedAt: 'Joined',
    products: 'My Products',
    yomiplayPro: 'YomiPlay Pro (Android)',
    status: 'Status',
    active: 'Active',
    cancelPending: 'Active (cancels on',
    canceled: 'Subscription canceled',
    noPro: 'No active subscription',
    plan: { monthly: 'Monthly', yearly: 'Yearly', lifetime: 'Lifetime' },
    expiresOn: 'Renews on',
    endsOn: 'Ends on',
    manageSubscription: 'Manage Subscription',
    goToCommunity: 'Community',
    devices: 'Linked Devices',
    lastSeen: 'Last seen',
    noDevices: 'No devices linked yet.',
    viewProduct: 'View Product',
    security: 'Account Security',
    resetPassword: 'Send Password Reset Email',
    resetSent: 'Reset email sent. Check your inbox.',
    signOut: 'Sign Out',
    loading: 'Loading...',
    redirecting: 'Redirecting to sign in...',
  },
  zh: {
    title: '我的账号',
    email: '邮箱',
    joinedAt: '注册于',
    products: '我的产品',
    yomiplayPro: 'YomiPlay Pro（安卓版）',
    status: '状态',
    active: '订阅中',
    cancelPending: '有效（将于',
    canceled: '订阅已取消',
    noPro: '暂无订阅',
    plan: { monthly: '月付', yearly: '年付', lifetime: '买断' },
    expiresOn: '下次续费',
    endsOn: '到期时间',
    manageSubscription: '管理订阅',
    goToCommunity: '进入社区',
    devices: '已绑定设备',
    lastSeen: '最后活跃',
    noDevices: '暂无已绑定设备。',
    viewProduct: '查看产品动态',
    security: '账号安全',
    resetPassword: '发送密码重置邮件',
    resetSent: '重置邮件已发送，请查看邮箱。',
    signOut: '退出登录',
    loading: '加载中...',
    redirecting: '正在跳转到登录页...',
  },
  'zh-tw': {
    title: '我的帳號',
    email: '電子郵件',
    joinedAt: '註冊於',
    products: '我的產品',
    yomiplayPro: 'YomiPlay Pro（安卓版）',
    status: '狀態',
    active: '訂閱中',
    cancelPending: '有效（將於',
    canceled: '訂閱已取消',
    noPro: '暫無訂閱',
    plan: { monthly: '月付', yearly: '年付', lifetime: '買斷' },
    expiresOn: '下次續費',
    endsOn: '到期時間',
    manageSubscription: '管理訂閱',
    goToCommunity: '進入社區',
    devices: '已綁定裝置',
    lastSeen: '最後活躍',
    noDevices: '暫無已綁定裝置。',
    viewProduct: '查看產品動態',
    security: '帳號安全',
    resetPassword: '發送密碼重設郵件',
    resetSent: '重設郵件已發送，請查看電子郵件。',
    signOut: '退出登入',
    loading: '載入中...',
    redirecting: '正在跳轉至登入頁...',
  },
  ja: {
    title: 'マイアカウント',
    email: 'メールアドレス',
    joinedAt: '登録日',
    products: '購入済みプロダクト',
    yomiplayPro: 'YomiPlay Pro（Android版）',
    status: 'ステータス',
    active: 'サブスク中',
    cancelPending: '有効（',
    canceled: 'サブスク終了',
    noPro: 'サブスクリプションなし',
    plan: { monthly: '月払い', yearly: '年払い', lifetime: '買い切り' },
    expiresOn: '次回更新',
    endsOn: '終了日',
    manageSubscription: 'サブスク管理',
    goToCommunity: 'コミュニティ',
    devices: '登録デバイス',
    lastSeen: '最終確認',
    noDevices: '登録済みデバイスはありません。',
    viewProduct: '製品ページを見る',
    security: 'アカウントセキュリティ',
    resetPassword: 'パスワードリセットメールを送信',
    resetSent: 'リセットメールを送信しました。',
    signOut: 'ログアウト',
    loading: '読み込み中...',
    redirecting: 'ログインページへリダイレクト中...',
  },
};

type Sub = {
  is_pro: boolean;
  plan: string | null;
  status: string | null;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  is_lifetime: boolean;
};

type Device = {
  device_id: string;
  device_name: string | null;
  device_model: string | null;
  device_brand: string | null;
  os_version: string | null;
  app_version: string | null;
  last_seen_at: string;
};

export default function AccountPage({ params: { lang } }: { params: { lang: Locale } }) {
  const c = t[lang] || t.en;
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [sub, setSub] = useState<Sub | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'sent'>('idle');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u || !session) return;

      const bearer = `Bearer ${session.access_token}`;

      fetch('/api/yomiplay/v1/me', { headers: { Authorization: bearer } })
        .then((r) => r.json())
        .then((d) => setSub(d?.data ?? null))
        .catch(() => {});

      fetch('/api/yomiplay/v1/devices', { headers: { Authorization: bearer } })
        .then((r) => r.json())
        .then((d) => setDevices(d?.data?.devices ?? []))
        .catch(() => {});
    });
  }, []);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/yomiplay/billing/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token ?? ''}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const json = await res.json();
      if (json?.data?.url) window.location.href = json.data.url;
    } finally {
      setPortalLoading(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${lang}`;
  };

  const sendResetEmail = async () => {
    if (!user?.email) return;
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/${lang}/yomiplay/auth/reset-password`,
    });
    setResetStatus('sent');
  };

  if (user === undefined) {
    return (
      <div className="container-custom py-20 text-center text-[var(--muted-foreground)]">
        {c.loading}
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = `/${lang}/yomiplay/auth`;
    }
    return (
      <div className="container-custom py-20 text-center text-[var(--muted-foreground)]">
        {c.redirecting}
      </div>
    );
  }

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString(lang === 'en' ? 'en-US' : lang, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const sectionClass = 'rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4';
  const labelClass = 'text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]';
  const valueClass = 'text-sm text-[var(--foreground-rgb)]';

  return (
    <div className="container-custom py-12 max-w-2xl space-y-6">
      <h1 className="text-2xl font-black">{c.title}</h1>

      {/* User info */}
      <div className={sectionClass}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgb(var(--accent))]/20 flex items-center justify-center text-[rgb(var(--accent))] text-xl font-black">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className={valueClass}>{user.email}</p>
            {joinedDate && <p className="text-xs text-[var(--muted-foreground)]">{c.joinedAt} {joinedDate}</p>}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className={sectionClass}>
        <h2 className="font-bold text-base">{c.products}</h2>

        {/* YomiPlay */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{c.yomiplayPro}</span>
            {sub?.is_pro && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))] font-bold">
                Pro
              </span>
            )}
          </div>

          {sub?.is_pro ? (
            <div className="space-y-1">
              <div className="flex gap-6">
                <div>
                  <p className={labelClass}>{c.status}</p>
                  <p className={valueClass}>
                    {sub.cancel_at_period_end
                      ? `${c.cancelPending} ${periodEnd}${lang === 'zh' || lang === 'zh-tw' ? '到期）' : ' ends)'}`
                      : c.active}
                  </p>
                </div>
                {sub.plan && (
                  <div>
                    <p className={labelClass}>Plan</p>
                    <p className={valueClass}>{c.plan[sub.plan as keyof typeof c.plan] ?? sub.plan}</p>
                  </div>
                )}
                {periodEnd && !sub.cancel_at_period_end && !sub.is_lifetime && (
                  <div>
                    <p className={labelClass}>{c.expiresOn}</p>
                    <p className={valueClass}>{periodEnd}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 flex-wrap">
                {!sub.is_lifetime && (
                  <button
                    onClick={openBillingPortal}
                    disabled={portalLoading}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
                  >
                    {portalLoading ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                    {c.manageSubscription}
                  </button>
                )}
                <a
                  href={`/${lang}/yomiplay/community`}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                >
                  <ExternalLink size={13} />
                  {c.goToCommunity}
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--muted-foreground)]">
                {sub?.status === 'canceled' ? c.canceled : c.noPro}
              </p>
              <a
                href={`/${lang}/p/yomiplay`}
                className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                {c.viewProduct}
              </a>
            </div>
          )}

          {/* Devices */}
          {devices !== null && (
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
                <Smartphone size={13} />
                {c.devices} ({devices.length}/3)
              </div>
              {devices.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">{c.noDevices}</p>
              ) : (
                <div className="space-y-2">
                  {devices.map((d) => (
                    <div key={d.device_id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--muted)]/40 text-sm">
                      <div>
                        <p className="font-medium">{d.device_name || d.device_model || d.device_id}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {[d.device_brand, d.os_version ? `Android ${d.os_version}` : null, d.app_version ? `v${d.app_version}` : null]
                            .filter(Boolean).join(' · ')}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {c.lastSeen}: {new Date(d.last_seen_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security */}
      <div className={sectionClass}>
        <h2 className="font-bold text-base flex items-center gap-2">
          <Shield size={16} />
          {c.security}
        </h2>
        {resetStatus === 'sent' ? (
          <p className="text-sm text-green-500">{c.resetSent}</p>
        ) : (
          <button
            onClick={sendResetEmail}
            className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            {c.resetPassword}
          </button>
        )}
      </div>

      {/* Sign out */}
      <div className="pt-2">
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={15} />
          {c.signOut}
        </button>
      </div>
    </div>
  );
}
