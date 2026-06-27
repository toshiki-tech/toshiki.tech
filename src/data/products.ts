export interface Product {
  id: string;
  slug: string;
  translations: {
    en: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    };
    zh: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    };
    ja: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    };
    'zh-tw': {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
    };
  };
  techStack: string[];
  externalLinks: {
    label: string;
    url: string;
  }[];
  downloads?: {
    version: string;
    releaseUrl?: string;
    platforms: {
      os: 'macos-arm' | 'macos-intel' | 'windows-exe' | 'windows-msi';
      url: string;
      recommended?: boolean;
    }[];
  };
  imageUrl?: string;
  portraitImageUrl?: string;
  gallery?: string[];
}

const APP_STORE_LOCALE_MAP: Record<string, string> = {
  en: 'us',
  zh: 'cn',
  'zh-tw': 'tw',
  ja: 'jp',
};

export function localizeAppStoreUrl(url: string, locale: string): string {
  const match = url.match(/^https:\/\/apps\.apple\.com\/(\w+)\//);
  if (!match) return url;
  const targetCountry = APP_STORE_LOCALE_MAP[locale] || match[1];
  return url.replace(/^(https:\/\/apps\.apple\.com\/)\w+\//, `$1${targetCountry}/`);
}

export const products: Product[] = [
  {
    id: "yomiplay",
    slug: "yomiplay",
    translations: {
      en: {
        title: "YomiPlay",
        subtitle: "AI Speech Recognition for immersive Japanese learning — iOS & Android",
        description: "YomiPlay transforms your favorite audio and video into powerful Japanese learning materials. Using on-device AI recognition for precision subtitling, it enables immersive shadowing to master the language naturally — available on iOS and Android, with subtitle editing and community resource sharing.",
        features: [
          "Automated Furigana (reading) system",
          "Gairaigo / English etymological annotations",
          "On-device AI-powered auto-subtitling",
          "Immersive shadowing & sentence-by-sentence playback",
          "Subtitle editing & resource sharing"
        ]
      },
      zh: {
        title: "YomiPlay",
        subtitle: "基于 AI 语音识别的沉浸式日语学习应用（iOS & Android）",
        description: "YomiPlay 是一款支持 iOS 与 Android 双平台的沉浸式日语学习应用。它将您喜爱的音视频转化为多功能学习材料，利用离线 AI 识别技术构建精准字幕，助您在「影子跟读」中自然掌握语言，同时支持字幕完善与优质资料共享。",
        features: [
          "自动假名 (Furigana) 标注系统",
          "外来词 (Gairaigo) 英语原词标注",
          "基于离线 AI 识别技术的自动字幕",
          "沉浸式跟读与逐句播放",
          "支持字幕编辑与优质资料共享"
        ]
      },
      ja: {
        title: "YomiPlay",
        subtitle: "AI音声認識を駆使した没入型日本語学習アプリ（iOS & Android）",
        description: "YomiPlayは、iOSとAndroidに対応した没入型日本語学習アプリです。お気に入りのリソースを多機能な教材に変え、日本語のリスニングとスピーキング力を効果的に向上させます。オンデバイスAI認識で精緻な字幕を生成し、シャドーイングをサポートします。",
        features: [
          "全自動ふりがな（振假名）付与システム",
          "外来語・カタカナ語の英語原義注釈機能",
          "オフラインAI認識による自動字幕生成",
          "没入型シャドーイング＆文単位再生",
          "字幕編集機能と学習リソースの共有"
        ]
      },
      'zh-tw': {
        title: "YomiPlay",
        subtitle: "基於 AI 語音識別的沉浸式日語學習應用（iOS & Android）",
        description: "YomiPlay 是一款支援 iOS 與 Android 雙平台的沉浸式日語學習應用。它將您喜愛的影音轉化為多功能學習材料，利用離線 AI 識別技術構建精準字幕，助您在「影子跟讀」中自然掌握語言，同時支持字幕完善與優質資料共享。",
        features: [
          "自動假名 (Furigana) 標注系統",
          "外來詞 (Gairaigo) 英語原詞標注",
          "基於離線 AI 識別技術的自動字幕",
          "沉浸式跟讀與逐句播放",
          "支持字幕編輯與優質資料共享"
        ]
      }
    },
    techStack: ["Swift", "SwiftUI", "CoreML", "Whisper (On-Device)"],
    externalLinks: [
      { label: "View on App Store", url: "https://apps.apple.com/jp/app/yomiplay/id6760715932" }
    ],
    imageUrl: "/images/products/yomiplay-final.png",
    portraitImageUrl: "/images/products/yomiplay-portrait.png"
  },
  {
    id: "yominote",
    slug: "yominote",
    translations: {
      en: {
        title: "YomiNote",
        subtitle: "Modern Markdown desktop editor with built-in Japanese reading aids",
        description: "YomiNote is a desktop Markdown editor purpose-built for Japanese reading and writing. It automatically adds furigana to kanji and surfaces English glosses for katakana loanwords, with a clean side-by-side live preview that keeps focus on the text. Powered by kuroshiro/kuromoji morphological analysis and a JMdict-backed dictionary, it runs fully offline.",
        features: [
          "Automatic furigana on kanji (kuroshiro + kuromoji)",
          "English glosses for katakana loanwords via JMdict",
          "Live side-by-side Markdown preview",
          "Custom {base|reading} ruby syntax",
          "Native desktop app for Windows, macOS, and Linux",
          "Fully offline — no cloud or account required"
        ]
      },
      zh: {
        title: "YomiNote",
        subtitle: "内置日语阅读辅助的现代 Markdown 桌面编辑器",
        description: "YomiNote 是一款专为日语阅读与写作而生的桌面 Markdown 编辑器。它能自动为汉字标注振假名（Furigana），并为片假名外来词附上英语原词解释，配合左右分栏的实时预览，让您专注于文本本身。基于 kuroshiro / kuromoji 形态分析与 JMdict 词典构建，全程离线运行。",
        features: [
          "汉字自动振假名 (Furigana) 标注（kuroshiro + kuromoji）",
          "基于 JMdict 词典的片假名外来词英语原词标注",
          "左右分栏的实时 Markdown 预览",
          "自定义 {原文|读音} ruby 注音语法",
          "原生桌面应用，支持 Windows / macOS / Linux",
          "完全离线运行，无需账号与联网"
        ]
      },
      ja: {
        title: "YomiNote",
        subtitle: "日本語の読みを助ける、モダン Markdown デスクトップエディタ",
        description: "YomiNote は、日本語の読み書きのために設計されたデスクトップ Markdown エディタです。漢字に自動でふりがなを振り、カタカナ外来語には英語の原義注釈を添え、左右分割のライブプレビューで本文への集中を保ちます。kuroshiro / kuromoji の形態素解析と JMdict 辞書を基盤に、完全オフラインで動作します。",
        features: [
          "漢字への自動ふりがな付与（kuroshiro + kuromoji）",
          "JMdict ベースのカタカナ外来語 → 英語注釈",
          "Markdown のライブプレビュー（左右分割）",
          "独自の {本文|読み} ルビ記法",
          "Windows / macOS / Linux 対応のネイティブデスクトップアプリ",
          "完全オフライン動作、アカウント不要"
        ]
      },
      'zh-tw': {
        title: "YomiNote",
        subtitle: "內建日語閱讀輔助的現代 Markdown 桌面編輯器",
        description: "YomiNote 是一款專為日語閱讀與寫作而生的桌面 Markdown 編輯器。它能自動為漢字標註振假名（Furigana），並為片假名外來詞附上英語原詞解釋，配合左右分欄的即時預覽，讓您專注於文本本身。基於 kuroshiro / kuromoji 形態分析與 JMdict 詞典建構，全程離線運行。",
        features: [
          "漢字自動振假名 (Furigana) 標註（kuroshiro + kuromoji）",
          "基於 JMdict 詞典的片假名外來詞英語原詞標註",
          "左右分欄的即時 Markdown 預覽",
          "自訂 {原文|讀音} ruby 注音語法",
          "原生桌面應用程式，支援 Windows / macOS / Linux",
          "完全離線運行，無需帳號與聯網"
        ]
      }
    },
    techStack: ["Tauri 2", "Rust", "React", "TypeScript", "CodeMirror 6", "kuroshiro", "JMdict"],
    externalLinks: [],
    downloads: {
      version: "0.1.1",
      releaseUrl: "https://github.com/toshiki-tech/yomi-note/releases/latest",
      platforms: [
        { os: "macos-arm", url: "https://github.com/toshiki-tech/yomi-note/releases/download/v0.1.1/YomiNote_0.1.1_aarch64.dmg" },
        { os: "macos-intel", url: "https://github.com/toshiki-tech/yomi-note/releases/download/v0.1.1/YomiNote_0.1.1_x64.dmg" },
        { os: "windows-exe", url: "https://github.com/toshiki-tech/yomi-note/releases/download/v0.1.1/YomiNote_0.1.1_x64-setup.exe", recommended: true },
        { os: "windows-msi", url: "https://github.com/toshiki-tech/yomi-note/releases/download/v0.1.1/YomiNote_0.1.1_x64_en-US.msi" }
      ]
    },
    imageUrl: "/images/products/yominote-ad1.png",
    portraitImageUrl: "/images/products/yominote-ad2.png"
  },
  {
    id: "yomimark",
    slug: "yomimark",
    translations: {
      en: {
        title: "YomiMark",
        subtitle: "Japanese reading enhancement for your browser",
        description: "YomiMark is a browser extension that makes reading Japanese on the web seamless. It adds furigana to kanji, supports Gairaigo to English etymological mapping, and empowers you to read faster and learn more effectively.",
        features: [
          "Gairaigo / English etymological mapping",
          "Automated Furigana (reading) system",
          "Select-and-lookup annotations",
          "Chrome browser extension"
        ]
      },
      zh: {
        title: "YomiMark",
        subtitle: "为浏览器打造的网页日语阅读增强工具",
        description: "YomiMark 是一款让网页日语阅读变得无障碍的浏览器扩展。它能为汉字添加振假名（Furigana），支持片假名外来词 (Gairaigo) 英语原词映射，助您提升阅读速度，实现更高效的语言学习。",
        features: [
          "外来词 (Gairaigo) 英语原词映射",
          "全自动振假名注音系统",
          "支持划词标注功能",
          "支持 Chrome 的浏览器扩展"
        ]
      },
      ja: {
        title: "YomiMark",
        subtitle: "ブラウザのための日本語読解支援ツール",
        description: "YomiMarkは、Web上の日本語読解をシームレスにするブラウザ拡張機能です。漢字にふりがなを振り、カタカナ外来語の英語原義マッピングをサポートすることで、より速く、より効果的な読解を支援します。",
        features: [
          "外来語・カタカナ語の英語原義マッピング",
          "全自動ふりがな（振假名）付与システム",
          "划詞（選択範囲）注釈表示サポート",
          "Chrome対応のブラウザ拡張機能"
        ]
      },
      'zh-tw': {
        title: "YomiMark",
        subtitle: "為瀏覽器打造的網頁日語閱讀增強工具",
        description: "YomiMark 是一款讓網頁日語閱讀變得無障礙的瀏覽器擴充。它能為漢字添加振假名（Furigana），支持片假名外來詞 (Gairaigo) 英語原詞映射，助您提升閱讀速度，實現更高效的語言學習。",
        features: [
          "外來詞 (Gairaigo) 英語原詞映射",
          "全自動振假名注音系統",
          "支持劃詞標注功能",
          "支持 Chrome 的瀏覽器擴充"
        ]
      }
    },
    techStack: ["TypeScript", "React", "Chrome Extension API", "Wasm"],
    externalLinks: [
      { label: "Install from Chrome Store", url: "https://chromewebstore.google.com/detail/yomimark-%E2%80%94-instant-furiga/ldfcjpnjokhdoihapfcnimchieaofhin" }
    ],
    imageUrl: "/images/products/yomimark-promo.png"
  }
];
