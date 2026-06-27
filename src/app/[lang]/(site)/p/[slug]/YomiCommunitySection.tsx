'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Upload, Users, ArrowRight } from 'lucide-react';
import { Locale } from '@/lib/get-dictionary';

export default function YomiCommunitySection({ lang }: { lang: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/yomiplay/feature-flags')
      .then((r) => r.json())
      .then((d) => {
        if (d?.community_enabled !== false) setVisible(true);
      })
      .catch(() => setVisible(true));
  }, []);

  if (!visible) return null;

  return (
    <section className="py-24 border-t border-[var(--border)]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
              {lang === 'en' ? 'Community' : lang === 'zh' ? '社区' : lang === 'zh-tw' ? '社區' : 'コミュニティ'}
            </h2>
            <h3 className="text-4xl font-black tracking-tight">
              {lang === 'en'
                ? 'Subtitle Sharing Platform'
                : lang === 'zh'
                  ? '字幕分享平台'
                  : lang === 'zh-tw'
                    ? '字幕分享平台'
                    : '字幕共有プラットフォーム'}
            </h3>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {lang === 'en'
                ? 'Browse and download community-shared .yomi subtitle files, or upload your own polished subtitles to help other learners.'
                : lang === 'zh'
                  ? '浏览和下载社区分享的 .yomi 字幕文件，或上传你精修的字幕帮助其他学习者。'
                  : lang === 'zh-tw'
                    ? '瀏覽和下載社區分享的 .yomi 字幕檔案，或上傳你精修的字幕幫助其他學習者。'
                    : 'コミュニティが共有する .yomi 字幕ファイルをダウンロード、またはあなたの字幕をアップロードして他の学習者をサポートしましょう。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`/${lang}/yomiplay/community`}
              className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                <Download size={24} />
              </div>
              <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                {lang === 'en' ? 'Download Subtitles' : lang === 'zh' ? '下载字幕' : lang === 'zh-tw' ? '下載字幕' : '字幕をダウンロード'}
              </h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                {lang === 'en'
                  ? 'Find high-quality .yomi files for podcasts, news, and more.'
                  : lang === 'zh'
                    ? '获取播客、新闻等内容的高质量 .yomi 字幕文件。'
                    : lang === 'zh-tw'
                      ? '取得播客、新聞等內容的高品質 .yomi 字幕檔案。'
                      : 'ポッドキャスト、ニュースなどの高品質な .yomi ファイルを取得。'}
              </p>
            </Link>
            <Link
              href={`/${lang}/yomiplay/community/upload`}
              className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                <Upload size={24} />
              </div>
              <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                {lang === 'en' ? 'Share Your Work' : lang === 'zh' ? '分享你的成果' : lang === 'zh-tw' ? '分享你的成果' : 'あなたの成果を共有'}
              </h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                {lang === 'en'
                  ? 'Upload polished subtitles to help learners with lower-spec devices.'
                  : lang === 'zh'
                    ? '上传精修字幕，帮助设备性能较低的学习者。'
                    : lang === 'zh-tw'
                      ? '上傳精修字幕，幫助裝置效能較低的學習者。'
                      : '精修した字幕をアップロードし、低スペックデバイスの学習者を支援。'}
              </p>
            </Link>
            <Link
              href={`/${lang}/yomiplay/community`}
              className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                <Users size={24} />
              </div>
              <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                {lang === 'en' ? 'Community Driven' : lang === 'zh' ? '社区驱动' : lang === 'zh-tw' ? '社區驅動' : 'コミュニティ主導'}
              </h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                {lang === 'en'
                  ? 'Built by learners, for learners. Quality subtitles from real users.'
                  : lang === 'zh'
                    ? '学习者为学习者打造，来自真实用户的高质量字幕。'
                    : lang === 'zh-tw'
                      ? '學習者為學習者打造，來自真實用戶的高品質字幕。'
                      : '学習者が学習者のために。実際のユーザーによる高品質字幕。'}
              </p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href={`/${lang}/yomiplay/community`}
              className="btn-primary inline-flex gap-2 items-center px-8 py-3 rounded-xl font-bold"
            >
              {lang === 'en' ? 'Explore Community' : lang === 'zh' ? '进入社区' : lang === 'zh-tw' ? '進入社區' : 'コミュニティを見る'}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
