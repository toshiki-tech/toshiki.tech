import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Privacy Policy',
    lastUpdated: 'Last Updated: June 20, 2026',
    sections: [
      {
        title: '1. Introduction',
        body: 'YomiPlay is an AI-powered language learning application. We are committed to protecting your personal information and privacy. This Privacy Policy explains what data we collect, why we collect it, and how we protect your information. It covers both the iOS app and our website (Web).'
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
        body: 'On iOS, all financial transactions are handled securely by Apple StoreKit. On the Web, subscription payments are securely processed by Stripe. In both cases, we do not collect or store your payment card details or financial information.'
      },
      {
        title: '7. Your Rights',
        body: 'You have the right to access, correct, or delete your data stored within the app. Since most of your study data is kept on-device, you can manage it directly through the app settings or by deleting the application.',
      },
      {
        title: '8. Information We Collect',
        body: 'When you create an account or use the Web service, we may collect the following information:',
        list: [
          'Account information: email address, display name, and OAuth sign-in identifiers (when you sign in with a third-party provider).',
          'Usage data: features used, study activity, and interactions with the service, used to provide and improve the product.',
          'Log information: IP address, device and browser type, and access times, recorded automatically when you use our service.'
        ]
      },
      {
        title: '9. Third-Party Services',
        body: 'We rely on the following trusted third-party services to operate YomiPlay. Each processes data only for its stated purpose:',
        list: [
          'Stripe: payment processing for Web subscriptions.',
          'Firebase: authentication, push notifications, and analytics.',
          'Google Analytics: website usage analytics.',
          'OpenAI API: used for certain AI features to process input text and related data. Only the data necessary for the feature is sent, and no payment information is included.'
        ]
      },
      {
        title: '10. Cookies',
        body: 'Our website uses essential cookies that are required for the site to function, as well as analytics cookies that help us understand how the site is used. You can manage or disable cookies through your browser settings.'
      },
      {
        title: '11. Data Deletion',
        body: 'You can delete your local data within the app at any time through the app settings or by deleting the application. To request deletion of your account and any server-side data, please email us at toshiki.tech.jp@gmail.com, and we will process your request.'
      },
      {
        title: '12. International User Rights (GDPR, etc.)',
        body: 'Depending on your location, you may have the right to access, correct, delete, port, or object to the processing of your personal data. We aim to comply with the basic requirements of Japan’s Act on the Protection of Personal Information (APPI) and the EU General Data Protection Regulation (GDPR). To exercise these rights, please contact us using the details below.'
      },
      {
        title: '13. Data Protection',
        body: 'We take reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. While no method of transmission or storage is completely secure, we work to safeguard your information.'
      },
      {
        title: '14. Contact Us',
        body: 'If you have any questions regarding this Privacy Policy, please visit our Support Page (https://toshiki.tech/en/yomiplay/support) or contact us via email: toshiki.tech.jp@gmail.com'
      }
    ]
  },
  zh: {
    title: 'YomiPlay 隐私政策',
    lastUpdated: '最后生效时间：2026年6月20日',
    sections: [
      {
        title: '1. 简介',
        body: 'YomiPlay 是一款 AI 驱动的语言学习应用。我们深知个人信息的重要性，并致力于保护您的隐私。本政策旨在说明我们如何收集和使用您的信息，以及我们保护隐私的措施。本政策同时适用于 iOS 应用和我们的网站（Web）。'
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
        body: '在 iOS 端，所有交易均通过 Apple IAP（应用内购买）处理；在 Web 端，订阅支付由 Stripe 安全处理。无论哪种情况，我们都不会接触或存储您的支付账户或银行卡信息。'
      },
      {
        title: '7. 您的权利',
        body: '您有权访问、修改或删除应用内的本地数据。由于大部分数据直接存储于您的设备中，您可以通过应用设置或卸载应用来清除相关信息。'
      },
      {
        title: '8. 我们收集的信息',
        body: '当您创建账号或使用 Web 服务时，我们可能会收集以下信息：',
        list: [
          '账号信息：邮箱地址、显示名，以及第三方登录时的 OAuth 登录标识。',
          '使用数据：所使用的功能、学习活动及与服务的交互记录，用于提供和改进产品。',
          '日志信息：IP 地址、设备及浏览器类型、访问时间，在您使用服务时自动记录。'
        ]
      },
      {
        title: '9. 第三方服务',
        body: '我们依赖以下受信任的第三方服务来运营 YomiPlay，每项服务仅为其声明的用途处理数据：',
        list: [
          'Stripe：用于 Web 端订阅的支付处理。',
          'Firebase：用于身份认证、推送通知与数据分析。',
          'Google Analytics：用于网站使用情况的分析。',
          'OpenAI API：用于部分 AI 功能，处理您输入的文本及相关数据。我们仅发送实现该功能所必需的数据，且不包含任何支付信息。'
        ]
      },
      {
        title: '10. Cookie',
        body: '我们的网站使用网站运行所必需的必要 Cookie，以及帮助我们了解网站使用情况的分析 Cookie。您可以在浏览器设置中管理或禁用 Cookie。'
      },
      {
        title: '11. 数据删除方法',
        body: '您可以随时通过应用设置或卸载应用来删除 App 内的本地数据。如需删除您的账号及服务器端的相关数据，请发送邮件至 toshiki.tech.jp@gmail.com 提出申请，我们将为您处理。'
      },
      {
        title: '12. 国际用户权利（GDPR 等）',
        body: '根据您所在地区的法律，您可能有权访问、更正、删除、携带您的个人数据，或反对对其进行处理。我们致力于符合日本《个人信息保护法》（APPI）与欧盟《通用数据保护条例》（GDPR）的基本要求。如需行使上述权利，请通过下方联系方式与我们联系。'
      },
      {
        title: '13. 数据保护',
        body: '我们采取合理的技术与组织措施，保护您的数据免遭未经授权的访问、更改、披露或销毁。尽管没有任何传输或存储方式是绝对安全的，我们仍会尽力保护您的信息。'
      },
      {
        title: '14. 联系我们',
        body: '如果您对本隐私政策有任何疑问，请访问我们的 支持页面 (https://toshiki.tech/zh/yomiplay/support) 或通过电子邮件与我们联系： toshiki.tech.jp@gmail.com'
      }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 隱私政策',
    lastUpdated: '最後生效時間：2026年6月20日',
    sections: [
      {
        title: '1. 簡介',
        body: 'YomiPlay 是一款 AI 驅動的語言學習應用。我們深知個人資訊的重要性，並致力於保護您的隱私。本政策旨在說明我們如何收集和使用您的資訊，以及我們保護隱私的措施。本政策同時適用於 iOS 應用程式與我們的網站（Web）。'
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
        body: '在 iOS 端，所有交易均通過 Apple IAP（應用內購買）處理；在 Web 端，訂閱支付由 Stripe 安全處理。無論哪種情況，我們都不會接觸或儲存您的支付帳戶或銀行卡資訊。'
      },
      {
        title: '7. 您的權利',
        body: '您有權存取、修改或刪除應用程式內的本地資料。由於大部分資料直接儲存於您的裝置中，您可以通過應用程式設定或解除安裝應用程式來清除相關資訊。'
      },
      {
        title: '8. 我們收集的資訊',
        body: '當您建立帳號或使用 Web 服務時，我們可能會收集以下資訊：',
        list: [
          '帳號資訊：電子郵件地址、顯示名稱，以及第三方登入時的 OAuth 登入識別碼。',
          '使用資料：所使用的功能、學習活動及與服務的互動記錄，用於提供和改進產品。',
          '日誌資訊：IP 位址、裝置及瀏覽器類型、存取時間，在您使用服務時自動記錄。'
        ]
      },
      {
        title: '9. 第三方服務',
        body: '我們依賴以下受信任的第三方服務來營運 YomiPlay，每項服務僅為其聲明的用途處理資料：',
        list: [
          'Stripe：用於 Web 端訂閱的支付處理。',
          'Firebase：用於身份認證、推播通知與資料分析。',
          'Google Analytics：用於網站使用情況的分析。',
          'OpenAI API：用於部分 AI 功能，處理您輸入的文字及相關資料。我們僅傳送實現該功能所必需的資料，且不包含任何支付資訊。'
        ]
      },
      {
        title: '10. Cookie',
        body: '我們的網站使用網站運行所必需的必要 Cookie，以及幫助我們了解網站使用情況的分析 Cookie。您可以在瀏覽器設定中管理或停用 Cookie。'
      },
      {
        title: '11. 資料刪除方法',
        body: '您可以隨時通過應用程式設定或解除安裝應用程式來刪除 App 內的本地資料。如需刪除您的帳號及伺服器端的相關資料，請發送電子郵件至 toshiki.tech.jp@gmail.com 提出申請，我們將為您處理。'
      },
      {
        title: '12. 國際使用者權利（GDPR 等）',
        body: '根據您所在地區的法律，您可能有權存取、更正、刪除、攜帶您的個人資料，或反對對其進行處理。我們致力於符合日本《個人資訊保護法》（APPI）與歐盟《一般資料保護規則》（GDPR）的基本要求。如需行使上述權利，請透過下方聯絡方式與我們聯絡。'
      },
      {
        title: '13. 資料保護',
        body: '我們採取合理的技術與組織措施，保護您的資料免遭未經授權的存取、更改、揭露或銷毀。儘管沒有任何傳輸或儲存方式是絕對安全的，我們仍會盡力保護您的資訊。'
      },
      {
        title: '14. 聯絡我們',
        body: '如果您對本隱私政策有任何疑問，請訪問我們的 支援頁面 (https://toshiki.tech/zh-tw/yomiplay/support) 或透過電子郵件與我們聯絡： toshiki.tech.jp@gmail.com'
      }
    ]
  },
  ja: {
    title: 'YomiPlay プライバシーポリシー',
    lastUpdated: '最終発効日：2026年6月20日',
    sections: [
      {
        title: '1. はじめに',
        body: 'YomiPlay は AI を活用した語学学習アプリです。私たちはユーザーの個人情報の重要性を理解し、プライバシーの保護に努めています。本ポリシーでは、収集するデータの内容、目的、および保護措置について説明します。本ポリシーは iOS アプリおよび当社ウェブサイト（Web）の両方に適用されます。'
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
        body: 'iOS では、すべての取引は Apple の App Store 決済を通じて処理されます。Web では、定期購読の支払いは Stripe によって安全に処理されます。いずれの場合も、開発者がユーザーの支払い情報やカード情報に触れることはありません。'
      },
      {
        title: '7. ユーザーの権利',
        body: 'ユーザーはアプリ内のローカルデータにアクセス、修正、削除する権利があります。ほとんどのデータは端末内に保存されており、アプリ設定やアプリの削除によって管理可能です。'
      },
      {
        title: '8. 収集する情報',
        body: 'アカウントの作成時や Web サービスの利用時に、以下の情報を収集する場合があります。',
        list: [
          'アカウント情報：メールアドレス、表示名、および第三者ログイン時の OAuth ログイン識別子。',
          '利用データ：使用した機能、学習アクティビティ、サービスとのやり取り。製品の提供および改善のために利用します。',
          'ログ情報：IP アドレス、端末・ブラウザの種類、アクセス日時。サービス利用時に自動的に記録されます。'
        ]
      },
      {
        title: '9. 第三者サービス',
        body: 'YomiPlay の運営にあたり、以下の信頼できる第三者サービスを利用しています。各サービスは、それぞれ記載された目的のためにのみデータを処理します。',
        list: [
          'Stripe：Web の定期購読における決済処理。',
          'Firebase：認証、プッシュ通知、および解析。',
          'Google Analytics：ウェブサイトの利用状況の解析。',
          'OpenAI API：一部の AI 機能において、入力テキスト等を処理します。当該機能に必要なデータのみを送信し、支払い情報は含まれません。'
        ]
      },
      {
        title: '10. Cookie',
        body: '当社ウェブサイトでは、サイトの動作に必要な必須 Cookie と、サイトの利用状況の把握に役立つ解析 Cookie を使用しています。Cookie はブラウザの設定から管理または無効化できます。'
      },
      {
        title: '11. データの削除方法',
        body: 'アプリ内のローカルデータは、アプリ設定またはアプリの削除によっていつでも削除できます。アカウントおよびサーバー側のデータの削除をご希望の場合は、toshiki.tech.jp@gmail.com 宛にメールでお申し付けください。ご依頼に基づき対応いたします。'
      },
      {
        title: '12. 国際ユーザーの権利（GDPR 等）',
        body: 'お住まいの地域によっては、個人データへのアクセス、訂正、削除、データポータビリティ（持ち運び）、および処理への異議を申し立てる権利を有する場合があります。当社は、日本の個人情報保護法（APPI）および EU 一般データ保護規則（GDPR）の基本的な要件への準拠に努めます。これらの権利を行使される場合は、以下の連絡先までお問い合わせください。'
      },
      {
        title: '13. データ保護',
        body: '当社は、不正アクセス、改ざん、開示、または破壊からデータを保護するため、合理的な技術的・組織的措置を講じています。完全に安全な送信・保存方法は存在しませんが、ユーザーの情報を保護するよう努めます。'
      },
      {
        title: '14. お問い合わせ',
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
