import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'Changelog',
    subtitle: 'New features and improvements added to YomiPlay, your Japanese intensive-listening and shadowing companion.',
    entries: [
      {
        version: 'v1.6',
        items: [
          'Added Text-to-Speech (TTS): listen to any text or subtitle line read aloud.',
          'Adjustable playback speed for synthesized speech to match your level.'
        ]
      },
      {
        version: 'v1.5',
        items: [
          'Optimized the accuracy and speed of subtitle generation.',
          'Improved timestamp alignment for tighter audio-subtitle synchronization.'
        ]
      },
      {
        version: 'v1.4',
        items: [
          'Added an Anki export feature to turn study items into flashcards.',
          'Exports include sentence audio and subtitle context for richer review.'
        ]
      },
      {
        version: 'v1.3',
        items: [
          'Added a Shadowing mode for repeat-after practice.',
          'Record your voice and compare it against the original audio.'
        ]
      }
    ],
    outlook: 'We will continue to add new features going forward. Thank you for using YomiPlay.'
  },
  zh: {
    title: '更新记录',
    subtitle: 'YomiPlay 日语精听与跟读学习 App 的新功能与改进记录。',
    entries: [
      {
        version: 'v1.6',
        items: [
          '新增文本朗读（TTS）功能：可将任意文本或字幕句子朗读出来。',
          '合成语音支持调节播放速度，匹配你的学习水平。'
        ]
      },
      {
        version: 'v1.5',
        items: [
          '优化了字幕生成的精度与速度。',
          '改进了时间轴对齐，使音频与字幕同步更紧密。'
        ]
      },
      {
        version: 'v1.4',
        items: [
          '新增 Anki 导出功能，可将学习内容生成记忆卡片。',
          '导出内容包含句子音频与字幕上下文，复习更丰富。'
        ]
      },
      {
        version: 'v1.3',
        items: [
          '新增跟读（Shadowing）模式，可进行复读练习。',
          '支持录制你的声音并与原声进行对比。'
        ]
      }
    ],
    outlook: '今后我们也会持续添加新功能，感谢你使用 YomiPlay。'
  },
  'zh-tw': {
    title: '更新記錄',
    subtitle: 'YomiPlay 日語精聽與跟讀學習 App 的新功能與改進記錄。',
    entries: [
      {
        version: 'v1.6',
        items: [
          '新增文字朗讀（TTS）功能：可將任意文字或字幕句子朗讀出來。',
          '合成語音支援調節播放速度，符合你的學習程度。'
        ]
      },
      {
        version: 'v1.5',
        items: [
          '最佳化了字幕生成的精度與速度。',
          '改進了時間軸對齊，使音訊與字幕同步更緊密。'
        ]
      },
      {
        version: 'v1.4',
        items: [
          '新增 Anki 匯出功能，可將學習內容生成記憶卡片。',
          '匯出內容包含句子音訊與字幕上下文，複習更豐富。'
        ]
      },
      {
        version: 'v1.3',
        items: [
          '新增跟讀（Shadowing）模式，可進行複讀練習。',
          '支援錄製你的聲音並與原聲進行對比。'
        ]
      }
    ],
    outlook: '今後我們也會持續新增新功能，感謝你使用 YomiPlay。'
  },
  ja: {
    title: '更新履歴',
    subtitle: '日本語の精聴・シャドーイング学習アプリ YomiPlay に追加された新機能と改善の記録です。',
    entries: [
      {
        version: 'v1.6',
        items: [
          'テキスト朗読（TTS）機能を追加しました。任意のテキストや字幕を読み上げられます。',
          '合成音声の再生速度を調整でき、学習レベルに合わせられます。'
        ]
      },
      {
        version: 'v1.5',
        items: [
          '字幕生成の精度・速度を最適化しました。',
          'タイムスタンプの精度を改善し、音声と字幕の同期をより正確にしました。'
        ]
      },
      {
        version: 'v1.4',
        items: [
          'Anki エクスポート機能を追加しました。学習項目を単語カードとして書き出せます。',
          'エクスポートには文章の音声と字幕の文脈が含まれ、より充実した復習が可能です。'
        ]
      },
      {
        version: 'v1.3',
        items: [
          'シャドーイング（跟読）機能を追加しました。',
          '自分の声を録音し、オリジナル音声と聞き比べられます。'
        ]
      }
    ],
    outlook: '今後も継続的に新機能を追加していきます。YomiPlay をご利用いただきありがとうございます。'
  }
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | YomiPlay`,
  };
}

export default function YomiPlayChangelogPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">
        {t.title}
      </h1>
      <p className="text-[var(--muted-foreground)] mb-12">
        {t.subtitle}
      </p>

      <div className="relative">
        {t.entries.map((entry, idx) => {
          const isLast = idx === t.entries.length - 1;
          return (
            <div key={entry.version} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Timeline column: dot + vertical line */}
              <div className="relative flex flex-col items-center">
                <span className="z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-[rgb(var(--accent))] ring-4 ring-[var(--background)]" />
                {!isLast && (
                  <span className="absolute top-4 bottom-[-3rem] w-px bg-[var(--border)]" />
                )}
              </div>

              {/* Entry content */}
              <div className="flex-1">
                <h2 className="text-lg font-bold leading-none mb-4">
                  {entry.version}
                </h2>
                <ul className="space-y-2 text-[var(--muted-foreground)] leading-relaxed">
                  {entry.items.map((item, idy) => (
                    <li key={idy} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--border)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        {t.outlook}
      </p>
    </div>
  );
}
