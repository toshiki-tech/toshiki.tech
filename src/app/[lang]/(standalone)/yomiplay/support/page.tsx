import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'Support & Help',
    subtitle: 'How can we help you today?',
    lastUpdated: 'Last Updated: March 31, 2026',
    sections: [
      {
        title: 'Contact Support',
        body: 'If you have any questions, encounter technical issues, or would like to provide feedback, please contact us via email. We typically respond within 24-48 business hours.',
        email: 'toshiki.tech.jp@gmail.com'
      },
      {
        title: 'Common Issues',
        items: [
          {
            q: 'Transcription is slow',
            a: 'On-device transcription depends on your device performance. Try closing other apps or using a shorter audio clip.'
          },
          {
            q: 'Language support',
            a: 'YomiPlay supports any language with a Whisper model. For translation, ensure your device has the required language packs downloaded.'
          }
        ]
      },
      {
        title: 'App Store Guidelines',
        body: 'In compliance with App Store Review Guideline 1.5, we provide this dedicated support channel to ensure users can reach us easily for any inquiries.'
      }
    ],
    linksTitle: 'Legal Links',
    links: [
      { label: 'Privacy Policy', url: 'https://toshiki.tech/en/yomiplay/privacy' },
      { label: 'Terms of Use', url: 'https://toshiki.tech/en/yomiplay/terms' }
    ]
  },
  zh: {
    title: '支持与帮助',
    subtitle: '我们能为您提供什么帮助？',
    lastUpdated: '最后更新于：2026年3月31日',
    sections: [
      {
        title: '联系支持',
        body: '如果您有任何疑问、遇到技术问题或希望提供反馈，请通过电子邮件与我们联系。我们通常在 24-48 个工作小时内回复。',
        email: 'toshiki.tech.jp@gmail.com'
      },
      {
        title: '常见问题',
        items: [
          {
            q: '转写速度较慢',
            a: '设备端转写取决于您的设备性能。请尝试关闭其他应用或使用较短的音视频片段。'
          },
          {
            q: '语言支持',
            a: 'YomiPlay 支持所有 Whisper 模型涵盖的语言。如需翻译功能，请确保您的设备已下载所需的系统语言包。'
          }
        ]
      },
      {
        title: '合规说明',
        body: '根据 App Store 审核指南 1.5，我们提供此专用支持渠道，以确保用户可以轻松就任何询问与我们取得联系。'
      }
    ],
    linksTitle: '法律链接',
    links: [
      { label: '隐私政策', url: 'https://toshiki.tech/zh/yomiplay/privacy' },
      { label: '使用条款', url: 'https://toshiki.tech/zh/yomiplay/terms' }
    ]
  },
  'zh-tw': {
    title: '支援與幫助',
    subtitle: '我們能為您提供什麼幫助？',
    lastUpdated: '最後更新於：2026年3月31日',
    sections: [
      {
        title: '聯絡支援',
        body: '如果您有任何疑問、遇到技術問題或希望提供回饋，請透過電子郵件與我們聯絡。我們通常在 24-48 個工作小時內回覆。',
        email: 'toshiki.tech.jp@gmail.com'
      },
      {
        title: '常見問題',
        items: [
          {
            q: '轉寫速度較慢',
            a: '裝置端轉寫取決於您的裝置效能。請嘗試關閉其他應用程式或使用較短的音訊片段。'
          },
          {
            q: '語言支援',
            a: 'YomiPlay 支援所有 Whisper 模型涵蓋的語言。如需翻譯功能，請確保您的裝置已下載所需的系統語言套件。'
          }
        ]
      },
      {
        title: '合規說明',
        body: '根據 App Store 審核指南 1.5，我們提供此專用支援管道，以確保用戶可以輕鬆就任何詢問與我們取得聯繫。'
      }
    ],
    linksTitle: '法律連結',
    links: [
      { label: '隱私政策', url: 'https://toshiki.tech/zh-tw/yomiplay/privacy' },
      { label: '使用條款', url: 'https://toshiki.tech/zh-tw/yomiplay/terms' }
    ]
  },
  ja: {
    title: 'サポートとヘルプ',
    subtitle: 'どのようなお手伝いが必要ですか？',
    lastUpdated: '最終更新日：2026年3月31日',
    sections: [
      {
        title: 'サポートへのお問い合わせ',
        body: 'ご質問、技術的な問題、またはフィードバックがある場合は、メールでお問い合わせください。通常 24〜48 営業時間以内に返信いたします。',
        email: 'toshiki.tech.jp@gmail.com'
      },
      {
        title: 'よくある質問',
        items: [
          {
            q: '文字起こしが遅い',
            a: 'デバイス上での文字起こしは端末の性能に依存します。他のアプリを閉じるか、より短いクリップでお試しください。'
          },
          {
            q: '対応言語について',
            a: 'YomiPlay は Whisper モデルがサポートする全言語に対応しています。翻訳機能には、システム言語パックのダウンロードが必要な場合があります。'
          }
        ]
      },
      {
        title: 'コンプライアンスについて',
        body: 'App Store レビューガイドライン 1.5 に基づき、ユーザーが容易に連絡を取れるよう、この専用サポートページを提供しています。'
      }
    ],
    linksTitle: '法的リンク',
    links: [
      { label: 'プライバシーポリシー', url: 'https://toshiki.tech/ja/yomiplay/privacy' },
      { label: '利用規約', url: 'https://toshiki.tech/ja/yomiplay/terms' }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | Toshiki Tech`,
  };
}

export default function YomiPlaySupportPage({ params: { lang } }: { params: { lang: Locale } }) {
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
      
      <div className="space-y-12">
        {t.sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-[rgb(var(--accent))] pl-3 text-[var(--foreground-rgb)]">
              {section.title}
            </h2>
            {section.body && <p className="text-[var(--muted-foreground)] text-base">{section.body}</p>}
            {section.email && (
              <div className="bg-[rgba(var(--accent),0.05)] p-6 rounded-2xl border border-[rgba(var(--accent),0.2)]">
                <a href={`mailto:${section.email}`} className="text-xl font-bold text-[rgb(var(--accent))] hover:underline">
                  {section.email}
                </a>
              </div>
            )}
            {section.items && (
              <div className="space-y-6">
                {section.items.map((item, idy) => (
                  <div key={idy} className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--foreground-rgb)]">Q: {item.q}</h3>
                    <p className="text-[var(--muted-foreground)]">A: {item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

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
