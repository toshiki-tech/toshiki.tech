import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const APP_STORE_URL = 'https://apps.apple.com/jp/app/yomiplay/id6760715932';

const content = {
  en: {
    title: 'Download',
    subtitle: 'Master Japanese through intensive listening and shadowing. Turn any audio or video into your personal study material.',
    appStoreLabel: 'Download on the App Store',
    googlePlayLabel: 'Get it on Google Play',
    comingSoon: 'Coming Soon',
    devicesTitle: 'Supported Devices',
    devices: ['iPhone', 'iPad', 'Android'],
    featuresTitle: 'Features',
    features: [
      'Convert audio & video into synced subtitles',
      'Furigana, romaji & translation',
      'Sentence-by-sentence playback',
      'Shadowing practice',
      'Text-to-Speech (TTS)',
      'Podcast-based learning',
      'JLPT-focused study',
      'Anki export',
      'On-device, privacy-first processing'
    ]
  },
  zh: {
    title: '下载',
    subtitle: '通过精听与跟读掌握日语。把任何音频或视频变成你的专属学习素材。',
    appStoreLabel: '在 App Store 下载',
    googlePlayLabel: '在 Google Play 获取',
    comingSoon: '近日公开',
    devicesTitle: '对应设备',
    devices: ['iPhone', 'iPad', 'Android'],
    featuresTitle: '功能介绍',
    features: [
      '音频/视频转同步字幕',
      '假名（furigana）、罗马字与翻译',
      '逐句播放',
      '跟读练习（shadowing）',
      '文本朗读（TTS）',
      '播客学习',
      'JLPT 备考',
      'Anki 导出',
      '本地处理优先，注重隐私'
    ]
  },
  'zh-tw': {
    title: '下載',
    subtitle: '透過精聽與跟讀掌握日語。把任何音訊或影片變成你的專屬學習素材。',
    appStoreLabel: '在 App Store 下載',
    googlePlayLabel: '在 Google Play 取得',
    comingSoon: '近日公開',
    devicesTitle: '對應裝置',
    devices: ['iPhone', 'iPad', 'Android'],
    featuresTitle: '功能介紹',
    features: [
      '音訊/影片轉同步字幕',
      '假名（furigana）、羅馬字與翻譯',
      '逐句播放',
      '跟讀練習（shadowing）',
      '文字朗讀（TTS）',
      '播客學習',
      'JLPT 備考',
      'Anki 匯出',
      '本地處理優先，注重隱私'
    ]
  },
  ja: {
    title: 'ダウンロード',
    subtitle: '精聴とシャドーイングで日本語を習得。あらゆる音声・動画を、あなただけの学習教材に変えましょう。',
    appStoreLabel: 'App Store でダウンロード',
    googlePlayLabel: 'Google Play で手に入れよう',
    comingSoon: '近日公開',
    devicesTitle: '対応デバイス',
    devices: ['iPhone', 'iPad', 'Android'],
    featuresTitle: '機能紹介',
    features: [
      '音声・動画から同期字幕を生成',
      'ふりがな・ローマ字・翻訳',
      '一文ずつの再生',
      'シャドーイング練習',
      'テキスト読み上げ（TTS）',
      'ポッドキャストでの学習',
      'JLPT 対策',
      'Anki へのエクスポート',
      '端末内処理優先のプライバシー設計'
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | YomiPlay`,
  };
}

export default function YomiPlayDownloadPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground-rgb)]">
          {t.title}
        </h1>
        <p className="text-base text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      {/*
        Download buttons area.
        TODO: Once YomiPlay is published on Google Play, replace the disabled
        Google Play card below with a real <a href> link to the store listing.
      */}
      <div className="grid gap-4 sm:grid-cols-2 mb-16">
        {/* App Store — live */}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 rounded-2xl border border-[var(--border,#e5e7eb)] bg-[var(--foreground-rgb)] text-[var(--background,#ffffff)] px-6 py-5 font-semibold transition-transform hover:scale-[1.02] hover:shadow-lg"
        >
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.434 2.205-1.15 2.99-.79.864-2.06 1.532-3.144 1.45-.137-1.107.434-2.27 1.13-3.018.79-.864 2.184-1.487 3.164-1.422zM20.79 17.27c-.54 1.24-.8 1.79-1.49 2.89-.97 1.53-2.34 3.44-4.04 3.45-1.51.02-1.9-.99-3.95-.98-2.05.01-2.48 1-3.99.97-1.7-.02-3-1.74-3.97-3.27-2.72-4.29-3-9.32-1.33-12 .96-1.55 2.49-2.46 3.93-2.46 1.46 0 2.38.99 3.59.99 1.17 0 1.88-.99 3.57-.99 1.27 0 2.62.69 3.58 1.88-3.15 1.72-2.64 6.22.99 7.51z" />
          </svg>
          <span>{t.appStoreLabel}</span>
        </a>

        {/* Google Play — reserved, disabled until published */}
        <div
          aria-disabled="true"
          className="relative flex items-center justify-center gap-3 rounded-2xl border border-[var(--border,#e5e7eb)] bg-[var(--muted,#f3f4f6)] dark:bg-white/5 text-[var(--muted-foreground)] px-6 py-5 font-semibold opacity-60 cursor-not-allowed select-none"
        >
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.6 1.9c-.3.2-.5.6-.5 1.1v18c0 .5.2.9.5 1.1l.1.1L13.5 12.1v-.2L3.7 1.8l-.1.1zM17.3 15.9l-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2-.1-.1zM17.4 15.8l-3.4-3.4L4 22.2c.4.4 1 .4 1.7.1l11.7-6.5M17.4 8.2L5.7 1.7C5 1.3 4.4 1.4 4 1.8l10 10 3.4-3.6z" />
          </svg>
          <span>{t.googlePlayLabel}</span>
          <span className="absolute -top-2 -right-2 rounded-full bg-[var(--foreground-rgb)] text-[var(--background,#ffffff)] text-[10px] font-bold px-2 py-0.5 shadow">
            {t.comingSoon}
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Supported devices */}
        <section className="rounded-2xl border border-[var(--border,#e5e7eb)] p-6">
          <h2 className="text-lg font-bold mb-4 text-[var(--foreground-rgb)]">
            {t.devicesTitle}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {t.devices.map((device) => (
              <li
                key={device}
                className="rounded-full border border-[var(--border,#e5e7eb)] px-4 py-1.5 text-sm text-[var(--muted-foreground)]"
              >
                {device}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section className="rounded-2xl border border-[var(--border,#e5e7eb)] p-6">
          <h2 className="text-lg font-bold mb-4 text-[var(--foreground-rgb)]">
            {t.featuresTitle}
          </h2>
          <ul className="space-y-2.5">
            {t.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
