import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Refund Policy',
    lastUpdated: 'Last Updated: June 2026',
    sections: [
      {
        title: '1. Basic Policy',
        body: 'YomiPlay is a Japanese language learning app. Due to the nature of digital content, we do not offer refunds as a general rule once a purchase or subscription has been completed.'
      },
      {
        title: '2. About Automatic Renewal',
        body: 'Monthly (¥180) and yearly (¥1,480) Premium plans renew automatically unless you cancel at least 24 hours before the end of the current period. Cancelling stops the next renewal charge.'
      },
      {
        title: '3. How to Cancel',
        body: 'For web subscriptions (paid via Stripe / credit card), cancel from the account management page or settings within the app. For iOS subscriptions, cancel from the subscription management section of the App Store. Even after cancelling, you can continue using Premium features until the end of the current paid period.'
      },
      {
        title: '4. Purchases via the App Store',
        body: 'Refunds for purchases made through the App Store are governed by Apple’s refund policy. Please request a refund directly from Apple at reportaproblem.apple.com. As the developer, we are unable to process refunds for transactions handled by Apple.'
      },
      {
        title: '5. Lifetime (One-Time Purchase)',
        body: 'The Lifetime plan (¥2,980) is a one-time purchase. As a general rule, no refund is available after the purchase has been completed.'
      },
      {
        title: '6. Exceptions & Issues',
        body: 'If you experience problems such as duplicate charges or payment errors, please contact us at toshiki.tech.jp@gmail.com. We will review your case and respond individually depending on the situation.'
      },
      {
        title: '7. Contact Us',
        body: 'For any questions regarding this Refund Policy, please contact us by email: toshiki.tech.jp@gmail.com'
      }
    ]
  },
  zh: {
    title: 'YomiPlay 退款政策',
    lastUpdated: '最后更新时间：2026年6月',
    sections: [
      {
        title: '1. 基本方针',
        body: 'YomiPlay 是一款日语学习应用。鉴于数字内容的特性，购买或订阅完成后，我们原则上不提供退款。'
      },
      {
        title: '2. 关于自动续订',
        body: '月度（¥180）和年度（¥1,480）高级订阅会在当前周期结束前不进行取消的情况下自动续订。如需停止下一期续费，请在当前周期结束前至少 24 小时取消订阅。取消后即可停止下一次续费扣款。'
      },
      {
        title: '3. 取消方法',
        body: '通过网页（Stripe / 信用卡）订阅的用户，请在应用内的会员管理页面或设置中取消；iOS 用户请在 App Store 的订阅管理中取消。取消订阅后，您仍可在当前已付费周期结束前继续使用高级功能。'
      },
      {
        title: '4. 通过 App Store 购买',
        body: '通过 App Store 购买的退款受 Apple 退款政策约束。请直接前往 Apple（reportaproblem.apple.com）提交退款申请。作为开发者，我们无法处理由 Apple 完成的交易退款。'
      },
      {
        title: '5. 买断（Lifetime）',
        body: '买断版（¥2,980）为一次性购买。购买完成后原则上不予退款。'
      },
      {
        title: '6. 例外与问题处理',
        body: '如遇到重复扣款、支付错误等异常情况，请联系 toshiki.tech.jp@gmail.com。我们将根据具体情况进行核实并个别处理。'
      },
      {
        title: '7. 联系我们',
        body: '如您对本退款政策有任何疑问，请通过电子邮件与我们联系：toshiki.tech.jp@gmail.com'
      }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 退款政策',
    lastUpdated: '最後更新時間：2026年6月',
    sections: [
      {
        title: '1. 基本方針',
        body: 'YomiPlay 是一款日語學習應用。鑑於數位內容的特性，購買或訂閱完成後，我們原則上不提供退款。'
      },
      {
        title: '2. 關於自動續訂',
        body: '月度（¥180）與年度（¥1,480）進階訂閱會在目前週期結束前未取消的情況下自動續訂。如需停止下一期續費，請在目前週期結束前至少 24 小時取消訂閱。取消後即可停止下一次續費扣款。'
      },
      {
        title: '3. 取消方法',
        body: '透過網頁（Stripe / 信用卡）訂閱的使用者，請在應用程式內的會員管理頁面或設定中取消；iOS 使用者請在 App Store 的訂閱管理中取消。取消訂閱後，您仍可在目前已付費週期結束前繼續使用進階功能。'
      },
      {
        title: '4. 透過 App Store 購買',
        body: '透過 App Store 購買的退款受 Apple 退款政策約束。請直接前往 Apple（reportaproblem.apple.com）提交退款申請。作為開發者，我們無法處理由 Apple 完成的交易退款。'
      },
      {
        title: '5. 買斷（Lifetime）',
        body: '買斷版（¥2,980）為一次性購買。購買完成後原則上不予退款。'
      },
      {
        title: '6. 例外與問題處理',
        body: '如遇到重複扣款、支付錯誤等異常情況，請聯絡 toshiki.tech.jp@gmail.com。我們將根據具體情況進行核實並個別處理。'
      },
      {
        title: '7. 聯絡我們',
        body: '如您對本退款政策有任何疑問，請透過電子郵件與我們聯絡：toshiki.tech.jp@gmail.com'
      }
    ]
  },
  ja: {
    title: 'YomiPlay 返金ポリシー',
    lastUpdated: '最終更新日：2026年6月',
    sections: [
      {
        title: '1. 基本方針',
        body: 'YomiPlay は日本語学習アプリです。デジタルコンテンツという性質上、ご購入・ご契約の完了後は、原則として返金は行っておりません。'
      },
      {
        title: '2. 自動更新について',
        body: '月額（¥180）・年額（¥1,480）の Premium プランは、現在の期間が終了する 24 時間以上前に解約されない限り、自動的に更新されます。解約することで、次回更新分の課金を停止できます。'
      },
      {
        title: '3. 解約方法',
        body: 'Web 経由（Stripe / クレジットカード）でご契約の場合は、アプリ内の会員管理ページまたは設定から解約してください。iOS 経由でご契約の場合は、App Store のサブスクリプション管理から解約してください。解約された場合でも、現在の課金期間が終了するまでは Premium 機能をご利用いただけます。'
      },
      {
        title: '4. App Store 経由でのご購入',
        body: 'App Store を通じてご購入いただいた分の返金は、Apple の返金ポリシーに従います。返金をご希望の場合は、Apple（reportaproblem.apple.com）へ直接お申し込みください。開発者側では、Apple が処理した決済の返金対応を行うことはできません。'
      },
      {
        title: '5. 買い切り（Lifetime）について',
        body: 'Lifetime プラン（¥2,980）は買い切り型の商品です。ご購入完了後は、原則として返金をお受けできません。'
      },
      {
        title: '6. 例外・トラブルについて',
        body: '二重請求や決済エラーなどの不具合が発生した場合は、toshiki.tech.jp@gmail.com までご連絡ください。状況に応じて内容を確認し、個別に対応いたします。'
      },
      {
        title: '7. お問い合わせ',
        body: '本返金ポリシーに関するご質問は、メールにてお問い合わせください：toshiki.tech.jp@gmail.com'
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

export default function YomiPlayRefundPage({ params: { lang } }: { params: { lang: Locale } }) {
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
          </div>
        ))}
      </div>
    </div>
  );
}
