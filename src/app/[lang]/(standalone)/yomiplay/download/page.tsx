import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import Link from 'next/link';

const APP_STORE_URL = 'https://apps.apple.com/jp/app/yomiplay/id6760715932';

const AppleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.434 2.205-1.15 2.99-.79.864-2.06 1.532-3.144 1.45-.137-1.107.434-2.27 1.13-3.018.79-.864 2.184-1.487 3.164-1.422zM20.79 17.27c-.54 1.24-.8 1.79-1.49 2.89-.97 1.53-2.34 3.44-4.04 3.45-1.51.02-1.9-.99-3.95-.98-2.05.01-2.48 1-3.99.97-1.7-.02-3-1.74-3.97-3.27-2.72-4.29-3-9.32-1.33-12 .96-1.55 2.49-2.46 3.93-2.46 1.46 0 2.38.99 3.59.99 1.17 0 1.88-.99 3.57-.99 1.27 0 2.62.69 3.58 1.88-3.15 1.72-2.64 6.22.99 7.51z" />
  </svg>
);

const AndroidIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.6 1.9c-.3.2-.5.6-.5 1.1v18c0 .5.2.9.5 1.1l.1.1L13.5 12.1v-.2L3.7 1.8l-.1.1zM17.3 15.9l-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2-.1-.1zM17.4 15.8l-3.4-3.4L4 22.2c.4.4 1 .4 1.7.1l11.7-6.5M17.4 8.2L5.7 1.7C5 1.3 4.4 1.4 4 1.8l10 10 3.4-3.6z" />
  </svg>
);

const content = {
  en: {
    eyebrow: 'YomiPlay',
    heading: 'Listen your way to fluency',
    subtitle: 'Turn any podcast, YouTube video, or audio file into a personal immersion lesson. Free to start — upgrade anytime.',
    ios: {
      label: 'iOS',
      devices: 'iPhone · iPad',
      req: 'Requires iOS 16.0 or later',
      desc: 'Available now. Download from the App Store and start your first lesson in minutes.',
      cta: 'Download on the App Store',
    },
    android: {
      label: 'Android',
      devices: 'Phone · Tablet',
      desc: 'Download the APK directly from this site — no app store needed. Sideload and install in seconds.',
      cta: 'Download Android APK',
      specs: [
        { label: 'OS', value: 'Android 9.0+ (API 28)' },
        { label: 'CPU', value: 'ARM64 (64-bit)' },
        { label: 'Storage', value: '1.2 GB free' },
        { label: 'RAM', value: '4 GB recommended' },
      ],
    },
    highlightsTitle: 'What you can do',
    highlights: [
      {
        icon: '🎧',
        title: 'Podcast & audio/video recognition',
        desc: 'Import a podcast file or paste any online audio/video URL. AI transcribes it into synced subtitles automatically. Free plan includes 1 hr/month.',
      },
      {
        icon: '🔁',
        title: 'Sentence playback & shadowing',
        desc: 'Tap any sentence to replay it on loop. Shadow the speaker to sharpen listening and speaking at the same time.',
      },
      {
        icon: '📖',
        title: 'Reading aids',
        desc: 'Furigana, romaji, and inline translation — toggle each on or off so you only see what helps you focus.',
      },
      {
        icon: '🔊',
        title: 'Text-to-Speech  ·  Premium',
        desc: 'Convert any text into natural speech. Keep listening even when reading isn\'t an option.',
      },
    ],
    freeNote: 'Free plan includes 1 hr/month of speech-to-text. Upgrade for unlimited recognition and TTS.',
    pricingLink: 'Compare all plans',
    versionNote: 'v0.1.0  ·  Released June 2026',
  },
  zh: {
    eyebrow: 'YomiPlay',
    heading: '用耳朵，学地道日语',
    subtitle: '把播客、YouTube、任意音视频变成你的专属精听素材。免费开始，随时升级。',
    ios: {
      label: 'iOS',
      devices: 'iPhone · iPad',
      req: '需要 iOS 16.0 或更高版本',
      desc: '现已上线，在 App Store 下载后几分钟内即可开始第一堂精听课。',
      cta: '在 App Store 下载',
    },
    android: {
      label: 'Android',
      devices: '手机 · 平板',
      desc: 'APK 直接通过本站（toshiki.tech）发布，下载安装即可使用，无需任何应用商店。',
      cta: '下载 Android APK',
      specs: [
        { label: '系统', value: 'Android 9.0+（API 28）' },
        { label: '架构', value: 'ARM64（64位）' },
        { label: '存储', value: '1.2GB 可用空间' },
        { label: '内存', value: '建议 4GB 以上' },
      ],
    },
    highlightsTitle: '你能做什么',
    highlights: [
      {
        icon: '🎧',
        title: '播客与音视频字幕生成',
        desc: '导入播客文件，或粘贴网络音视频链接，AI 自动识别并生成同步字幕。免费版每月 1 小时额度。',
      },
      {
        icon: '🔁',
        title: '逐句精听 & 跟读',
        desc: '点任意一句即可循环播放。跟读模式帮你同步提升听力与口语表达。',
      },
      {
        icon: '📖',
        title: '语言辅助阅读',
        desc: '假名标注、罗马字、行内翻译，按需开关，只保留你真正需要的辅助。',
      },
      {
        icon: '🔊',
        title: '文本朗读 TTS  ·  Premium',
        desc: '将任意文字转为自然语音，随时随地用耳朵学，不受阅读场景限制。',
      },
    ],
    freeNote: '免费版每月包含 1 小时语音转文字额度。升级 Premium 可解锁无限识别与 TTS 功能。',
    pricingLink: '查看全部价格方案',
    versionNote: 'v0.1.0  ·  发布于 2026年6月',
  },
  'zh-tw': {
    eyebrow: 'YomiPlay',
    heading: '用耳朵，學地道日語',
    subtitle: '把播客、YouTube、任意音視頻變成你的專屬精聽素材。免費開始，隨時升級。',
    ios: {
      label: 'iOS',
      devices: 'iPhone · iPad',
      req: '需要 iOS 16.0 或更高版本',
      desc: '現已上線，在 App Store 下載後幾分鐘內即可開始第一堂精聽課。',
      cta: '在 App Store 下載',
    },
    android: {
      label: 'Android',
      devices: '手機 · 平板',
      desc: 'APK 直接透過本站（toshiki.tech）發佈，下載安裝即可使用，無需任何應用商店。',
      cta: '下載 Android APK',
      specs: [
        { label: '系統', value: 'Android 9.0+（API 28）' },
        { label: '架構', value: 'ARM64（64位）' },
        { label: '儲存', value: '1.2GB 可用空間' },
        { label: '記憶體', value: '建議 4GB 以上' },
      ],
    },
    highlightsTitle: '你能做什麼',
    highlights: [
      {
        icon: '🎧',
        title: '播客與音視頻字幕生成',
        desc: '匯入播客檔案，或貼上網路音視頻連結，AI 自動辨識並生成同步字幕。免費版每月 1 小時額度。',
      },
      {
        icon: '🔁',
        title: '逐句精聽 & 跟讀',
        desc: '點任意一句即可循環播放。跟讀模式幫你同步提升聽力與口語表達。',
      },
      {
        icon: '📖',
        title: '語言輔助閱讀',
        desc: '假名標注、羅馬字、行內翻譯，按需開關，只保留你真正需要的輔助。',
      },
      {
        icon: '🔊',
        title: '文字朗讀 TTS  ·  Premium',
        desc: '將任意文字轉為自然語音，隨時隨地用耳朵學，不受閱讀場景限制。',
      },
    ],
    freeNote: '免費版每月包含 1 小時語音轉文字額度。升級 Premium 可解鎖無限識別與 TTS 功能。',
    pricingLink: '查看全部價格方案',
    versionNote: 'v0.1.0  ·  發布於 2026年6月',
  },
  ja: {
    eyebrow: 'YomiPlay',
    heading: '耳で覚える、本物の日本語',
    subtitle: 'ポッドキャスト・YouTube・あらゆる音声動画を、あなただけの精聴教材に。無料で始めて、いつでもアップグレード。',
    ios: {
      label: 'iOS',
      devices: 'iPhone · iPad',
      req: 'iOS 16.0 以降が必要',
      desc: 'App Store にて公開中。ダウンロード後すぐに最初の精聴レッスンを始められます。',
      cta: 'App Store でダウンロード',
    },
    android: {
      label: 'Android',
      devices: 'スマホ · タブレット',
      desc: '公式サイト（toshiki.tech）から APK を直接ダウンロード・インストール可能。アプリストア不要です。',
      cta: 'Android APK をダウンロード',
      specs: [
        { label: 'OS', value: 'Android 9.0+（API 28）' },
        { label: 'CPU', value: 'ARM64（64ビット）' },
        { label: 'ストレージ', value: '1.2GB 以上の空き容量' },
        { label: 'RAM', value: '4GB 以上推奨' },
      ],
    },
    highlightsTitle: 'できること',
    highlights: [
      {
        icon: '🎧',
        title: 'ポッドキャスト・音声動画の字幕生成',
        desc: 'ポッドキャストをインポートするか、音声・動画 URL を貼り付けるだけ。AI が自動で同期字幕を生成。無料版は月1時間の枠つき。',
      },
      {
        icon: '🔁',
        title: '一文ずつ精聴 & シャドーイング',
        desc: 'タップ一つで任意の文をループ再生。シャドーイングモードでリスニングと発音を同時に鍛えます。',
      },
      {
        icon: '📖',
        title: '読解サポート',
        desc: 'ふりがな・ローマ字・インライン翻訳。必要なものだけオンにして、集中力を維持しながら学習。',
      },
      {
        icon: '🔊',
        title: 'テキスト読み上げ TTS  ·  Premium',
        desc: 'テキストを自然な音声に変換。移動中も「聴く学習」を続けられます。',
      },
    ],
    freeNote: '無料プランには月1時間の音声テキスト変換枠が含まれます。Premium にアップグレードすると無制限 & TTS が使えます。',
    pricingLink: '料金プランを比較する',
    versionNote: 'v0.1.0  ·  2026年6月 公開',
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${lang === 'ja' ? 'ダウンロード' : lang === 'zh' ? '下载' : lang === 'zh-tw' ? '下載' : 'Download'} | YomiPlay`,
    description: t.subtitle,
  };
}

export default function YomiPlayDownloadPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container-custom max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] text-xs font-black uppercase tracking-widest border border-[rgb(var(--accent))]/20">
            {t.eyebrow}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] text-[var(--foreground-rgb)]">
            {t.heading}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Platform cards */}
      <section className="pb-16 border-t border-[var(--border)] pt-12">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">

            {/* iOS — live */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shrink-0 text-white">
                  <AppleIcon />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--foreground-rgb)]">{t.ios.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{t.ios.devices}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
                {t.ios.desc}
              </p>
              <div className="space-y-2.5">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-black text-white font-bold py-3.5 hover:bg-black/85 transition-colors"
                >
                  <AppleIcon />
                  {t.ios.cta}
                </a>
                <p className="text-xs text-center text-[var(--muted-foreground)]">{t.ios.req}</p>
              </div>
            </div>

            {/* Android — live */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3DDC84]/10 flex items-center justify-center shrink-0 text-[#3DDC84]">
                  <AndroidIcon />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--foreground-rgb)]">{t.android.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{t.android.devices}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
                {t.android.desc}
              </p>
              <div className="space-y-3">
                <a
                  href="/api/yomiplay/apk/download"
                  className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-[#3DDC84] text-black font-bold py-3.5 hover:opacity-90 transition-opacity"
                >
                  <AndroidIcon />
                  {t.android.cta}
                </a>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                  {t.android.specs.map((s) => (
                    <div key={s.label} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] shrink-0">{s.label}</span>
                      <span className="text-[11px] text-[var(--foreground-rgb)] truncate">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="container-custom max-w-4xl mx-auto space-y-10">
          <h2 className="text-2xl font-black tracking-tight text-center text-[var(--foreground-rgb)]">
            {t.highlightsTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {t.highlights.map((h, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3"
              >
                <div className="text-3xl">{h.icon}</div>
                <h3 className="font-black text-base text-[var(--foreground-rgb)]">{h.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free tier note + pricing link */}
      <section className="py-12 border-t border-[var(--border)] text-center">
        <div className="container-custom max-w-xl mx-auto space-y-4">
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.freeNote}</p>
          <Link
            href={`/${lang}/yomiplay/pricing`}
            className="inline-block text-sm font-bold text-[rgb(var(--accent))] hover:opacity-75 transition-opacity"
          >
            {t.pricingLink} →
          </Link>
          <p className="text-xs text-[var(--muted-foreground)]/50 pt-2">{t.versionNote}</p>
        </div>
      </section>
    </div>
  );
}
