import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'Pricing',
    subtitle: 'Choose the plan that fits your Japanese learning journey. Start free, upgrade anytime.',
    metaDescription: 'YomiPlay pricing plans — Free, Premium monthly, yearly, and lifetime options for serious Japanese learners.',
    perMonth: '/month',
    perYear: '/year',
    oneTime: 'one-time',
    comingSoon: 'Coming Soon',
    plans: [
      {
        name: 'Free',
        price: '¥0',
        period: '',
        tagline: '1 hour/month of free speech-to-text — experience the core listening workflow at no cost.',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium Monthly',
        price: '¥180',
        period: '/month',
        tagline: 'Unlock unlimited subtitle generation, shadowing, TTS, and audio/video subtitle import, export & sharing.',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium Yearly',
        price: '¥1,480',
        period: '/year',
        tagline: 'All Premium features at the best value — roughly 2 months free vs. monthly.',
        highlight: true,
        badge: 'Best Value'
      },
      {
        name: 'Premium Lifetime',
        price: '¥2,980',
        period: 'one-time',
        tagline: 'Pay once, use forever. No recurring fees, all future Premium updates included.',
        highlight: false,
        badge: ''
      }
    ],
    compareTitle: 'Feature Comparison',
    compareHeaders: { feature: 'Feature', free: 'Free', premium: 'Premium' },
    features: [
      { name: 'Recognition quota', isHeader: true, free: '', premium: '' },
      { name: 'Podcast audio recognition', free: '1 hr / month', premium: 'Unlimited' },
      { name: 'Online audio/video link recognition', free: '1 hr / month', premium: 'Unlimited' },
      { name: 'Learning tools — all plans', isHeader: true, free: '', premium: '' },
      { name: 'Translation', free: true, premium: true },
      { name: 'Furigana display', free: true, premium: true },
      { name: 'Romaji', free: true, premium: true },
      { name: 'Sentence-by-sentence playback', free: true, premium: true },
      { name: 'Shadowing', free: true, premium: true },
      { name: 'Premium exclusive', isHeader: true, free: '', premium: '' },
      { name: 'Text-to-Speech (TTS)', free: false, premium: true },
      { name: 'Subtitle file import, export & sharing', free: false, premium: true },
      { name: 'Platform', isHeader: true, free: '', premium: '' },
      { name: 'Supported platforms', free: 'iOS / Android', premium: 'iOS / Android' },
    ],
    androidNote: 'Prices listed above apply to the Android version only. iOS pricing is set by the App Store and may differ — please check the App Store listing for current iOS prices.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'How do I cancel my subscription?',
        a: 'On iOS, open Settings → your Apple ID → Subscriptions, select YomiPlay, and tap Cancel Subscription. On Android, open the app, go to Settings → Account → Manage Subscription, and follow the steps to cancel. Your Premium access remains active until the end of the current billing period.'
      },
      {
        q: 'Does the subscription renew automatically?',
        a: 'Yes. Monthly and yearly Premium plans renew automatically unless you cancel before the current period ends. On iOS, cancel at least 24 hours before renewal via App Store account settings. On Android, cancel anytime through the in-app subscription management page.'
      },
      {
        q: 'Is the Lifetime plan really permanent?',
        a: 'Yes. The Lifetime (one-time purchase) plan unlocks all Premium features permanently with a single payment — there are no recurring charges, and all future Premium updates are included.'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'On iOS, all purchases are processed securely through your App Store account (linked credit card, Apple Pay, or App Store balance). On other platforms, payments are handled by credit card via Stripe.'
      }
    ]
  },
  zh: {
    title: '价格方案',
    subtitle: '选择适合你日语学习之路的方案。免费开始，随时升级。',
    metaDescription: 'YomiPlay 价格方案 —— 免费版、Premium 月付、年付与终身买断，为认真的日语学习者打造。',
    perMonth: '/月',
    perYear: '/年',
    oneTime: '一次性',
    comingSoon: '准备中',
    plans: [
      {
        name: 'Free 免费版',
        price: '¥0',
        period: '',
        tagline: '每月 1 小时语音转文字配额，免费体验核心精听功能。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 月付',
        price: '¥180',
        period: '/月',
        tagline: '解锁无限字幕生成、跟读、文本朗读及音视频字幕资源导入导出分享功能。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 年付',
        price: '¥1,480',
        period: '/年',
        tagline: '全部 Premium 功能，最划算之选 —— 相比月付约省 2 个月。',
        highlight: true,
        badge: '最划算'
      },
      {
        name: 'Premium 买断',
        price: '¥2,980',
        period: '一次性',
        tagline: '一次付费，永久使用。无定期扣费，含未来全部 Premium 更新。',
        highlight: false,
        badge: ''
      }
    ],
    compareTitle: '功能对比',
    compareHeaders: { feature: '功能', free: '免费版', premium: 'Premium' },
    features: [
      { name: '识别额度', isHeader: true, free: '', premium: '' },
      { name: '播客音频识别', free: '每月1小时', premium: '无限' },
      { name: '网络音视频链接识别', free: '每月1小时内', premium: '无限' },
      { name: '学习功能 — 所有版本', isHeader: true, free: '', premium: '' },
      { name: '翻译', free: true, premium: true },
      { name: '假名标注', free: true, premium: true },
      { name: '罗马字', free: true, premium: true },
      { name: '逐句精听播放', free: true, premium: true },
      { name: '跟读', free: true, premium: true },
      { name: 'Premium 专属', isHeader: true, free: '', premium: '' },
      { name: '文本朗读（TTS）', free: false, premium: true },
      { name: '音视频字幕文件导入导出', free: false, premium: true },
      { name: '平台', isHeader: true, free: '', premium: '' },
      { name: '支持平台', free: 'iOS / Android', premium: 'iOS / Android' },
    ],
    androidNote: '以上价格仅适用于 Android 版本。iOS 版本的实际价格由 App Store 决定，可能有所不同，请以 App Store 内显示为准。',
    faqTitle: '常见问题',
    faqs: [
      {
        q: '如何取消订阅？',
        a: '在 iOS 上，打开「设置」→ 你的 Apple ID →「订阅」，选择 YomiPlay 并点击「取消订阅」。在 Android 上，打开 App 后进入「设置」→「账户」→「管理订阅」，按提示操作取消。取消后，在当前计费周期结束前仍可继续使用 Premium。'
      },
      {
        q: '订阅会自动续费吗？',
        a: '会。月付与年付 Premium 会自动续费，取消请在当前周期结束前操作。iOS 需提前至少 24 小时，在 App Store 账户设置中取消；Android 可随时通过 App 内的订阅管理页面取消。'
      },
      {
        q: '终身会员是否永久有效？',
        a: '是的。终身买断方案一次付费即永久解锁全部 Premium 功能，没有任何定期扣费，并包含未来所有 Premium 更新。'
      },
      {
        q: '支持哪些付款方式？',
        a: '在 iOS 上，所有购买均通过 App Store 账户安全处理（绑定的信用卡、Apple Pay 或 App Store 余额）。在其他平台上，付款通过 Stripe 以信用卡完成。'
      }
    ]
  },
  'zh-tw': {
    title: '價格方案',
    subtitle: '選擇適合你日語學習之路的方案。免費開始，隨時升級。',
    metaDescription: 'YomiPlay 價格方案 —— 免費版、Premium 月付、年付與終身買斷，為認真的日語學習者打造。',
    perMonth: '/月',
    perYear: '/年',
    oneTime: '一次性',
    comingSoon: '準備中',
    plans: [
      {
        name: 'Free 免費版',
        price: '¥0',
        period: '',
        tagline: '每月 1 小時語音轉文字配額，免費體驗核心精聽功能。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 月付',
        price: '¥180',
        period: '/月',
        tagline: '解鎖無限字幕生成、跟讀、文字朗讀及音視頻字幕資源導入導出分享功能。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 年付',
        price: '¥1,480',
        period: '/年',
        tagline: '全部 Premium 功能，最划算之選 —— 相比月付約省 2 個月。',
        highlight: true,
        badge: '最划算'
      },
      {
        name: 'Premium 買斷',
        price: '¥2,980',
        period: '一次性',
        tagline: '一次付費，永久使用。無定期扣費，含未來全部 Premium 更新。',
        highlight: false,
        badge: ''
      }
    ],
    compareTitle: '功能對比',
    compareHeaders: { feature: '功能', free: '免費版', premium: 'Premium' },
    features: [
      { name: '識別額度', isHeader: true, free: '', premium: '' },
      { name: '播客音頻識別', free: '每月1小時', premium: '無限' },
      { name: '網路音視頻連結識別', free: '每月1小時內', premium: '無限' },
      { name: '學習功能 — 所有版本', isHeader: true, free: '', premium: '' },
      { name: '翻譯', free: true, premium: true },
      { name: '假名標注', free: true, premium: true },
      { name: '羅馬字', free: true, premium: true },
      { name: '逐句精聽播放', free: true, premium: true },
      { name: '跟讀', free: true, premium: true },
      { name: 'Premium 專屬', isHeader: true, free: '', premium: '' },
      { name: '文字朗讀（TTS）', free: false, premium: true },
      { name: '音視頻字幕檔案導入導出', free: false, premium: true },
      { name: '平台', isHeader: true, free: '', premium: '' },
      { name: '支援平台', free: 'iOS / Android', premium: 'iOS / Android' },
    ],
    androidNote: '以上價格僅適用於 Android 版本。iOS 版本的實際價格由 App Store 決定，可能有所不同，請以 App Store 內顯示為準。',
    faqTitle: '常見問題',
    faqs: [
      {
        q: '如何取消訂閱？',
        a: '在 iOS 上，開啟「設定」→ 你的 Apple ID →「訂閱」，選擇 YomiPlay 並點擊「取消訂閱」。在 Android 上，開啟 App 後進入「設定」→「帳號」→「管理訂閱」，依照提示操作取消。取消後，在目前計費週期結束前仍可繼續使用 Premium。'
      },
      {
        q: '訂閱會自動續訂嗎？',
        a: '會。月付與年付 Premium 會自動續訂，請在目前週期結束前取消。iOS 需提前至少 24 小時，在 App Store 帳戶設定中取消；Android 可隨時透過 App 內的訂閱管理頁面取消。'
      },
      {
        q: '終身會員是否永久有效？',
        a: '是的。終身買斷方案一次付費即永久解鎖全部 Premium 功能，沒有任何定期扣費，並包含未來所有 Premium 更新。'
      },
      {
        q: '支援哪些付款方式？',
        a: '在 iOS 上，所有購買均通過 App Store 帳戶安全處理（綁定的信用卡、Apple Pay 或 App Store 餘額）。在其他平台上，付款通過 Stripe 以信用卡完成。'
      }
    ]
  },
  ja: {
    title: '料金プラン',
    subtitle: 'あなたの日本語学習に合ったプランをお選びください。無料で始めて、いつでもアップグレードできます。',
    metaDescription: 'YomiPlay の料金プラン。無料版、Premium 月額・年額・買い切りから、本気で学ぶあなたに最適なプランを。',
    perMonth: '/月',
    perYear: '/年',
    oneTime: '買い切り',
    comingSoon: '準備中',
    plans: [
      {
        name: 'Free（無料）',
        price: '¥0',
        period: '',
        tagline: '毎月1時間の音声テキスト変換枠付き、無料でコア精聴機能をお試しいただけます。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 月額',
        price: '¥180',
        period: '/月',
        tagline: '無制限の字幕生成・シャドーイング・読み上げ、音声／動画字幕リソースのインポート・エクスポート・共有を解放。',
        highlight: false,
        badge: ''
      },
      {
        name: 'Premium 年額',
        price: '¥1,480',
        period: '/年',
        tagline: 'すべての Premium 機能を最もお得に。月額換算で約2ヶ月分お得です。',
        highlight: true,
        badge: 'お得'
      },
      {
        name: 'Premium 買い切り',
        price: '¥2,980',
        period: '買い切り',
        tagline: '一度の購入で永久に利用可能。継続課金なし、今後の Premium アップデートもすべて含まれます。',
        highlight: false,
        badge: ''
      }
    ],
    compareTitle: '機能比較',
    compareHeaders: { feature: '機能', free: 'Free', premium: 'Premium' },
    features: [
      { name: '認識枠', isHeader: true, free: '', premium: '' },
      { name: 'ポッドキャスト音声認識', free: '月1時間', premium: '無制限' },
      { name: 'ネット音声・動画リンク認識', free: '月1時間内', premium: '無制限' },
      { name: '学習機能 — 全プラン共通', isHeader: true, free: '', premium: '' },
      { name: '翻訳', free: true, premium: true },
      { name: 'ふりがな表示', free: true, premium: true },
      { name: 'ローマ字', free: true, premium: true },
      { name: '一文ずつ精聴再生', free: true, premium: true },
      { name: 'シャドーイング', free: true, premium: true },
      { name: 'Premium 限定', isHeader: true, free: '', premium: '' },
      { name: '読み上げ（TTS）', free: false, premium: true },
      { name: '字幕ファイル 読み込み・書き出し・共有', free: false, premium: true },
      { name: 'プラットフォーム', isHeader: true, free: '', premium: '' },
      { name: '対応プラットフォーム', free: 'iOS / Android', premium: 'iOS / Android' },
    ],
    androidNote: '上記の価格は Android 版の料金です。iOS 版の価格は App Store の設定に準じるため異なる場合があります。最新の iOS 価格は App Store の掲載ページをご確認ください。',
    faqTitle: 'よくあるご質問',
    faqs: [
      {
        q: '定期購読はどうやって解約しますか？',
        a: 'iOS では「設定」→ ご自身の Apple ID →「サブスクリプション」から YomiPlay を選び、「サブスクリプションをキャンセル」をタップしてください。Android では App を開き「設定」→「アカウント」→「サブスクリプション管理」から手順に従って解約できます。解約後も現在の請求期間の終了まで Premium をご利用いただけます。'
      },
      {
        q: '自動更新されますか？',
        a: 'はい。月額・年額の Premium プランは自動更新されます。iOS では現在の期間終了の24時間以上前に App Store のアカウント設定から解約してください。Android ではいつでも App 内のサブスクリプション管理ページから解約できます。'
      },
      {
        q: '買い切り（Lifetime）は永久に有効ですか？',
        a: 'はい。買い切りプランは一度のお支払いですべての Premium 機能を永久に開放します。継続課金は一切なく、今後の Premium アップデートもすべて含まれます。'
      },
      {
        q: '支払い方法には何がありますか？',
        a: 'iOS ではすべての購入が App Store アカウントを通じて安全に処理されます（登録済みのクレジットカード、Apple Pay、App Store 残高）。その他のプラットフォームでは、Stripe を介したクレジットカード決済に対応しています。'
      }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | Toshiki Tech`,
    description: t.metaDescription,
  };
}

export default function YomiPlayPricingPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return <span className="text-[rgb(var(--accent))] font-semibold">✓</span>;
    }
    if (value === false) {
      return <span className="text-[var(--muted-foreground)]">—</span>;
    }
    return <span className="text-[var(--foreground-rgb)]">{value}</span>;
  };

  return (
    <div className="container-custom py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground-rgb)] mb-4">
          {t.title}
        </h1>
        <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {t.plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col rounded-2xl border bg-[var(--card)] p-6 ${
              plan.highlight
                ? 'border-[rgb(var(--accent))] shadow-lg'
                : 'border-[var(--border)]'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[rgb(var(--accent))] px-3 py-1 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}
            <h2 className="text-lg font-bold text-[var(--foreground-rgb)] mb-3">
              {plan.name}
            </h2>
            <div className="mb-4 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[var(--foreground-rgb)]">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-sm text-[var(--muted-foreground)]">
                  {plan.period}
                </span>
              )}
            </div>
            <p className="flex-1 text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
              {plan.tagline}
            </p>
            <button
              type="button"
              disabled
              className={`w-full cursor-not-allowed rounded-lg px-4 py-2.5 text-sm font-semibold ${
                plan.highlight
                  ? 'bg-[rgb(var(--accent))] text-white opacity-60'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)]'
              }`}
            >
              {t.comingSoon}
            </button>
          </div>
        ))}
      </div>

      {/* Android-only pricing notice */}
      <div className="mb-10 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-5 py-4 text-sm text-[var(--muted-foreground)]">
        <span className="mt-0.5 shrink-0 text-base">ℹ️</span>
        <p className="leading-relaxed">{t.androidNote}</p>
      </div>

      {/* Feature comparison table */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-[var(--foreground-rgb)] mb-6 text-center">
          {t.compareTitle}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-4 text-left font-semibold text-[var(--foreground-rgb)]">
                  {t.compareHeaders.feature}
                </th>
                <th className="px-6 py-4 text-center font-semibold text-[var(--foreground-rgb)]">
                  {t.compareHeaders.free}
                </th>
                <th className="px-6 py-4 text-center font-semibold text-[rgb(var(--accent))]">
                  {t.compareHeaders.premium}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.features.map((feature, idx) => (
                feature.isHeader ? (
                  <tr key={idx} className="bg-[var(--muted)]/40">
                    <td colSpan={3} className="px-6 pt-5 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      {feature.name}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={idx}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-6 py-4 text-[var(--foreground-rgb)]">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderCell(feature.free as boolean | string)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderCell(feature.premium as boolean | string)}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground-rgb)] mb-6 text-center">
          {t.faqTitle}
        </h2>
        <div className="space-y-4">
          {t.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <h3 className="text-base font-semibold text-[var(--foreground-rgb)] mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
