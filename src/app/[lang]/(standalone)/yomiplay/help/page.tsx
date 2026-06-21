import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'YomiPlay Help & FAQ',
    intro: 'Frequently asked questions about using YomiPlay for Japanese listening and shadowing practice.',
    faqs: [
      {
        q: 'How do I import audio?',
        a: 'Tap the import button on the home screen and choose an audio file from your local files or media library. YomiPlay processes the audio on-device and automatically generates synchronized subtitles, so you can start listening sentence by sentence right away.'
      },
      {
        q: 'How do I import video?',
        a: 'Select a video file when importing. YomiPlay extracts the audio track from the video, transcribes it on-device, and generates sentence-level subtitles you can scrub through, just like with audio files.'
      },
      {
        q: 'How do I use Text-to-Speech (TTS)?',
        a: 'Select any text or sentence in your transcript and tap the read-aloud (speaker) button to hear it spoken. You can adjust the playback speed in settings to slow down speech for shadowing or speed it up for review.'
      },
      {
        q: 'How do I show furigana?',
        a: 'Open Settings and enable the furigana (kana reading) display. You can also turn on rōmaji to show romanized readings above the text. Both can be toggled independently to match your study level.'
      },
      {
        q: 'How do I cancel my membership?',
        a: 'For Web subscriptions (Stripe), open the membership management page or your account settings and cancel there. For iOS subscriptions, manage and cancel through the App Store subscription settings on your device. Please cancel at least 24 hours before the end of the current billing period to avoid being charged for the next term.'
      },
      {
        q: 'How do I restore purchases after switching phones?',
        a: 'On iOS, sign in with the same Apple ID you used to purchase, then tap "Restore Purchases" in settings to recover your subscription. For Web subscriptions, simply log in with the same account and your access will carry over.'
      },
      {
        q: 'Which languages are supported?',
        a: 'The app interface is available in Japanese, English, Simplified Chinese, and Traditional Chinese. The target study language is Japanese—YomiPlay is built specifically for learning Japanese through listening and shadowing.'
      },
      {
        q: 'Does it work offline?',
        a: 'Subtitle transcription runs primarily on-device, so core study features work offline once your content is imported. A network connection is only needed for fetching metadata, podcast feeds, and downloading translation language packs.'
      },
      {
        q: 'How do I contact support?',
        a: 'If you have any questions or run into issues, please email us at toshiki.tech.jp@gmail.com. We are happy to help.'
      }
    ]
  },
  zh: {
    title: 'YomiPlay 帮助与常见问题',
    intro: '关于使用 YomiPlay 进行日语精听与跟读练习的常见问题。',
    faqs: [
      {
        q: '如何导入音频？',
        a: '在主界面点击导入按钮，从本地文件或媒体库中选择音频文件即可。YomiPlay 会在设备端处理音频并自动生成同步字幕，让你立即开始逐句精听。'
      },
      {
        q: '如何导入视频？',
        a: '导入时选择视频文件，YomiPlay 会从视频中提取音轨，在设备端转写并生成逐句字幕，使用体验与导入音频一致，可自由拖动定位。'
      },
      {
        q: '如何使用文本朗读（TTS）？',
        a: '在字幕中选中任意文本或句子，点击朗读（喇叭）按钮即可听到朗读。你可以在设置中调节语速，放慢以便跟读，或加快用于复习。'
      },
      {
        q: '如何显示假名（furigana）？',
        a: '进入设置，开启假名（注音）显示即可在汉字上方标注读音。你也可以开启罗马字显示。两者可独立切换，以适配你的学习水平。'
      },
      {
        q: '如何取消会员？',
        a: 'Web 订阅（Stripe）：请在会员管理页或账户设置中取消。iOS 订阅：请在设备「App Store 订阅管理」中取消。请至少在当期计费周期结束前 24 小时取消，以免被扣下一期费用。'
      },
      {
        q: '更换手机后如何恢复购买？',
        a: 'iOS：使用购买时所用的同一 Apple ID 登录，然后在设置中点击「恢复购买（Restore Purchases）」即可恢复订阅。Web 订阅：使用同一账号登录，权益即可自动同步。'
      },
      {
        q: '支持哪些语言？',
        a: '应用界面支持日语、英语、简体中文和繁体中文。学习的目标语言为日语——YomiPlay 专为通过精听和跟读学习日语而打造。'
      },
      {
        q: '支持离线吗？',
        a: '字幕转写以设备端本地处理为主，因此内容导入后核心学习功能可离线使用。联网仅用于获取元数据、播客订阅源以及下载翻译语言包。'
      },
      {
        q: '如何联系支持？',
        a: '如有任何疑问或遇到问题，请发送邮件至 toshiki.tech.jp@gmail.com，我们很乐意为你提供帮助。'
      }
    ]
  },
  'zh-tw': {
    title: 'YomiPlay 說明與常見問題',
    intro: '關於使用 YomiPlay 進行日語精聽與跟讀練習的常見問題。',
    faqs: [
      {
        q: '如何匯入音訊？',
        a: '在主畫面點擊匯入按鈕，從本地檔案或媒體庫中選擇音訊檔案即可。YomiPlay 會在裝置端處理音訊並自動產生同步字幕，讓你立即開始逐句精聽。'
      },
      {
        q: '如何匯入影片？',
        a: '匯入時選擇影片檔案，YomiPlay 會從影片中擷取音軌，在裝置端轉寫並產生逐句字幕，使用體驗與匯入音訊一致，可自由拖曳定位。'
      },
      {
        q: '如何使用文字朗讀（TTS）？',
        a: '在字幕中選取任意文字或句子，點擊朗讀（喇叭）按鈕即可聽到朗讀。你可以在設定中調整語速，放慢以便跟讀，或加快用於複習。'
      },
      {
        q: '如何顯示假名（furigana）？',
        a: '進入設定，開啟假名（注音）顯示即可在漢字上方標註讀音。你也可以開啟羅馬字顯示。兩者可獨立切換，以符合你的學習程度。'
      },
      {
        q: '如何取消會員？',
        a: 'Web 訂閱（Stripe）：請在會員管理頁或帳戶設定中取消。iOS 訂閱：請在裝置「App Store 訂閱管理」中取消。請至少在當期計費週期結束前 24 小時取消，以免被扣下一期費用。'
      },
      {
        q: '更換手機後如何恢復購買？',
        a: 'iOS：使用購買時所用的同一 Apple ID 登入，然後在設定中點擊「恢復購買（Restore Purchases）」即可恢復訂閱。Web 訂閱：使用同一帳號登入，權益即可自動同步。'
      },
      {
        q: '支援哪些語言？',
        a: '應用程式介面支援日語、英語、簡體中文和繁體中文。學習的目標語言為日語——YomiPlay 專為透過精聽和跟讀學習日語而打造。'
      },
      {
        q: '支援離線嗎？',
        a: '字幕轉寫以裝置端本地處理為主，因此內容匯入後核心學習功能可離線使用。連網僅用於取得中繼資料、播客訂閱源以及下載翻譯語言套件。'
      },
      {
        q: '如何聯絡支援？',
        a: '如有任何疑問或遇到問題，請發送郵件至 toshiki.tech.jp@gmail.com，我們很樂意為你提供協助。'
      }
    ]
  },
  ja: {
    title: 'YomiPlay ヘルプ・よくある質問',
    intro: 'YomiPlay で日本語のリスニングやシャドーイングを行う際の、よくあるご質問をまとめました。',
    faqs: [
      {
        q: '音声を取り込むには？',
        a: 'ホーム画面の取り込みボタンをタップし、端末内のファイルやメディアライブラリから音声ファイルを選択してください。YomiPlay が端末上で音声を処理し、同期した字幕を自動生成しますので、すぐに一文ずつのリスニングを始められます。'
      },
      {
        q: '動画を取り込むには？',
        a: '取り込み時に動画ファイルを選択してください。YomiPlay が動画から音声トラックを抽出し、端末上で文字起こしを行って一文ごとの字幕を生成します。音声ファイルと同様に、シークしながら学習できます。'
      },
      {
        q: '読み上げ（TTS）の使い方は？',
        a: '字幕内の任意のテキストや一文を選択し、読み上げ（スピーカー）ボタンをタップすると音声で読み上げられます。設定で再生速度を調整でき、シャドーイング用にゆっくり、復習用に速く再生することも可能です。'
      },
      {
        q: 'ふりがなを表示するには？',
        a: '設定画面でふりがな（かな表示）をオンにすると、漢字の上に読み仮名が表示されます。ローマ字表示を有効にすることもできます。それぞれ個別に切り替えられるため、学習レベルに合わせて調整できます。'
      },
      {
        q: '会員（サブスクリプション）を解約するには？',
        a: 'Web のサブスクリプション（Stripe）は、会員管理ページまたはアカウント設定から解約してください。iOS のサブスクリプションは、端末の「App Store のサブスクリプション管理」から解約・管理できます。次回分の請求を避けるため、現在の請求期間が終了する少なくとも24時間前までに解約してください。'
      },
      {
        q: '機種変更後に購入を復元するには？',
        a: 'iOS では、購入時に使用したものと同じ Apple ID でサインインし、設定の「購入を復元（Restore Purchases）」をタップするとサブスクリプションを復元できます。Web のサブスクリプションは、同じアカウントでログインすればそのまま引き継がれます。'
      },
      {
        q: '対応している言語は？',
        a: 'アプリの表示言語は、日本語・英語・簡体字中国語・繁体字中国語に対応しています。学習対象の言語は日本語です。YomiPlay は、リスニングとシャドーイングを通じて日本語を学ぶために作られたアプリです。'
      },
      {
        q: 'オフラインで使えますか？',
        a: '字幕の文字起こしは主に端末上で処理されるため、コンテンツを取り込んだ後は、コアの学習機能をオフラインでご利用いただけます。ネットワーク接続は、メタデータの取得、ポッドキャストの配信、翻訳用言語パックのダウンロードにのみ必要です。'
      },
      {
        q: 'サポートへの問い合わせ方法は？',
        a: 'ご不明な点やお困りのことがございましたら、toshiki.tech.jp@gmail.com までメールでお問い合わせください。喜んでサポートいたします。'
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

export default function YomiPlayHelpPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 prose prose-sm dark:prose-invert max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">
        {t.intro}
      </p>

      <div className="space-y-10 text-[var(--muted-foreground)] leading-relaxed">
        {t.faqs.map((faq, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--foreground-rgb)]">
              {faq.q}
            </h2>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
