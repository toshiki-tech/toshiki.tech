export type StoreKind = 'app-store' | 'chrome-store' | 'other';

export function detectStore(url: string): StoreKind {
  if (url.includes('apps.apple.com')) return 'app-store';
  if (url.includes('chromewebstore.google.com')) return 'chrome-store';
  return 'other';
}

type Lang = 'en' | 'zh' | 'zh-tw' | 'ja';

export const STORE_LABELS: Record<Lang, Record<StoreKind, { short: string; long: string }>> = {
  en: {
    'app-store': { short: 'App Store', long: 'Download on the App Store' },
    'chrome-store': { short: 'Chrome Store', long: 'Install from Chrome Web Store' },
    'other': { short: 'Open', long: 'Open external link' },
  },
  zh: {
    'app-store': { short: 'App Store', long: '从 App Store 下载' },
    'chrome-store': { short: 'Chrome 商店', long: '从 Chrome 商店安装' },
    'other': { short: '打开', long: '打开外部链接' },
  },
  'zh-tw': {
    'app-store': { short: 'App Store', long: '從 App Store 下載' },
    'chrome-store': { short: 'Chrome 商店', long: '從 Chrome 線上應用程式商店安裝' },
    'other': { short: '開啟', long: '開啟外部連結' },
  },
  ja: {
    'app-store': { short: 'App Store', long: 'App Store からダウンロード' },
    'chrome-store': { short: 'Chrome ストア', long: 'Chrome ウェブストアからインストール' },
    'other': { short: '開く', long: '外部リンクを開く' },
  },
};
