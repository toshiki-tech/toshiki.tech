'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Locale } from '@/lib/get-dictionary';

const content = {
  en: {
    title: 'Set New Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    submit: 'Update Password',
    submitting: 'Updating...',
    success: 'Password updated. Redirecting...',
    passwordMismatch: 'Passwords do not match.',
    invalidLink: 'This link is invalid or has expired. Please request a new password reset.',
    errorGeneric: 'An error occurred. Please try again.',
    backToSignIn: 'Back to sign in',
  },
  zh: {
    title: '设置新密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    submit: '更新密码',
    submitting: '更新中...',
    success: '密码已更新，正在跳转...',
    passwordMismatch: '两次输入的密码不一致。',
    invalidLink: '链接无效或已过期，请重新申请重置密码。',
    errorGeneric: '发生错误，请重试。',
    backToSignIn: '返回登录',
  },
  'zh-tw': {
    title: '設定新密碼',
    newPassword: '新密碼',
    confirmPassword: '確認新密碼',
    submit: '更新密碼',
    submitting: '更新中...',
    success: '密碼已更新，正在跳轉...',
    passwordMismatch: '兩次輸入的密碼不一致。',
    invalidLink: '連結無效或已過期，請重新申請重設密碼。',
    errorGeneric: '發生錯誤，請重試。',
    backToSignIn: '返回登入',
  },
  ja: {
    title: '新しいパスワードを設定',
    newPassword: '新しいパスワード',
    confirmPassword: 'パスワード確認',
    submit: 'パスワードを更新',
    submitting: '更新中...',
    success: 'パスワードを更新しました。リダイレクト中...',
    passwordMismatch: 'パスワードが一致しません。',
    invalidLink: 'リンクが無効または期限切れです。パスワードリセットを再申請してください。',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。',
    backToSignIn: 'ログインに戻る',
  },
};

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-rgb)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-colors';
const labelClass = 'block text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2';

function ResetPasswordForm({ lang }: { lang: Locale }) {
  const t = content[lang] || content.en;
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'invalid'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!tokenHash || type !== 'recovery') {
      setStatus('invalid');
      return;
    }

    const supabase = createClient();
    supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }).then(({ error }) => {
      setStatus(error ? 'invalid' : 'ready');
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(t.passwordMismatch);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage(error.message);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => {
        window.location.href = `/${lang}/yomiplay/community`;
      }, 2000);
    }
  };

  if (status === 'loading') {
    return <div className="text-center text-[var(--muted-foreground)] py-4">...</div>;
  }

  if (status === 'invalid') {
    return (
      <div className="space-y-4 text-center">
        <p className="text-red-500 text-sm">{t.invalidLink}</p>
        <a href={`/${lang}/yomiplay/auth`} className="block text-sm text-[rgb(var(--accent))] hover:underline">
          {t.backToSignIn}
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold text-center">{t.title}</h1>

      {status === 'success' ? (
        <p className="text-green-500 text-sm text-center">{t.success}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>{t.newPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t.confirmPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm">{errorMessage || t.errorGeneric}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary w-full py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {status === 'submitting' ? t.submitting : t.submit}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
        <Suspense fallback={<div className="text-center text-[var(--muted-foreground)] py-4">...</div>}>
          <ResetPasswordForm lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}
