import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Privacy Policy',
    lastUpdated: 'Last Updated: March 27, 2026',
    sections: [
      {
        title: '1. Introduction',
        body: 'YomiPlay is an AI-powered language learning application. We are committed to protecting your personal information and privacy. This Privacy Policy explains what data we collect, why we collect it, and how we protect your information.'
      },
      {
        title: '2. Information Processing',
        body: 'When you use YomiPlay, we process audio/video files to generate synchronized subtitles. Transcription is primarily performed using on-device speech recognition models—your media files are NOT uploaded to our servers for AI processing.'
      },
      {
        title: '3. App Permissions',
        body: 'To provide its core functions, YomiPlay may request the following permissions:',
        list: [
          'Microphone: Required if you use features requiring voice input or recording (e.g., shadowing).',
          'Storage/Media Library: Required to import local audio and video files for study.',
          'Network: Required for fetching metadata, RSS feeds, and downloading language packs.'
        ]
      },
      {
        title: '4. Network Import & Metadata',
        body: 'When importing media via external URLs or searching for podcasts, the app makes network requests to fetch resources. We do not track what specific content you are studying; requests are primarily for fetching metadata from public APIs (such as iTunes Search API).'
      },
      {
        title: '5. Usage Statistics & Anonymized Data',
        body: 'We may collect anonymous usage data (e.g., device model, system version, app version) to help us diagnose issues and optimize the user experience. No personally identifiable information is collected during this process.'
      },
      {
        title: '6. Subscriptions & In-App Purchases',
        body: 'All financial transactions are handled securely by Apple StoreKit. We do not collect or store your payment card details or financial information.'
      },
      {
        title: '7. Your Rights',
        body: 'You have the right to access, correct, or delete your data stored within the app. Since most of your study data is kept on-device, you can manage it directly through the app settings or by deleting the application.',
      },
      {
        title: '8. Contact Us',
        body: 'If you have any questions regarding this Privacy Policy, please visit our Support Page (https://toshiki.tech/en/yomiplay/support) or contact us via email: toshiki.tech.jp@gmail.com'
      }
    ]
  },
  zh: {
    title: 'YomiPlay 隐私政策',
    lastUpdated: '最后生效时间：2026年3月27日',
    sections: [
      {
        title: '1. 简介',
        body: 'YomiPlay 是一款 AI 驱动的语言学习应用。我们深知个人信息的重要性，并致力于保护您的隐私。本政策旨在说明我们如何收集和使用您的信息，以及我们保护隐私的措施。'
      },
      {
        title: '2. 核心功能信息处理',
        body: '当你使用 YomiPlay 时，我们会处理你导入的音视频内容以生成同步字幕。转写主要依托于设备端的 AI 模型进行，您的原始音视频内容不会被上传至我们的服务器进行识别处理。'
      },
      {
        title: '3. 权限说明',
        body: '为了实现核心功能，应用可能会请求以下权限：',
        list: [
          '麦克风权限：如果您使用跟读或其他需要录音的功能，需要此权限。',
          '存储/媒体库权限：用于导入您保存在本地设备上的音视频学习素材。',
          '网络权限：用于获取播客元数据、RSS 订阅源以及下载必要的翻译语言包。'
        ]
      },
      {
        title: '4. 外部请求与元数据',
        body: '通过 URL 或搜索播客导入媒体时，应用会向第三方 API（如 iTunes Search）发起请求以获取元数据。我们不会记录您具体学习的内容，这些请求仅供实时获取必要信息使用。'
      },
      {
        title: '5. 匿名统计数据',
        body: '我们可能会收集匿名的设备信息（如型号、系统版本）用于优化应用性能和诊断错误，这些数据不包含任何个人身份信息。'
      },
      {
        title: '6. 订阅与支付',
        body: '所有的交易均通过 Apple IAP（应用内购买）处理，我们不会接触或存储您的支付账户或银行卡信息。'
      },
      {
        title: '7. 您的权利',
        body: '您有权访问、修改或删除应用内的本地数据。由于大部分数据直接存储于您的设备中，您可以通过应用设置或卸载应用来清除相关信息。'
      },
      {
        title: '8. 联系我们',
        body: '如果您对本隐私政策有任何疑问，请访问我们的 支持页面 (https://toshiki.tech/zh/yomiplay/support) 或通过电子邮件与我们联系： toshiki.tech.jp@gmail.com'
      }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 隱私政策',
    lastUpdated: '最後生效時間：2026年3月27日',
    sections: [
      {
        title: '1. 簡介',
        body: 'YomiPlay 是一款 AI 驅動的語言學習應用。我們深知個人資訊的重要性，並致力於保護您的隱私。本政策旨在說明我們如何收集和使用您的資訊，以及我們保護隱私的措施。'
      },
      {
        title: '2. 核心功能資訊處理',
        body: '當你使用 YomiPlay 時，我們會處理你匯入的音訊內容以產生同步字幕。轉寫主要依託於裝置端的 AI 模型進行，您的原始音訊內容不會被上傳至我們的伺服器進行識別處理。'
      },
      {
        title: '3. 權限說明',
        body: '為了實現核心功能，應用程式可能會請求以下權限：',
        list: [
          '麥克風權限：如果您使用跟讀或其他需要錄音的功能，需要此權限。',
          '儲存/媒體庫權限：用於匯入您保存在本地裝置上的音訊學習素材。',
          '網路權限：用於取得播客元資料、RSS 訂閱源以及下載必要的翻譯語言套件。'
        ]
      },
      {
        title: '4. 外部請求與中繼資料',
        body: '通過 URL 或搜尋播客匯入媒體時，應用程式會向第三方 API（如 iTunes Search）發起請求以取得中繼資料。我們不會記錄您具體學習的內容，這些請求僅供即時取得必要資訊使用。'
      },
      {
        title: '5. 匿名統計資料',
        body: '我們可能會收集匿名的裝置資訊（如型號、系統版本）用於優化應用程式性能和診斷錯誤，這些資料不包含任何個人身份資訊。'
      },
      {
        title: '6. 訂閱與支付',
        body: '所有的交易均通過 Apple IAP（應用內購買）處理，我們不會接觸或儲存您的支付帳戶或銀行卡資訊。'
      },
      {
        title: '7. 您的權利',
        body: '您有權存取、修改或刪除應用程式內的本地資料。由於大部分資料直接儲存於您的裝置中，您可以通過應用程式設定或解除安裝應用程式來清除相關資訊。'
      },
      {
        title: '8. 聯絡我們',
        body: '如果您對本隱私政策有任何疑問，請訪問我們的 支援頁面 (https://toshiki.tech/zh-tw/yomiplay/support) 或透過電子郵件與我們聯絡： toshiki.tech.jp@gmail.com'
      }
    ]
  },
  ja: {
    title: 'YomiPlay プライバシーポリシー',
    lastUpdated: '最終発効日：2026年3月27日',
    sections: [
      {
        title: '1. はじめに',
        body: 'YomiPlay は AI を活用した語学学習アプリです。私たちはユーザーの個人情報の重要性を理解し、プライバシーの保護に努めています。本ポリシーでは、収集するデータの内容、目的、および保護措置について説明します。'
      },
      {
        title: '2. 情報の処理',
        body: 'YomiPlay の利用時、字幕生成のために音声ファイルを処理します。文字起こしは主にデバイス上の AI モデルを使用して行われ、音声ファイルが AI 処理のために開発者のサーバーにアップロードされることはありません。'
      },
      {
        title: '3. 使用権限について',
        body: '本アプリの主要機能を提供するため、以下の権限をリクエストする場合があります。',
        list: [
          'マイク権限：シャドーイングや録音が必要な機能を利用する場合に必要です。',
          'ストレージ/メディアライブラリ権限：端末内の音声学習教材を取り込む場合に必要です。',
          'ネットワーク権限：ポッドキャストのメタデータ取得、RSS購読、および翻訳用言語パックのダウンロードに必要です。'
        ]
      },
      {
        title: '4. 外部リクエストとメタデータ',
        body: 'URL やポッドキャスト検索を通じてメディアを取り込む際、アプリはサードパーティ API（iTunes Search など）にリクエストを送信します。学習内容を追跡することはありません。'
      },
      {
        title: '5. 匿名統計データ',
        body: 'アプリのパフォーマンス向上やエラー診断のため、匿名の端末情報（モデル名、システムバージョン）を収集する場合があります。個人を特定できる情報は含まれません。'
      },
      {
        title: '6. 定期購読と支払い',
        body: 'すべての取引は Apple の App Store 決済を通じて処理されます。開発者がユーザーの支払い情報やカード情報に触れることはありません。'
      },
      {
        title: '7. ユーザーの権利',
        body: 'ユーザーはアプリ内のローカルデータにアクセス、修正、削除する権利があります。ほとんどのデータは端末内に保存されており、アプリ設定やアプリの削除によって管理可能です。'
      },
      {
        title: '8. お問い合わせ',
        body: '本ポリシーに関するご質問は、サポートページ (https://toshiki.tech/ja/yomiplay/support) をご覧いただくか、メールでお寄せください： toshiki.tech.jp@gmail.com'
      }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | Toshiki Tech`,
  };
}

export default function YomiPlayPrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">
        {t.lastUpdated}
      </p>
      
      <div className="space-y-10 text-[var(--muted-foreground)] leading-relaxed">
        {t.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--foreground-rgb)]">
              {section.title}
            </h2>
            <p>{section.body}</p>
            {section.list && (
              <ul className="list-disc pl-5 space-y-2">
                {section.list.map((item, idy) => (
                  <li key={idy}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
