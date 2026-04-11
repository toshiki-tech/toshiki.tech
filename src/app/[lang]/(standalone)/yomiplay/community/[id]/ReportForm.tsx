'use client';

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import { Flag, X } from 'lucide-react';

const content = {
  en: {
    report: 'Report',
    title: 'Report this content',
    email: 'Your email',
    reason: 'Reason',
    reasonPlaceholder: 'Describe why this content should be reviewed...',
    submit: 'Submit Report',
    submitting: 'Submitting...',
    success: 'Report submitted. Thank you.',
    error: 'Failed to submit report.',
    cancel: 'Cancel',
  },
  zh: {
    report: '举报',
    title: '举报此内容',
    email: '您的邮箱',
    reason: '原因',
    reasonPlaceholder: '描述为什么需要审查此内容...',
    submit: '提交举报',
    submitting: '提交中...',
    success: '举报已提交，感谢您的反馈。',
    error: '提交失败，请重试。',
    cancel: '取消',
  },
  'zh-tw': {
    report: '舉報',
    title: '舉報此內容',
    email: '您的電子郵件',
    reason: '原因',
    reasonPlaceholder: '描述為什麼需要審查此內容...',
    submit: '提交舉報',
    submitting: '提交中...',
    success: '舉報已提交，感謝您的回饋。',
    error: '提交失敗，請重試。',
    cancel: '取消',
  },
  ja: {
    report: '報告',
    title: 'このコンテンツを報告',
    email: 'メールアドレス',
    reason: '理由',
    reasonPlaceholder: 'このコンテンツを審査すべき理由を説明してください...',
    submit: '報告を送信',
    submitting: '送信中...',
    success: '報告が送信されました。ありがとうございます。',
    error: '送信に失敗しました。もう一度お試しください。',
    cancel: 'キャンセル',
  },
};

export default function ReportForm({ uploadId, lang }: { uploadId: string; lang: Locale }) {
  const t = content[lang] || content.en;
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/yomi/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, email, reason }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors inline-flex items-center gap-1"
      >
        <Flag size={12} />
        {t.report}
      </button>
    );
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))]';

  return (
    <div className="mt-6 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">{t.title}</h3>
        <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground-rgb)]">
          <X size={18} />
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-green-500 text-sm">{t.success}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <textarea
            required
            rows={3}
            placeholder={t.reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
          />
          {status === 'error' && <p className="text-red-500 text-xs">{t.error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={status === 'submitting'} className="btn-primary px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
              {status === 'submitting' ? t.submitting : t.submit}
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary px-4 py-2 rounded-xl text-sm">
              {t.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
