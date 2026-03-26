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
  };
  techStack: string[];
  externalLinks: {
    label: string;
    url: string;
  }[];
  imageUrl?: string;
}

export const products: Product[] = [
  {
    id: "yomiplay",
    slug: "yomiplay",
    translations: {
      en: {
        title: "YomiPlay",
        subtitle: "AI Speech Recognition for audio/video Japanese learning (iOS App)",
        description: "YomiPlay is a premium iOS application that transforms your favorite audio and video into versatile learning materials. Using on-device AI recognition for precision subtitling, it enables immersive shadowing to master the language naturally while supporting subtitle editing and resource sharing.",
        features: [
          "Automated Furigana (reading) system",
          "Gairaigo / English etymological annotations",
          "On-device AI-powered auto-subtitling",
          "Subtitle editing & resource sharing"
        ]
      },
      zh: {
        title: "YomiPlay",
        subtitle: "基于 AI 语音识别的音视频日语学习 iOS 应用",
        description: "YomiPlay 是一款专为 iOS 设计的沉浸式日语学习应用。它将您喜爱的音视频转化为多功能学习材料，利用离线 AI 识别技术构建精准字幕，助您在“影子跟读”中自然掌握语言。同时支持字幕完善与优质资料共享。",
        features: [
          "自动假名 (Furigana) 标注系统",
          "外来词 (Gairaigo) 英语原词标注",
          "基于离线 AI 识别技术的自动字幕",
          "支持字幕编辑与优质资料共享"
        ]
      },
      ja: {
        title: "YomiPlay",
        subtitle: "AI音声認識を駆使した音声・動画による日本語学習 iOS アプリ",
        description: "YomiPlayは、iOS向けに設計された没入型学習アプリです。お気に入りのリソースを多機能な教材に変え、日本語のリスニングとスピーキング力を効果的に向上させます。オンデバイスAI認識で精緻な字幕を生成し、シャドーイングをサポートします。",
        features: [
          "全自動ふりがな（振假名）付与システム",
          "外来語・カタカナ語の英語原義注釈機能",
          "オフラインAI認識による自動字幕生成",
          "字幕編集機能と学習リソースの共有"
        ]
      }
    },
    techStack: ["Swift", "SwiftUI", "CoreML", "Whisper (On-Device)"],
    externalLinks: [
      { label: "View on App Store", url: "#" }
    ],
    imageUrl: "/products/yomiplay.png"
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
      }
    },
    techStack: ["TypeScript", "React", "Chrome Extension API", "Wasm"],
    externalLinks: [
      { label: "Install from Chrome Store", url: "#" }
    ],
    imageUrl: "/products/yomimark.png"
  }
];
