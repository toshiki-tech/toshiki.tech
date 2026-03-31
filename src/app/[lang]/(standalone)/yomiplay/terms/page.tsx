import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Terms of Use',
    subtitle: 'Features and Terms',
    lastUpdated: 'Last Updated: March 27, 2026',
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
        title: 'Subscription & Renewal',
        content: 'YomiPlay offers annual, monthly, or buyout (one-time) options. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. Manage your subscription via App Store settings.'
      },
      {
        title: 'Trial & Free Plan',
        content: 'Basic features and limited transcription quotas are provided for free. We encourage users to fully test the service with the free plan before subscribing.'
      },
      {
        title: 'Fair Use Policy',
        content: '"Unlimited" features are intended for normal, reasonable personal use. Automated scripts, bots, or any form of high-frequency automated access are strictly prohibited. We reserve the right to determine if usage significantly exceeds typical patterns.'
      },
      {
        title: 'Service Suspension',
        content: 'We reserve the right to limit, suspend, or terminate access for users who violate the Fair Use Policy or engage in activities that degrade service quality for others.'
      },
      {
        title: 'Refund Policy',
        content: 'Subscriptions and one-time purchases are generally non-refundable. Please ensure the app meets your needs during the trial period.'
      },
      {
        title: 'Term Modifications',
        content: 'We reserve the right to modify these terms at any time. Significant changes will be announced in-app or on this website.'
      }
    ],
    linksTitle: 'Links',
    links: [
      { label: 'Privacy Policy', url: 'https://toshiki.tech/en/yomiplay/privacy' },
      { label: 'Support & Help', url: 'https://toshiki.tech/en/yomiplay/support' },
      { label: 'Email Support', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  zh: {
    title: 'YomiPlay 使用条款',
    subtitle: '核心功能与条款',
    lastUpdated: '最后生效时间：2026年3月27日',
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
        title: '订阅与自动续订',
        content: '提供按年、按月或一次性买断选项。订阅会自动续订，除非您在当前周期结束前至少 24 小时取消。您可通过 App Store 设置管理订阅。'
      },
      {
        title: '试用与免费计划',
        content: '应用提供基础功能的免费试用及一定额度的转写字数。建议您在订阅前先进行充分测试。'
      },
      {
        title: '公平使用原则',
        content: '“不限时长”权益仅供个人正常、合理使用。严禁使用自动化脚本、机器人或任何形式的高频自动化访问。我们保留对异常使用行为进行判定和干预的权利。'
      },
      {
        title: '服务限制与终止',
        content: '对于违反使用原则或恶意占用资源、影响他用户体验的行为，我们保留限制、暂停或终止其服务访问的权利。'
      },
      {
        title: '退款政策',
        content: '订阅和买断项目通常不支持退款。请在购买前利用试用功能确认应用是否符合您的需求。'
      },
      {
        title: '条款变更',
        content: '我们保留随时修改条款的权利。重大变更将通过应用内或在本网站进行公示。'
      }
    ],
    linksTitle: '链接',
    links: [
      { label: '隐私政策', url: 'https://toshiki.tech/zh/yomiplay/privacy' },
      { label: '支持与帮助', url: 'https://toshiki.tech/zh/yomiplay/support' },
      { label: '邮件支持', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 使用條款',
    subtitle: '核心功能與條款',
    lastUpdated: '最後生效時間：2026年3月27日',
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
        title: '訂閱與自動續訂',
        content: '提供按年、按月或一次性買斷選項。訂閱會自動續訂，除非您在當前週期結束前至少 24 小時取消。您可透過 App Store 設定管理訂閱。'
      },
      {
        title: '試用與免費計劃',
        content: '應用程式提供基礎功能的免費試用及一定額度的轉寫字數。建議您在訂閱前先進行充分測試。'
      },
      {
        title: '公平使用原則',
        content: '「不限時長」權益僅供個人正常、合理使用。嚴禁使用自動化腳本、機器人或任何形式的高頻自動化存取。我們保留對異常使用行為進行判定和干預的權利。'
      },
      {
        title: '服務限制與終止',
        content: '對於違反使用原則或惡意占用資源、影響其他用戶體驗的行為，我們保留限制、暫停或終止其服務存取的權利。'
      },
      {
        title: '退款政策',
        content: '訂閱和買斷項目通常不支援退款。請在購買前利用試用功能確認應用程序是否符合您的需求。'
      },
      {
        title: '條款變更',
        content: '我們保留隨時修改條款的權利。重大變更將透過應用程式內或在本網站進行公示。'
      }
    ],
    linksTitle: '連結',
    links: [
      { label: '隱私政策', url: 'https://toshiki.tech/zh-tw/yomiplay/privacy' },
      { label: '支援與幫助', url: 'https://toshiki.tech/zh-tw/yomiplay/support' },
      { label: '郵件支援', url: 'mailto:toshiki.tech.jp@gmail.com' }
    ]
  },
  ja: {
    title: 'YomiPlay 規約と機能',
    subtitle: '機能および利用条件',
    lastUpdated: '最終発効日：2026年3月27日',
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
        title: '購読と自動更新',
        content: '年払い、月払い、または買い切りオプションを提供しています。期間終了の24時間前までにキャンセルしない限り、自動的に更新されます。App Store の設定から管理可能です。'
      },
      {
        title: '試用と無料プラン',
        content: '標準機能と一定の文字起こし枠を無料で提供しています。購読前に無料プランでサービスを十分にテストすることをお勧めします。'
      },
      {
        title: '公正使用原則（Fair Use）',
        content: '「無制限」機能は通常の個人的な利用を目的としています。スクリプトやボットによる自動アクセスは禁止されています。異常な利用が確認された場合、制限を設ける権利を留保します。'
      },
      {
        title: 'サービスの停止',
        content: '公正使用原則に違反したり、他者の利用を妨げる過度な負荷をかける行為に対して、アクセス制限や停止措置を取る場合があります。'
      },
      {
        title: '返金ポリシー',
        content: 'サブスクリプションおよびデジタルアイテムの購入は原則として返金不可です。試用期間中にニーズに合うか確認してください。'
      },
      {
        title: '規約の変更',
        content: '規約を随时変更する権利を留保します。重大な変更はアプリ内または本サイトで告知されます。'
      }
    ],
    linksTitle: 'リンク',
    links: [
      { label: 'プライバシーポリシー', url: 'https://toshiki.tech/ja/yomiplay/privacy' },
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
