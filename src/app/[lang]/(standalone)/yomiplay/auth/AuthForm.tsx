'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Locale } from '@/lib/get-dictionary';

const content = {
  en: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    googleSignIn: 'Continue with Google',
    orDivider: 'or',
    switchToSignUp: "Don't have an account? Sign up",
    switchToSignIn: 'Already have an account? Sign in',
    submitting: 'Processing...',
    signUpSuccess: 'Check your email to confirm your account.',
    passwordMismatch: 'Passwords do not match.',
    errorGeneric: 'An error occurred. Please try again.',
  },
  zh: {
    signIn: '登录',
    signUp: '注册',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    googleSignIn: '使用 Google 登录',
    orDivider: '或',
    switchToSignUp: '没有账号？注册',
    switchToSignIn: '已有账号？登录',
    submitting: '处理中...',
    signUpSuccess: '请查看邮箱确认您的账号。',
    passwordMismatch: '两次输入的密码不一致。',
    errorGeneric: '发生错误，请重试。',
  },
  'zh-tw': {
    signIn: '登入',
    signUp: '註冊',
    email: '電子郵件',
    password: '密碼',
    confirmPassword: '確認密碼',
    googleSignIn: '使用 Google 登入',
    orDivider: '或',
    switchToSignUp: '沒有帳���？註冊',
    switchToSignIn: '已有帳號？登入',
    submitting: '處理中...',
    signUpSuccess: '請查看電子郵件以確認您的帳號。',
    passwordMismatch: '兩次輸入的密碼不一致。',
    errorGeneric: '發生錯誤，請重試。',
  },
  ja: {
    signIn: 'ログイン',
    signUp: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    googleSignIn: 'Google でログイン',
    orDivider: 'または',
    switchToSignUp: 'アカウントをお持ちでない方はこちら',
    switchToSignIn: 'アカウントをお持ちの方はこちら',
    submitting: '処理中...',
    signUpSuccess: 'メールを確認してアカウントを有効化してください。',
    passwordMismatch: 'パスワードが一致しません。',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。',
  },
};

export default function AuthForm({ lang }: { lang: Locale }) {
  const t = content[lang] || content.en;
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage(t.passwordMismatch);
      setStatus('error');
      return;
    }

    const supabase = createClient();

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(error.message);
        setStatus('error');
      } else {
        window.location.href = `/${lang}/yomiplay/community`;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${lang}/yomiplay/auth/callback`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
        setStatus('error');
      } else {
        setStatus('success');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${lang}/yomiplay/auth/callback`,
      },
    });
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground-rgb)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-colors';
  const labelClass = 'block text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2';

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t.googleSignIn}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted-foreground)] uppercase">{t.orDivider}</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t.password}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {mode === 'signup' && (
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
          )}

          {status === 'error' && (
            <p className="text-red-500 text-sm">{errorMessage || t.errorGeneric}</p>
          )}
          {status === 'success' && (
            <p className="text-green-500 text-sm">{t.signUpSuccess}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary w-full py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {status === 'submitting' ? t.submitting : mode === 'signin' ? t.signIn : t.signUp}
          </button>
        </form>

        {/* Toggle mode */}
        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setStatus('idle');
            setErrorMessage('');
          }}
          className="w-full text-center text-sm text-[rgb(var(--accent))] hover:underline"
        >
          {mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}
        </button>
      </div>
    </div>
  );
}
