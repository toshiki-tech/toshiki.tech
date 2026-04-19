import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Star } from 'lucide-react';

interface PolicySection {
  title: string;
  body: string;
}

interface PolicyContent {
  back: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: PolicySection[];
  contactTitle: string;
  contactBody: string;
  viewTerms: string;
}

const content: Record<Locale, PolicyContent> = {
  en: {
    back: 'Back to Community',
    title: 'Community Points Policy',
    intro: 'The YomiPlay community rewards contributions with points that can be redeemed for Pro membership. To keep the system flexible while staying fair to contributors, the following commitments define how the rules can change over time.',
    lastUpdated: 'Last updated: April 20, 2026',
    sections: [
      {
        title: '1. Earned points are never retroactively revoked',
        body: 'Any points already credited to your account remain yours. Rule changes only affect future actions — we will never roll back the value of points you already earned through uploads, downloads, or daily logins.',
      },
      {
        title: '2. Threshold decreases take effect immediately; increases are announced in advance',
        body: 'If we lower the Pro redemption threshold (i.e., make it easier to apply), the change is applied right away because it benefits existing contributors. If we raise the threshold, we will publish the change at least 14 days in advance. During that notice period, applications may still be redeemed at the previous threshold.',
      },
      {
        title: '3. The platform determines final rules, but changes are published openly',
        body: 'Administrators have final say over points values, eligibility, and thresholds. That said, any substantive change to the published rules will appear on the community homepage together with the effective date, so the rule history is transparent.',
      },
      {
        title: '4. Appeals and disputes',
        body: 'If you believe a points credit is missing, a judgment about your content is unfair, or a rule is being applied inconsistently, contact the admin via the report/feedback channel. We aim to review every case individually and will explain the outcome when a request is declined.',
      },
      {
        title: '5. Relationship to App Store Pro subscription',
        body: 'Points-based Pro membership is an in-community reward for contributions and is separate from the Pro subscription sold on the App Store. The points program does not replace, substitute, or route around in-app purchases — it is an internal incentive granted at the platform\'s discretion. Users who prefer may subscribe via the App Store as usual.',
      },
    ],
    contactTitle: 'Questions or feedback?',
    contactBody: 'Use the report button on any content page, or contact the admin directly. We read everything and reply when the situation requires a response.',
    viewTerms: 'View full Terms of Use →',
  },
  zh: {
    back: '返回社区',
    title: '社区积分政策',
    intro: 'YomiPlay 社区通过积分奖励用户的贡献，积分可以兑换 Pro 会员。为了让规则在保留灵活性的同时对贡献者保持公平，我们在这里明确积分规则变更时的几项承诺。',
    lastUpdated: '最后更新：2026 年 4 月 20 日',
    sections: [
      {
        title: '1. 已获得的积分永不追溯清零',
        body: '已经计入你账户的积分永久保留属于你。规则变更只影响未来的积分行为——我们不会回收、下调或作废你过去通过上传、被下载、每日登录等方式获得的积分。',
      },
      {
        title: '2. 门槛下调立即生效，上调会提前公告',
        body: '如果我们降低兑换 Pro 的积分门槛（让兑换更容易），变更会立刻对所有用户生效，因为这对贡献者有利。如果我们上调门槛，会至少提前 14 天在社区首页公告，在公告期内仍可按旧门槛申请兑换。',
      },
      {
        title: '3. 平台最终决定规则，但变更会公开发布',
        body: '管理员对积分数值、获取条件和兑换门槛拥有最终决定权。但对已公布规则的任何实质性变更，都会在社区首页连同生效日期一同发布，保证规则历史对所有用户透明可查。',
      },
      {
        title: '4. 申诉与争议',
        body: '如果你认为自己应得的积分未到账、对你的内容的判定不公、或规则被执行得不一致，可以通过举报/反馈渠道联系管理员。我们会逐案复核，驳回申请时会说明原因。',
      },
      {
        title: '5. 与 App Store Pro 订阅的关系',
        body: '积分兑换的 Pro 会员属于社区内部的贡献奖励机制，与 App Store 上销售的 Pro 订阅是两条独立的路径。积分机制不是 App 内购买的替代或绕过方式——它是平台自主决定授予的内部激励。用户如更方便，仍可通过 App Store 正常订阅。',
      },
    ],
    contactTitle: '有问题或反馈？',
    contactBody: '在任意内容页点击"举报"按钮，或直接联系管理员。我们会阅读每一条反馈，并在有必要时回复。',
    viewTerms: '查看完整使用条款 →',
  },
  'zh-tw': {
    back: '返回社區',
    title: '社區積分政策',
    intro: 'YomiPlay 社區透過積分獎勵使用者的貢獻，積分可以兌換 Pro 會員。為了讓規則保留彈性同時對貢獻者保持公平，我們在此明確積分規則變更時的幾項承諾。',
    lastUpdated: '最後更新：2026 年 4 月 20 日',
    sections: [
      {
        title: '1. 已獲得的積分永不追溯清零',
        body: '已經計入你帳戶的積分永久保留屬於你。規則變更只影響未來的積分行為——我們不會回收、下調或作廢你過去透過上傳、被下載、每日登入等方式獲得的積分。',
      },
      {
        title: '2. 門檻下調立即生效，上調會提前公告',
        body: '如果我們降低兌換 Pro 的積分門檻（讓兌換更容易），變更會立即對所有使用者生效，因為這對貢獻者有利。如果我們上調門檻，會至少提前 14 天在社區首頁公告，在公告期內仍可按舊門檻申請兌換。',
      },
      {
        title: '3. 平台最終決定規則，但變更會公開發布',
        body: '管理員對積分數值、獲取條件和兌換門檻擁有最終決定權。但對已公布規則的任何實質性變更，都會在社區首頁連同生效日期一同發布，保證規則歷史對所有使用者透明可查。',
      },
      {
        title: '4. 申訴與爭議',
        body: '如果你認為自己應得的積分未到帳、對你的內容的判定不公，或規則被執行得不一致，可透過舉報/反饋管道聯繫管理員。我們會逐案複核，駁回申請時會說明原因。',
      },
      {
        title: '5. 與 App Store Pro 訂閱的關係',
        body: '積分兌換的 Pro 會員屬於社區內部的貢獻獎勵機制，與 App Store 上銷售的 Pro 訂閱是兩條獨立的路徑。積分機制不是 App 內購買的替代或繞過方式——它是平台自主決定授予的內部激勵。使用者如更方便，仍可透過 App Store 正常訂閱。',
      },
    ],
    contactTitle: '有問題或反饋？',
    contactBody: '在任意內容頁點擊「舉報」按鈕，或直接聯繫管理員。我們會閱讀每一條反饋，並在必要時回覆。',
    viewTerms: '查看完整使用條款 →',
  },
  ja: {
    back: 'コミュニティに戻る',
    title: 'コミュニティポイント規定',
    intro: 'YomiPlay コミュニティでは、ユーザーの貢献に応じてポイントを付与し、そのポイントで Pro メンバーシップと交換できます。ルールを柔軟に保ちつつ貢献者に公平であり続けるため、ポイント規定の変更に関して以下の方針を明確にします。',
    lastUpdated: '最終更新：2026 年 4 月 20 日',
    sections: [
      {
        title: '1. 獲得済みポイントを遡及的に取り消すことはありません',
        body: 'アカウントに既に付与されたポイントは永続的にあなたのものです。ルール変更は今後の行動にのみ適用され、過去のアップロード・ダウンロード・毎日ログインなどで獲得したポイントを回収・減額・無効化することはありません。',
      },
      {
        title: '2. 閾値の引き下げは即時適用、引き上げは事前告知',
        body: 'Pro 交換に必要なポイント閾値を下げる（より申請しやすくする）場合、貢献者に有利な変更であるため即時適用されます。閾値を上げる場合は、少なくとも 14 日前にコミュニティトップで告知します。告知期間中は旧閾値での申請交換も有効です。',
      },
      {
        title: '3. ルールの最終決定はプラットフォーム、変更は公開されます',
        body: '管理者はポイント額、獲得条件、交換閾値について最終的な決定権を持ちます。ただし公表済みルールへの実質的な変更はすべて、施行日と合わせてコミュニティトップに掲載され、ルール履歴は誰でも透明に確認できます。',
      },
      {
        title: '4. 異議申し立てと紛争',
        body: '付与されるはずのポイントが反映されない、コンテンツに対する判定が不当、ルール適用に一貫性がないと感じる場合は、通報／フィードバック窓口から管理者にご連絡ください。個別に再審査し、申請が却下された場合は理由をお伝えします。',
      },
      {
        title: '5. App Store の Pro サブスクリプションとの関係',
        body: 'ポイント交換による Pro メンバーシップは、コミュニティ内の貢献報酬であり、App Store で販売される Pro サブスクリプションとは独立した別の経路です。ポイント制度は App 内課金の代替や回避手段ではなく、プラットフォームの裁量で付与される内部的なインセンティブです。都合に応じて App Store から通常どおりご購入いただくこともできます。',
      },
    ],
    contactTitle: 'ご質問・フィードバック',
    contactBody: '任意のコンテンツページの「通報」ボタンから、または管理者に直接ご連絡ください。すべてのフィードバックを確認し、必要に応じて返信いたします。',
    viewTerms: '利用規約の全文を見る →',
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return { title: `${t.title} | Toshiki Tech` };
}

export default function PointsPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 max-w-3xl">
      <Link
        href={`/${lang}/yomiplay/community`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        {t.back}
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <ShieldCheck size={28} className="text-[rgb(var(--accent))]" />
        <h1 className="text-3xl font-bold">{t.title}</h1>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mb-6">{t.lastUpdated}</p>
      <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">{t.intro}</p>

      <div className="space-y-6 mb-10">
        {t.sections.map((section) => (
          <section key={section.title} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="font-bold text-base mb-2 flex items-start gap-2">
              <Star size={16} className="text-yellow-500 shrink-0 mt-1" />
              <span>{section.title}</span>
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed pl-6">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] mb-8">
        <h3 className="font-bold text-base mb-2">{t.contactTitle}</h3>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{t.contactBody}</p>
      </div>

      <Link
        href={`/${lang}/yomiplay/terms`}
        className="inline-block text-sm font-bold text-[rgb(var(--accent))] hover:underline"
      >
        {t.viewTerms}
      </Link>
    </div>
  );
}
