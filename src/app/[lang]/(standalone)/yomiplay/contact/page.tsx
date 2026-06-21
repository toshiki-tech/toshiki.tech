import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const SUPPORT_EMAIL = 'toshiki.tech.jp@gmail.com';

const content = {
  en: {
    title: 'Contact',
    subtitle: 'Questions, bug reports, and feature requests for YomiPlay—an intensive listening and shadowing app for Japanese learners. Operated by DU BIAOQI, an independent developer based in Japan.',
    sections: [
      {
        title: '1. Contact Channel',
        body: `Our primary contact is ${SUPPORT_EMAIL}. This is the only official way to reach us—we do not provide support through other channels, so please direct all inquiries here.`
      },
      {
        title: '2. Response Time',
        body: 'We usually reply within 2–3 business days. Responses may be delayed during weekends and public holidays. Thank you for your patience.'
      },
      {
        title: '3. Bug Reports',
        body: 'When reporting a bug, please include your device model, OS version, app version, and the steps to reproduce the issue. This information helps us identify and fix the problem more quickly.'
      },
      {
        title: '4. Feature Requests',
        body: 'We welcome your ideas. If there is a feature you would like to see in YomiPlay, please let us know—your feedback directly shapes how the app evolves.'
      },
      {
        title: '5. Business & Partnerships',
        body: 'For business collaborations, partnership proposals, or media inquiries, please contact us at the same email address.'
      }
    ]
  },
  zh: {
    title: '联系我们',
    subtitle: 'YomiPlay 是一款面向日语学习者的精听与跟读学习 App。如有疑问、问题反馈或功能建议，欢迎联系我们。运营者为日本独立开发者 DU BIAOQI。',
    sections: [
      {
        title: '1. 联系方式',
        body: `我们的主要联系方式为 ${SUPPORT_EMAIL}。这是我们唯一的官方联系渠道，我们不通过其他途径提供支持，请将所有咨询发送至此邮箱。`
      },
      {
        title: '2. 回复时间',
        body: '我们通常会在 2〜3 个工作日内回复。周末及节假日期间回复可能延迟，敬请谅解。'
      },
      {
        title: '3. 故障与 Bug 反馈',
        body: '反馈问题时，请附上您的设备型号、系统版本、App 版本以及复现步骤。这些信息有助于我们更快地定位并修复问题。'
      },
      {
        title: '4. 功能建议',
        body: '我们欢迎您的想法。如果您希望 YomiPlay 增加某项功能，请告诉我们—您的反馈将直接影响应用的发展方向。'
      },
      {
        title: '5. 商务与合作',
        body: '如有商务合作、合作提案或媒体咨询，请通过同一邮箱与我们联系。'
      }
    ]
  },
  'zh-tw': {
    title: '聯絡我們',
    subtitle: 'YomiPlay 是一款面向日語學習者的精聽與跟讀學習 App。如有疑問、問題回報或功能建議，歡迎聯絡我們。營運者為日本獨立開發者 DU BIAOQI。',
    sections: [
      {
        title: '1. 聯絡方式',
        body: `我們的主要聯絡方式為 ${SUPPORT_EMAIL}。這是我們唯一的官方聯絡管道，我們不透過其他途徑提供支援，請將所有諮詢寄送至此信箱。`
      },
      {
        title: '2. 回覆時間',
        body: '我們通常會在 2〜3 個工作日內回覆。週末及國定假日期間回覆可能延遲，敬請見諒。'
      },
      {
        title: '3. 故障與 Bug 回報',
        body: '回報問題時，請附上您的裝置型號、系統版本、App 版本以及重現步驟。這些資訊有助於我們更快地定位並修復問題。'
      },
      {
        title: '4. 功能建議',
        body: '我們歡迎您的想法。如果您希望 YomiPlay 增加某項功能，請告訴我們—您的回饋將直接影響應用程式的發展方向。'
      },
      {
        title: '5. 商務與合作',
        body: '如有商務合作、合作提案或媒體諮詢，請透過同一信箱與我們聯絡。'
      }
    ]
  },
  ja: {
    title: 'お問い合わせ',
    subtitle: 'YomiPlay は、日本語学習者向けの精聴・シャドーイング学習アプリです。ご質問、不具合のご報告、機能のご要望などをお気軽にお寄せください。運営者は日本在住の個人開発者 DU BIAOQI です。',
    sections: [
      {
        title: '1. お問い合わせ窓口',
        body: `お問い合わせは ${SUPPORT_EMAIL} までお願いいたします。こちらが唯一の公式連絡先となります。他の窓口ではサポートを行っておりませんので、すべてのお問い合わせはこちらのメールアドレスまでお寄せください。`
      },
      {
        title: '2. 返信時間',
        body: '通常、2〜3営業日以内に返信いたします。土日祝日などは返信が遅れる場合がございます。あらかじめご了承ください。'
      },
      {
        title: '3. 不具合・バグ報告',
        body: '不具合をご報告いただく際は、ご利用の端末の機種、OSバージョン、アプリのバージョン、および再現手順を併せてお知らせください。これらの情報により、問題の特定と修正を迅速に行うことができます。'
      },
      {
        title: '4. 機能リクエスト',
        body: '機能に関するご要望を歓迎しております。YomiPlay に追加してほしい機能がございましたら、ぜひお聞かせください。皆さまのご意見が、アプリの今後の改善に直接つながります。'
      },
      {
        title: '5. ビジネス・提携',
        body: 'ビジネスでの協業、提携のご提案、メディア関連のお問い合わせにつきましても、同じメールアドレスまでご連絡ください。'
      }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | YomiPlay | Toshiki Tech`,
  };
}

export default function YomiPlayContactPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-base text-[var(--muted-foreground)] mb-8 leading-relaxed">
        {t.subtitle}
      </p>

      <div className="not-prose mb-10 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-lg font-semibold text-[var(--primary)] underline underline-offset-4 hover:opacity-80 break-all"
        >
          {SUPPORT_EMAIL}
        </a>
      </div>

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
