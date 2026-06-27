import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Terms of Use',
    subtitle: 'Features and Terms',
    lastUpdated: 'Last Updated: June 20, 2026',
    items: [
      {
        text: 'On-device Transcription: Generating subtitles relies on the AI model residing on your device. On performance-limited devices, the quality and speed of generation cannot be guaranteed.',
        isDisclaimer: true
      },
      { text: 'Correction: Support manual correction and adjustment of generated subtitles and translations.' },
      { text: 'Translation: Support subtitle translation (system language packs may be required).' },
      { text: 'Basic Export: Export subtitles to .yomi format or common formats such as SRT.' }
    ],
    proTitle: 'Pro Benefits (Subscription Required)',
    proItems: [
      'Import and process video files directly.',
      'Unlimited duration for transcribing audio/video into subtitles.',
      'Export and share audio/video along with generated subtitle files.',
      'Batch import and export using ZIP packages (containing media and subtitles).'
    ],
    additionalSections: [
      {
        title: '1. Subscription & Auto-Renewal',
        content: 'YomiPlay is available on both iOS and the Web, with Premium pricing of ¥180/month, ¥1,480/year, or a ¥2,980 one-time Lifetime purchase. On the Web (billed via Stripe), monthly and annual plans automatically renew at the end of each period unless canceled at least 24 hours before the period ends. On iOS, subscriptions purchased through the App Store automatically renew unless canceled at least 24 hours before the end of the current period. The Lifetime (buyout) plan is a single one-time purchase and does not renew.'
      },
      {
        title: '2. Canceling Your Membership',
        content: 'On the Web, cancel anytime via the membership management page or your account settings; you retain access until the end of the current paid period. On iOS, manage and cancel subscriptions through App Store subscription settings on your device. Canceling stops future renewals but does not retroactively refund the current period.'
      },
      {
        title: '3. Trial & Free Plan',
        content: 'Basic features and limited transcription quotas are provided for free. We encourage users to fully test the service with the free plan before subscribing.'
      },
      {
        title: '4. Fair Use Policy',
        content: '"Unlimited" features are intended for normal, reasonable personal use. Automated scripts, bots, or any form of high-frequency automated access are strictly prohibited. We reserve the right to determine if usage significantly exceeds typical patterns.'
      },
      {
        title: '5. Refund Policy',
        content: 'Subscriptions and one-time purchases are, in principle, non-refundable. Please ensure the app meets your needs during the trial period. For details and any statutory exceptions, see our Refund Policy at /yomiplay/refund.'
      },
      {
        title: '6. Price Changes',
        content: 'We reserve the right to adjust prices for subscriptions and one-time purchases. Any price change will be announced in advance, and for recurring plans will take effect from the next renewal after notice; you may cancel before the change takes effect.'
      },
      {
        title: '7. Service Suspension & Changes',
        content: 'We may suspend, modify, or discontinue all or part of the service for maintenance, updates, or due to force majeure or other unavoidable circumstances. We also reserve the right to limit, suspend, or terminate access for users who violate the Fair Use Policy or engage in activities that degrade service quality for others.'
      },
      {
        title: '8. Disclaimer & Limitation of Liability',
        content: 'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by applicable law, the operator shall not be liable for any indirect, incidental, or consequential damages arising from use of the service, and total liability shall be limited as permitted by law.'
      },
      {
        title: '9. Intellectual Property',
        content: 'The YomiPlay application, its software, and all related content are owned by the operator and protected by applicable laws. You retain ownership of content you upload, but grant the operator the limited license necessary to process, store, and transmit it solely to provide the service to you.'
      },
      {
        title: '10. Copyright & Content Policy',
        content: 'YomiPlay is an AI-powered learning tool that processes audio and video content provided by the user. Users may only upload or process content that they own or are authorized to use. YomiPlay does not host, distribute, or provide copyrighted media content. Users are solely responsible for ensuring they have the right to process any content they submit to the service.'
      },
      {
        title: '11. Governing Law & Jurisdiction',
        content: 'These terms are governed by the laws of Japan. Any disputes arising in connection with the service shall be subject to the exclusive jurisdiction of the courts of Japan as the court of first instance.'
      },
      {
        title: '12. Operator & Contact',
        content: 'This service is operated by DU BIAOQI, an individual developer based in Japan. For inquiries, contact toshiki.tech.jp@gmail.com.'
      },
      {
        title: '13. Term Modifications',
        content: 'We reserve the right to modify these terms at any time. Significant changes will be announced in-app or on this website.'
      }
    ],
    linksTitle: 'Links',
    links: [
      { label: 'Privacy Policy', url: 'https://toshiki.tech/en/yomiplay/privacy' },
      { label: 'Refund Policy', url: 'https://toshiki.tech/en/yomiplay/refund' },
      { label: 'Legal Notice (Specified Commercial Transactions Act)', url: 'https://toshiki.tech/en/yomiplay/legal' },
      { label: 'Support & Help', url: 'https://toshiki.tech/en/yomiplay/support' },
      { label: 'Email Support', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  zh: {
    title: 'YomiPlay 使用条款',
    subtitle: '核心功能与条款',
    lastUpdated: '最后生效时间：2026年6月20日',
    items: [
      {
        text: '设备端转写：生成字幕依托于用户手机设备上的 AI 模型。在设备性能较低的情况下，生成字幕的效果和速度无法完全保证。',
        isDisclaimer: true
      },
      { text: '手动修正：支持用户对生成的字幕与翻译内容进行修正与处理。' },
      { text: '字幕翻译：支持多语言翻译功能（可能需要下载系统语言包）。' },
      { text: '基础导出：支持将字幕导出为 .yomi 格式 / 或 .SRT 等常见格式。' }
    ],
    proTitle: 'Pro 权益（订阅解锁）',
    proItems: [
      '支持导入并处理视频文件。',
      '不限制音视频转写为字幕的总时长。',
      '支持对音视频和字幕的导出与社交分享。',
      '支持将音视频与字幕打包为 ZIP 文件进行导入导出。'
    ],
    additionalSections: [
      {
        title: '1. 订阅与自动续费',
        content: 'YomiPlay 同时提供 iOS 与 Web 版本，Premium 价格为月额 ¥180 / 年额 ¥1,480 / 一次性买断（Lifetime）¥2,980。Web 端（经 Stripe 收款）的月额与年额订阅将在当期到期时自动续费，除非您在当期结束前至少 24 小时取消。iOS 端经 App Store 购买的订阅会自动续订，除非您在当前周期结束前至少 24 小时取消。买断（Lifetime）为一次性购买，不会自动续费。'
      },
      {
        title: '2. 会员取消方法',
        content: 'Web 端可随时通过「会员管理页 / 账户设置」取消，取消后您仍可使用至当期付费周期结束。iOS 端请通过设备上的 App Store 订阅管理页取消。取消仅停止后续续费，不对已支付的当期进行追溯退款。'
      },
      {
        title: '3. 试用与免费计划',
        content: '应用提供基础功能的免费试用及一定额度的转写字数。建议您在订阅前先进行充分测试。'
      },
      {
        title: '4. 公平使用原则',
        content: '“不限时长”权益仅供个人正常、合理使用。严禁使用自动化脚本、机器人或任何形式的高频自动化访问。我们保留对异常使用行为进行判定和干预的权利。'
      },
      {
        title: '5. 退款政策',
        content: '订阅和买断项目原则上不支持退款。请在购买前利用试用功能确认应用是否符合您的需求。详情及法定例外情形请参阅退款政策（/yomiplay/refund）。'
      },
      {
        title: '6. 价格变更',
        content: '我们保留调整订阅及买断价格的权利。任何价格变更将提前通知；对于周期性订阅，将自通知后的下一个续费周期起生效，您可在变更生效前取消。'
      },
      {
        title: '7. 服务停止与变更',
        content: '我们可能因维护、升级或不可抗力等不得已的情形，暂停、变更或终止全部或部分服务。对于违反使用原则或恶意占用资源、影响其他用户体验的行为，我们亦保留限制、暂停或终止其服务访问的权利。'
      },
      {
        title: '8. 免责声明与责任限制',
        content: '本服务按「现状」提供，不附带任何明示或默示的保证。在适用法律允许的最大范围内，运营者对因使用本服务而产生的任何间接、附带或后果性损害不承担责任，且总责任以法律允许的范围为限。'
      },
      {
        title: '9. 知识产权',
        content: 'YomiPlay 应用、软件及相关内容的知识产权归运营者所有，并受相关法律保护。您上传的内容仍归您所有，但您授予运营者为向您提供服务所必需的、用于处理、存储与传输该内容的有限许可。'
      },
      {
        title: '10. 版权与内容政策',
        content: 'YomiPlay 是一款由 AI 驱动的学习工具，仅处理用户自行提供的音视频内容。用户只能上传或处理其本人拥有版权或已获得授权使用的内容。YomiPlay 不托管、分发或提供任何受版权保护的媒体内容。用户自行承担确保其提交内容合法合规的全部责任。'
      },
      {
        title: '11. 准据法与管辖',
        content: '本条款适用日本法。因本服务产生的相关纠纷，以日本法院为第一审专属管辖法院。'
      },
      {
        title: '12. 运营者与联系方式',
        content: '本服务由日本个人开发者 DU BIAOQI 运营。如有咨询，请联系 toshiki.tech.jp@gmail.com。'
      },
      {
        title: '13. 条款变更',
        content: '我们保留随时修改条款的权利。重大变更将通过应用内或在本网站进行公示。'
      }
    ],
    linksTitle: '链接',
    links: [
      { label: '隐私政策', url: 'https://toshiki.tech/zh/yomiplay/privacy' },
      { label: '退款政策', url: 'https://toshiki.tech/zh/yomiplay/refund' },
      { label: '特定商交易法表记', url: 'https://toshiki.tech/zh/yomiplay/legal' },
      { label: '支持与帮助', url: 'https://toshiki.tech/zh/yomiplay/support' },
      { label: '邮件支持', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 使用條款',
    subtitle: '核心功能與條款',
    lastUpdated: '最後生效時間：2026年6月20日',
    items: [
      {
        text: '裝置端轉寫：產生字幕依託於用戶手機裝置上的 AI 模型。在裝置性能較低的情況下，產生字幕的效果和速度無法完全保證。',
        isDisclaimer: true
      },
      { text: '手動修正：支援用戶對產生的字幕與翻譯內容進行修正與處理。' },
      { text: '字幕翻譯：支援多語言翻譯功能（可能需要下載系統語言套件）。' },
      { text: '基礎匯出：支援將字幕匯出為 .yomi 格式 / 或 .SRT 等常見格式。' }
    ],
    proTitle: 'Pro 權益（訂閱解鎖）',
    proItems: [
      '支援匯入並處理影片檔案。',
      '不限制音視訊轉寫為字幕的總時長。',
      '支援對音視訊和字幕的匯出與社交分享。',
      '支援將音視訊與字幕打包為 ZIP 檔案進行匯入及匯出。'
    ],
    additionalSections: [
      {
        title: '1. 訂閱與自動續費',
        content: 'YomiPlay 同時提供 iOS 與 Web 版本，Premium 價格為月額 ¥180 / 年額 ¥1,480 / 一次性買斷（Lifetime）¥2,980。Web 端（經 Stripe 收款）的月額與年額訂閱將在當期到期時自動續費，除非您在當期結束前至少 24 小時取消。iOS 端經 App Store 購買的訂閱會自動續訂，除非您在當前週期結束前至少 24 小時取消。買斷（Lifetime）為一次性購買，不會自動續費。'
      },
      {
        title: '2. 會員取消方法',
        content: 'Web 端可隨時透過「會員管理頁 / 帳戶設定」取消，取消後您仍可使用至當期付費週期結束。iOS 端請透過裝置上的 App Store 訂閱管理頁取消。取消僅停止後續續費，不對已支付的當期進行追溯退款。'
      },
      {
        title: '3. 試用與免費計劃',
        content: '應用程式提供基礎功能的免費試用及一定額度的轉寫字數。建議您在訂閱前先進行充分測試。'
      },
      {
        title: '4. 公平使用原則',
        content: '「不限時長」權益僅供個人正常、合理使用。嚴禁使用自動化腳本、機器人或任何形式的高頻自動化存取。我們保留對異常使用行為進行判定和干預的權利。'
      },
      {
        title: '5. 退款政策',
        content: '訂閱和買斷項目原則上不支援退款。請在購買前利用試用功能確認應用程式是否符合您的需求。詳情及法定例外情形請參閱退款政策（/yomiplay/refund）。'
      },
      {
        title: '6. 價格變更',
        content: '我們保留調整訂閱及買斷價格的權利。任何價格變更將提前通知；對於週期性訂閱，將自通知後的下一個續費週期起生效，您可在變更生效前取消。'
      },
      {
        title: '7. 服務停止與變更',
        content: '我們可能因維護、升級或不可抗力等不得已的情形，暫停、變更或終止全部或部分服務。對於違反使用原則或惡意占用資源、影響其他用戶體驗的行為，我們亦保留限制、暫停或終止其服務存取的權利。'
      },
      {
        title: '8. 免責聲明與責任限制',
        content: '本服務按「現狀」提供，不附帶任何明示或默示的保證。在適用法律允許的最大範圍內，營運者對因使用本服務而產生的任何間接、附帶或後果性損害不承擔責任，且總責任以法律允許的範圍為限。'
      },
      {
        title: '9. 智慧財產權',
        content: 'YomiPlay 應用程式、軟體及相關內容的智慧財產權歸營運者所有，並受相關法律保護。您上傳的內容仍歸您所有，但您授予營運者為向您提供服務所必需的、用於處理、儲存與傳輸該內容的有限授權。'
      },
      {
        title: '10. 著作權與內容政策',
        content: 'YomiPlay 是一款由 AI 驅動的學習工具，僅處理用戶自行提供的影音內容。用戶只能上傳或處理其本人擁有著作權或已獲得授權使用的內容。YomiPlay 不托管、分發或提供任何受著作權保護的媒體內容。用戶自行承擔確保其提交內容合法合規的全部責任。'
      },
      {
        title: '11. 準據法與管轄',
        content: '本條款適用日本法。因本服務產生的相關糾紛，以日本法院為第一審專屬管轄法院。'
      },
      {
        title: '12. 營運者與聯絡方式',
        content: '本服務由日本個人開發者 DU BIAOQI 營運。如有諮詢，請聯絡 toshiki.tech.jp@gmail.com。'
      },
      {
        title: '13. 條款變更',
        content: '我們保留隨時修改條款的權利。重大變更將透過應用程式內或在本網站進行公示。'
      }
    ],
    linksTitle: '連結',
    links: [
      { label: '隱私政策', url: 'https://toshiki.tech/zh-tw/yomiplay/privacy' },
      { label: '退款政策', url: 'https://toshiki.tech/zh-tw/yomiplay/refund' },
      { label: '特定商交易法表記', url: 'https://toshiki.tech/zh-tw/yomiplay/legal' },
      { label: '支援與幫助', url: 'https://toshiki.tech/zh-tw/yomiplay/support' },
      { label: '郵件支援', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  ja: {
    title: 'YomiPlay 規約と機能',
    subtitle: '機能および利用条件',
    lastUpdated: '最終発効日：2026年6月20日',
    items: [
      {
        text: 'デバイス上での文字起こし：字幕の生成はユーザーのデバイス上的 AI モデルに依存します。デバイスの性能が低い場合、生成の品質や速度は保証されません。',
        isDisclaimer: true
      },
      { text: '手動修正：生成された字幕や翻訳内容の修正・加工に対応しています。' },
      { text: '字幕翻訳：多言語翻訳功能に対応しています（システム言語パックが必要な場合があります）。' },
      { text: '標準書き出し：.yomi 形式、または SRT などの一般的な形式での書き出しに対応しています。' }
    ],
    proTitle: 'Pro 諸機能（購読で解放）',
    proItems: [
      '動画ファイルの直接取り込みと処理。',
      '音声・動画の文字起こし時間の無制限化。',
      '音声・動画および字幕ファイルの書き出しと共有。',
      '音声・動画と字幕を ZIP パッケージとしてインポート・エクスポート。'
    ],
    additionalSections: [
      {
        title: '1. 購読と自動更新',
        content: 'YomiPlay は iOS と Web の両方で提供され、Premium 料金は月額 ¥180／年額 ¥1,480／買い切り（Lifetime）¥2,980 です。Web 版（Stripe による決済）の月額・年額プランは、期間終了の24時間前までにキャンセルしない限り、期間満了時に自動的に更新されます。iOS 版で App Store を通じて購入した購読も、現在の期間終了の24時間前までにキャンセルしない限り自動更新されます。買い切り（Lifetime）は一度限りの購入であり、自動更新はされません。'
      },
      {
        title: '2. 解約方法',
        content: 'Web 版では、会員管理ページまたはアカウント設定からいつでも解約できます。解約後も、現在の支払い済み期間の終了までご利用いただけます。iOS 版では、端末上の App Store の購読管理から解約してください。解約は今後の更新を停止するものであり、現在の期間について遡及的な返金は行われません。'
      },
      {
        title: '3. 試用と無料プラン',
        content: '標準機能と一定の文字起こし枠を無料で提供しています。購読前に無料プランでサービスを十分にテストすることをお勧めします。'
      },
      {
        title: '4. 公正使用原則（Fair Use）',
        content: '「無制限」機能は通常の個人的な利用を目的としています。スクリプトやボットによる自動アクセスは禁止されています。異常な利用が確認された場合、制限を設ける権利を留保します。'
      },
      {
        title: '5. 返金ポリシー',
        content: 'サブスクリプションおよび買い切りの購入は原則として返金不可です。試用期間中にニーズに合うか確認してください。詳細および法定の例外については、返金ポリシー（/yomiplay/refund）をご覧ください。'
      },
      {
        title: '6. 価格の変更',
        content: 'サブスクリプションおよび買い切りの価格を変更する権利を留保します。価格変更は事前に告知し、継続課金プランについては告知後の次回更新時から適用されます。お客様は変更が適用される前に解約することができます。'
      },
      {
        title: '7. サービスの停止・変更',
        content: 'メンテナンス、更新、または不可抗力その他やむを得ない事由により、サービスの全部または一部を停止・変更・終了する場合があります。また、公正使用原則に違反したり、他者の利用を妨げる過度な負荷をかける行為に対して、アクセス制限や停止措置を取る場合があります。'
      },
      {
        title: '8. 免責事項・責任の制限',
        content: '本サービスは「現状有姿」で提供され、いかなる保証も伴いません。適用法令が許容する最大限の範囲において、運営者は本サービスの利用に起因する間接的・付随的・結果的損害について責任を負わず、総責任は法令が認める範囲に制限されます。'
      },
      {
        title: '9. 知的財産権',
        content: 'YomiPlay アプリケーション、ソフトウェアおよび関連コンテンツの知的財産権は運営者に帰属し、関連法令により保護されます。お客様がアップロードしたコンテンツの権利はお客様に帰属しますが、サービス提供に必要な範囲で、当該コンテンツを処理・保存・送信するための限定的なライセンスを運営者に許諾するものとします。'
      },
      {
        title: '10. 著作権・コンテンツポリシー',
        content: 'YomiPlayは、ユーザーが提供した音声・動画コンテンツを処理するAI学習ツールです。ユーザーは、自身が所有または使用を許諾されたコンテンツのみをアップロードまたは処理することができます。YomiPlayは、著作権で保護されたメディアコンテンツのホスト、配布、または提供を行いません。ユーザーは、サービスに提出するコンテンツの適法な利用権を確保する責任を単独で負います。'
      },
      {
        title: '11. 準拠法・管轄',
        content: '本規約は日本法に準拠します。本サービスに関連して生じる紛争については、日本の裁判所を第一審の専属的合意管轄裁判所とします。'
      },
      {
        title: '12. 運営者・お問い合わせ',
        content: '本サービスは、日本の個人開発者である DU BIAOQI が運営しています。お問い合わせは toshiki.tech.jp@gmail.com までご連絡ください。'
      },
      {
        title: '13. 規約の変更',
        content: '規約を随时変更する権利を留保します。重大な変更はアプリ内または本サイトで告知されます。'
      }
    ],
    linksTitle: 'リンク',
    links: [
      { label: 'プライバシーポリシー', url: 'https://toshiki.tech/ja/yomiplay/privacy' },
      { label: '返金ポリシー', url: 'https://toshiki.tech/ja/yomiplay/refund' },
      { label: '特定商取引法に基づく表記', url: 'https://toshiki.tech/ja/yomiplay/legal' },
      { label: 'サポートとヘルプ', url: 'https://toshiki.tech/ja/yomiplay/support' },
      { label: 'メールサポート', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | Toshiki Tech`,
  };
}

export default function YomiPlayTermsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-xl text-[var(--muted-foreground)] mb-2">
        {t.subtitle}
      </p>
      <p className="text-xs text-[var(--muted-foreground)] mb-10 italic">
        {t.lastUpdated}
      </p>
      
      <div className="space-y-12 text-[var(--muted-foreground)] leading-relaxed text-sm md:text-base">
        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-4">
            {t.items.map((item, idx) => (
              <li key={idx} className={`${item.isDisclaimer ? 'text-amber-600 dark:text-amber-500 italic' : 'text-[var(--foreground-rgb)]'}`}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[rgba(var(--accent),0.05)] p-6 rounded-2xl border border-[rgba(var(--accent),0.2)]">
          <h2 className="text-xl font-bold text-[rgb(var(--accent))] mb-4 mt-0">
            {t.proTitle}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[var(--foreground-rgb)]">
            {t.proItems.map((item, idx) => (
              <li key={idx}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {t.additionalSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-[var(--foreground-rgb)] border-l-4 border-[rgb(var(--accent))] pl-3">
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--foreground-rgb)] mb-4">
            {t.linksTitle}
          </h2>
          <ul className="space-y-2">
            {t.links.map((link, idx) => (
              <li key={idx}>
                <a 
                  href={link.url} 
                  className="text-[rgb(var(--accent))] hover:underline font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
