'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Star, ChevronDown, ChevronUp, ExternalLink, ImagePlus } from 'lucide-react';

const labels = {
  en: {
    myPoints: 'My Points',
    pointsHistory: 'Points History',
    applyPro: 'Apply for Pro',
    proMember: 'Pro Member',
    pendingRequest: 'Pro request pending...',
    needMore: 'Need {n} more points',
    applied: 'Application submitted!',
    noHistory: 'No points history yet.',
    showHistory: 'Show History',
    hideHistory: 'Hide History',
    redeemUrl: 'Open this link in Safari on your iPhone to activate Pro:',
    rejected: 'Your Pro application was not approved.',
    screenshotLabel: 'Please upload a screenshot showing:',
    screenshotHint1: '1. YomiPlay app installed on your device',
    screenshotHint2: '2. iPhone model & iOS version (Settings > General > About)',
    screenshotRequired: 'Screenshot is required',
    selectScreenshot: 'Select screenshot',
  },
  zh: {
    myPoints: '我的积分',
    pointsHistory: '积分记录',
    applyPro: '申请 Pro 会员',
    proMember: 'Pro 会员',
    pendingRequest: 'Pro 申请审核中...',
    needMore: '还需 {n} 积分',
    applied: '申请已提交！',
    noHistory: '暂无积分记录。',
    showHistory: '查看记录',
    hideHistory: '收起记录',
    redeemUrl: '请在 iPhone 的 Safari 中打开以下链接激活 Pro 会员：',
    rejected: '你的 Pro 申请未通过。',
    screenshotLabel: '请上传截图，需包含以下信息：',
    screenshotHint1: '1. 已安装 YomiPlay 应用',
    screenshotHint2: '2. iPhone 型号和 iOS 版本（设置 > 通用 > 关于本机）',
    screenshotRequired: '需要上传截图',
    selectScreenshot: '选择截图',
  },
  'zh-tw': {
    myPoints: '我的積分',
    pointsHistory: '積分記錄',
    applyPro: '申請 Pro 會員',
    proMember: 'Pro 會員',
    pendingRequest: 'Pro 申請審核中...',
    needMore: '還需 {n} 積分',
    applied: '申請已提交！',
    noHistory: '暫無積分記錄。',
    showHistory: '查看記錄',
    hideHistory: '收起記錄',
    redeemUrl: '請在 iPhone 的 Safari 中開啟以下連結以啟用 Pro 會員：',
    rejected: '你的 Pro 申請未通過。',
    screenshotLabel: '請上傳截圖，需包含以下資訊：',
    screenshotHint1: '1. 已安裝 YomiPlay 應用',
    screenshotHint2: '2. iPhone 型號和 iOS 版本（設定 > 一般 > 關於）',
    screenshotRequired: '需要上傳截圖',
    selectScreenshot: '選擇截圖',
  },
  ja: {
    myPoints: 'マイポイント',
    pointsHistory: 'ポイント履歴',
    applyPro: 'Pro 申請',
    proMember: 'Pro メンバー',
    pendingRequest: 'Pro 申請審査中...',
    needMore: 'あと {n} ポイント必要',
    applied: '申請を提出しました！',
    noHistory: 'ポイント履歴がありません。',
    showHistory: '履歴を表示',
    hideHistory: '履歴を隠す',
    redeemUrl: 'iPhone の Safari でこのリンクを開いて Pro を有効化してください：',
    rejected: 'Pro 申請は承認されませんでした。',
    screenshotLabel: 'スクリーンショットをアップロードしてください：',
    screenshotHint1: '1. YomiPlay アプリがインストールされていること',
    screenshotHint2: '2. iPhone のモデルと iOS バージョン（設定 > 一般 > 情報）',
    screenshotRequired: 'スクリーンショットが必要です',
    selectScreenshot: 'スクリーンショットを選択',
  },
};

interface PointsLog {
  id: string;
  action: string;
  points: number;
  description: string | null;
  created_at: string;
}

export default function PointsPanel({ lang }: { lang: string }) {
  const t = labels[lang as keyof typeof labels] || labels.en;
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [threshold, setThreshold] = useState(500);
  const [hasPending, setHasPending] = useState(false);
  const [proRequest, setProRequest] = useState<{ status: string; admin_note: string | null } | null>(null);
  const [logs, setLogs] = useState<PointsLog[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    // Fetch profile
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

    // Fetch threshold
    supabase
      .from('toshiki_tech_yomi_points_config')
      .select('value')
      .eq('key', 'pro_threshold')
      .single()
      .then(({ data }) => {
        if (data) setThreshold(data.value);
      });

    // Check latest pro request
    supabase
      .from('toshiki_tech_yomi_pro_requests')
      .select('status, admin_note')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProRequest(data[0]);
          if (data[0].status === 'pending') setHasPending(true);
        }
      });
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('toshiki_tech_yomi_points_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setLogs(data || []);
    setShowHistory(true);
  };

  const handleApply = async () => {
    if (!screenshot) {
      setScreenshotError(true);
      return;
    }
    setScreenshotError(false);
    setApplying(true);
    const formData = new FormData();
    formData.append('screenshot', screenshot);
    const res = await fetch('/api/yomi/pro/apply', { method: 'POST', body: formData });
    if (res.ok) {
      setApplied(true);
      setHasPending(true);
    }
    setApplying(false);
  };

  if (!user) return null;

  const canApply = points >= threshold && !isPro && !hasPending;
  const progress = Math.min(100, (points / threshold) * 100);

  return (
    <div className="mt-12 p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Star size={18} className="text-yellow-500" />
          {t.myPoints}
        </h2>
        {isPro && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
            <Crown size={12} />
            {t.proMember}
          </span>
        )}
      </div>

      {/* Points display */}
      <div className="text-4xl font-bold mb-2">{points}</div>

      {/* Progress to Pro */}
      {!isPro && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
            <span>0</span>
            <span>Pro: {threshold}</span>
          </div>
          <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {points < threshold && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {t.needMore.replace('{n}', String(threshold - points))}
            </p>
          )}
        </div>
      )}

      {/* Show redeem URL if approved (visible even for Pro users) */}
      {proRequest?.status === 'approved' && proRequest.admin_note && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-sm font-medium text-green-500 mb-2">{t.redeemUrl}</p>
          <a
            href={proRequest.admin_note}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[rgb(var(--accent))] hover:underline break-all"
          >
            <ExternalLink size={14} className="shrink-0" />
            {proRequest.admin_note}
          </a>
        </div>
      )}

      {/* Pro apply form (only for non-Pro users) */}
      {!isPro && (
        <div className="mb-4">
          {/* Show rejected message */}
          {proRequest?.status === 'rejected' && (
            <p className="text-sm text-red-500 font-medium mb-2">{t.rejected}</p>
          )}
          {/* Apply form */}
          {applied ? (
            <p className="text-sm text-green-500 font-medium">{t.applied}</p>
          ) : hasPending ? (
            <p className="text-sm text-yellow-600 font-medium">{t.pendingRequest}</p>
          ) : proRequest?.status !== 'approved' && (
            <div className="space-y-3">
              {/* Screenshot upload */}
              {canApply && (
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-sm font-medium mb-2">{t.screenshotLabel}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{t.screenshotHint1}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mb-3">{t.screenshotHint2}</p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => { setScreenshot(e.target.files?.[0] || null); setScreenshotError(false); }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[var(--border)] hover:border-[rgb(var(--accent))] transition-colors">
                      <ImagePlus size={20} className="text-[var(--muted-foreground)] shrink-0" />
                      <span className="text-sm truncate">
                        {screenshot ? screenshot.name : t.selectScreenshot}
                      </span>
                    </div>
                  </div>
                  {screenshotError && (
                    <p className="text-xs text-red-500 mt-1">{t.screenshotRequired}</p>
                  )}
                </div>
              )}
              <button
                onClick={handleApply}
                disabled={!canApply || applying}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-bold hover:bg-purple-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Crown size={14} />
                {applying ? '...' : t.applyPro}
              </button>
            </div>
          )}
        </div>
      )}

      {/* History toggle */}
      <button
        onClick={() => showHistory ? setShowHistory(false) : loadHistory()}
        className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors flex items-center gap-1"
      >
        {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showHistory ? t.hideHistory : t.showHistory}
      </button>

      {/* History list */}
      {showHistory && (
        <div className="mt-3 space-y-2">
          {logs.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)]">{t.noHistory}</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border)] last:border-0">
                <div>
                  <span className="font-medium">{log.description || log.action}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-bold ${log.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {log.points > 0 ? '+' : ''}{log.points}
                  </span>
                  <span className="text-[var(--muted-foreground)]">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
