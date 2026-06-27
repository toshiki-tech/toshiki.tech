import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Apple, Smartphone, ArrowRight, CheckCircle2, Users, MessageCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { getFeatureFlags } from '@/lib/yomi-feature-flags';

export async function generateStaticParams() {
  return (['en', 'zh', 'ja', 'zh-tw'] as Locale[]).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[params.lang] ?? content.en;
  return {
    title: `YomiPlay — ${t.tagline}`,
    description: t.description,
  };
}

const content = {
  en: {
    tagline: 'Immersive Japanese learning through audio & video',
    description: 'YomiPlay transforms your favorite audio and video into powerful Japanese learning materials — available on iOS and Android.',
    sub: 'Available on iOS & Android',
    downloadIos: 'Download on the App Store',
    downloadAndroid: 'Download Android APK',
    learnMore: 'Learn more',
    featuresTitle: 'Built for serious learners',
    features: [
      { title: 'AI-powered subtitles', body: 'On-device Whisper recognition turns any audio or video into accurate, editable subtitles — no internet required.' },
      { title: 'Immersive shadowing', body: 'Sentence-by-sentence playback with furigana, romaji, and translation lets you shadow at your own pace.' },
      { title: 'Community library', body: 'Download subtitle files shared by the community, or contribute your own.' },
      { title: 'TTS & export (Premium)', body: 'Text-to-speech for any subtitle line, plus import/export of .yomi subtitle files.' },
    ],
    pricingEyebrow: 'Pricing',
    pricingTitle: 'Start free, upgrade when ready',
    pricingNote: 'Prices apply to the Android version. iOS pricing is set by the App Store.',
    plans: [
      { name: 'Free', price: '¥0', period: '', badge: null },
      { name: 'Monthly', price: '¥180', period: '/mo', badge: null },
      { name: 'Yearly', price: '¥1,480', period: '/yr', badge: 'Best value' },
      { name: 'Lifetime', price: '¥2,980', period: '', badge: 'One-time' },
    ],
    viewPricing: 'Full pricing details',
    communityTitle: 'Join the community',
    communitySub: 'Share subtitle resources, earn points, and learn together.',
    communityBtn: 'Browse community',
  },
  zh: {
    tagline: '通过音视频沉浸式学习日语',
    description: 'YomiPlay 将您喜爱的音视频转化为强大的日语学习材料，支持 iOS 与 Android 双平台。',
    sub: '支持 iOS 与 Android',
    downloadIos: '在 App Store 下载',
    downloadAndroid: '下载安卓 APK',
    learnMore: '了解更多',
    featuresTitle: '为认真的学习者而生',
    features: [
      { title: 'AI 字幕生成', body: '设备端 Whisper 识别将任何音视频转为精准可编辑字幕，无需网络。' },
      { title: '沉浸式跟读', body: '逐句播放配合假名标注、罗马字和翻译，按自己的节奏练习跟读。' },
      { title: '社区字幕库', body: '下载社区成员分享的字幕资源，或上传自己的作品。' },
      { title: '朗读与导出（Premium）', body: '对任意字幕行进行文字转语音，支持 .yomi 字幕文件的导入导出。' },
    ],
    pricingEyebrow: '价格',
    pricingTitle: '免费开始，随时升级',
    pricingNote: '以上价格适用于 Android 版本，iOS 版本价格以 App Store 为准。',
    plans: [
      { name: '免费版', price: '¥0', period: '', badge: null },
      { name: '月付', price: '¥180', period: '/月', badge: null },
      { name: '年付', price: '¥1,480', period: '/年', badge: '最划算' },
      { name: '买断', price: '¥2,980', period: '', badge: '一次付清' },
    ],
    viewPricing: '查看完整价格方案',
    communityTitle: '加入社区',
    communitySub: '分享字幕资源、获取积分，一起学日语。',
    communityBtn: '浏览社区',
  },
  'zh-tw': {
    tagline: '透過影音沉浸式學習日語',
    description: 'YomiPlay 將您喜愛的影音轉化為強大的日語學習材料，支援 iOS 與 Android 雙平台。',
    sub: '支援 iOS 與 Android',
    downloadIos: '在 App Store 下載',
    downloadAndroid: '下載安卓 APK',
    learnMore: '了解更多',
    featuresTitle: '為認真的學習者而生',
    features: [
      { title: 'AI 字幕生成', body: '裝置端 Whisper 識別將任何影音轉為精準可編輯字幕，無需網路。' },
      { title: '沉浸式跟讀', body: '逐句播放配合假名標注、羅馬字和翻譯，按自己的節奏練習跟讀。' },
      { title: '社群字幕庫', body: '下載社群成員分享的字幕資源，或上傳自己的作品。' },
      { title: '朗讀與匯出（Premium）', body: '對任意字幕行進行文字轉語音，支援 .yomi 字幕檔案的匯入匯出。' },
    ],
    pricingEyebrow: '價格',
    pricingTitle: '免費開始，隨時升級',
    pricingNote: '以上價格適用於 Android 版本，iOS 版本價格以 App Store 為準。',
    plans: [
      { name: '免費版', price: '¥0', period: '', badge: null },
      { name: '月付', price: '¥180', period: '/月', badge: null },
      { name: '年付', price: '¥1,480', period: '/年', badge: '最划算' },
      { name: '買斷', price: '¥2,980', period: '', badge: '一次付清' },
    ],
    viewPricing: '查看完整價格方案',
    communityTitle: '加入社群',
    communitySub: '分享字幕資源、獲取積分，一起學日語。',
    communityBtn: '瀏覽社群',
  },
  ja: {
    tagline: '音声・動画で日本語を没入学習',
    description: 'YomiPlayは、お気に入りの音声・動画を強力な日本語学習材料に変えます。iOS・Android 両対応。',
    sub: 'iOS & Android 対応',
    downloadIos: 'App Store からダウンロード',
    downloadAndroid: 'Android APK をダウンロード',
    learnMore: '詳細を見る',
    featuresTitle: '本気の学習者のために',
    features: [
      { title: 'AI 字幕生成', body: 'オンデバイス Whisper 認識であらゆる音声・動画を正確な字幕に変換。ネット不要。' },
      { title: '没入型シャドーイング', body: 'ふりがな・ローマ字・翻訳付きで文単位再生。自分のペースでシャドーイング。' },
      { title: 'コミュニティライブラリ', body: 'コミュニティが共有する字幕リソースをダウンロード、または自作を投稿。' },
      { title: '読み上げ・エクスポート（Premium）', body: '任意の字幕行をテキスト読み上げ、.yomi ファイルのインポート・エクスポートも対応。' },
    ],
    pricingEyebrow: '料金',
    pricingTitle: '無料で始めて、準備できたらアップグレード',
    pricingNote: '上記の価格は Android 版の料金です。iOS 版は App Store の価格が適用されます。',
    plans: [
      { name: '無料版', price: '¥0', period: '', badge: null },
      { name: '月払い', price: '¥180', period: '/月', badge: null },
      { name: '年払い', price: '¥1,480', period: '/年', badge: 'お得' },
      { name: '買い切り', price: '¥2,980', period: '', badge: '一括払い' },
    ],
    viewPricing: '詳細な料金プランを見る',
    communityTitle: 'コミュニティに参加',
    communitySub: '字幕リソースを共有し、ポイントを獲得して一緒に学ぼう。',
    communityBtn: 'コミュニティを見る',
  },
} as const satisfies Record<Locale, {
  tagline: string; description: string; sub: string;
  downloadIos: string; downloadAndroid: string; learnMore: string;
  featuresTitle: string; features: { title: string; body: string }[];
  pricingEyebrow: string; pricingTitle: string; pricingNote: string;
  plans: { name: string; price: string; period: string; badge: string | null }[];
  viewPricing: string; communityTitle: string; communitySub: string; communityBtn: string;
}>;

export default async function YomiPlayHomePage({ params }: { params: { lang: Locale } }) {
  const t = content[params.lang] ?? content.en;

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''
  );
  const flags = await getFeatureFlags(supa);
  const communityEnabled = flags.community_enabled;

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--accent)_0%,transparent_60%)]" />
        <div className="container-custom max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Image
              src="/images/products/yomiplay-portrait.png"
              alt="YomiPlay"
              width={80}
              height={80}
              className="rounded-2xl shadow-xl"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              YomiPlay
            </h1>
            <p className="text-xl md:text-2xl text-[var(--muted-foreground)] font-medium max-w-2xl mx-auto">
              {t.tagline}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-[rgb(var(--accent))]">
              {t.sub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://apps.apple.com/jp/app/yomiplay/id6760715932"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-black/85 transition-colors shadow-lg"
            >
              <Apple size={20} />
              {t.downloadIos}
            </a>
            <a
              href="/api/yomiplay/apk/download"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl border-2 border-[rgb(var(--accent))]/40 text-[rgb(var(--accent))] font-bold text-sm hover:bg-[rgb(var(--accent))]/5 transition-colors"
            >
              <Smartphone size={20} />
              {t.downloadAndroid}
            </a>
          </div>

          <div>
            <Link
              href={`/${params.lang}/p/yomiplay`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
            >
              {t.learnMore}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-[var(--border)] bg-[var(--muted)]/20">
        <div className="container-custom max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl font-black tracking-tight text-center">{t.featuresTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.features.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <div className="w-8 h-8 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="container-custom max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-[rgb(var(--accent))]">{t.pricingEyebrow}</p>
            <h2 className="text-3xl font-black tracking-tight">{t.pricingTitle}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {t.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative pt-6 p-5 rounded-2xl border flex flex-col gap-2 ${
                  plan.badge === (params.lang === 'en' ? 'Best value' : params.lang === 'ja' ? 'お得' : '最划算')
                    ? 'border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/5'
                    : 'border-[var(--border)] bg-[var(--card)]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-[rgb(var(--accent))] text-white whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{plan.name}</p>
                <p className="text-2xl font-black tracking-tight">
                  {plan.price}
                  <span className="text-sm font-normal text-[var(--muted-foreground)]">{plan.period}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="text-center space-y-3">
            <p className="text-xs text-[var(--muted-foreground)]">{t.pricingNote}</p>
            <Link
              href={`/${params.lang}/yomiplay/pricing`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
            >
              {t.viewPricing}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      {communityEnabled && (
        <section className="py-20 border-t border-[var(--border)] bg-[var(--muted)]/20">
          <div className="container-custom max-w-3xl mx-auto text-center space-y-8">
            <div className="w-14 h-14 rounded-2xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto">
              <Users size={28} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight">{t.communityTitle}</h2>
              <p className="text-[var(--muted-foreground)]">{t.communitySub}</p>
            </div>
            <Link
              href={`/${params.lang}/yomiplay/community`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[rgb(var(--accent))] text-white font-bold hover:opacity-90 transition-opacity shadow-lg"
            >
              <MessageCircle size={18} />
              {t.communityBtn}
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
