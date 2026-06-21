import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'Roadmap',
    subtitle: 'YomiPlay keeps evolving—here is what we are building so your Japanese listening and shadowing practice gets better every day.',
    note: 'Timelines and priorities may shift as we incorporate feedback from learners like you.',
    phases: [
      {
        label: 'Now',
        caption: 'In progress',
        items: [
          'Text-to-Speech (TTS) reading',
          'Android version'
        ]
      },
      {
        label: 'Next',
        caption: 'Coming up',
        items: [
          'Word collection',
          'More translation languages'
        ]
      },
      {
        label: 'Future',
        caption: 'On the horizon',
        items: [
          'Web version',
          'Sync across devices',
          'Cloud backup',
          'Team learning'
        ]
      }
    ]
  },
  zh: {
    title: '开发路线图',
    subtitle: 'YomiPlay 持续进化——以下是我们正在打造的功能，让你的日语精听与跟读练习每天都更进一步。',
    note: '我们会根据用户反馈不断调整，排期与优先级可能会有变动。',
    phases: [
      {
        label: 'Now',
        caption: '进行中',
        items: [
          '文本朗读（TTS）',
          'Android 版本'
        ]
      },
      {
        label: 'Next',
        caption: '即将推出',
        items: [
          '单词收藏',
          '更多翻译语言'
        ]
      },
      {
        label: 'Future',
        caption: '远期规划',
        items: [
          'Web 版本',
          '同步功能',
          '云端备份',
          '团队学习'
        ]
      }
    ]
  },
  'zh-tw': {
    title: '開發路線圖',
    subtitle: 'YomiPlay 持續進化——以下是我們正在打造的功能，讓你的日語精聽與跟讀練習每天都更進一步。',
    note: '我們會根據使用者回饋不斷調整，排期與優先順序可能會有變動。',
    phases: [
      {
        label: 'Now',
        caption: '進行中',
        items: [
          '文字朗讀（TTS）',
          'Android 版本'
        ]
      },
      {
        label: 'Next',
        caption: '即將推出',
        items: [
          '單字收藏',
          '更多翻譯語言'
        ]
      },
      {
        label: 'Future',
        caption: '遠期規劃',
        items: [
          'Web 版本',
          '同步功能',
          '雲端備份',
          '團隊學習'
        ]
      }
    ]
  },
  ja: {
    title: 'ロードマップ',
    subtitle: 'YomiPlay は進化を続けています。日本語の精聴・シャドーイング学習を毎日もっと快適にするために、いま取り組んでいることをご紹介します。',
    note: 'ユーザーの声を反映しながら開発を進めるため、時期や優先順位は変更される場合があります。',
    phases: [
      {
        label: 'Now',
        caption: '進行中',
        items: [
          'テキスト朗読（TTS）',
          'Android 版'
        ]
      },
      {
        label: 'Next',
        caption: '次に',
        items: [
          '単語コレクション',
          '対応翻訳言語の拡充'
        ]
      },
      {
        label: 'Future',
        caption: '将来',
        items: [
          'Web 版',
          '同期',
          'クラウドバックアップ',
          'チーム学習'
        ]
      }
    ]
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | YomiPlay`,
  };
}

export default function YomiPlayRoadmapPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-base text-[var(--muted-foreground)] mb-10 leading-relaxed">
        {t.subtitle}
      </p>

      <div className="space-y-6">
        {t.phases.map((phase, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-sm font-semibold text-[rgb(var(--accent))]">
                {phase.label}
              </span>
              <span className="text-sm text-[var(--muted-foreground)]">
                {phase.caption}
              </span>
            </div>
            <ul className="space-y-3">
              {phase.items.map((item, idy) => (
                <li key={idy} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[rgb(var(--accent))]" />
                  <span className="text-[var(--foreground-rgb)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-[var(--muted-foreground)] leading-relaxed">
        {t.note}
      </p>
    </div>
  );
}
