export const SOURCE_PLATFORMS = [
  { id: 'apple_podcasts', name: 'Apple Podcasts', domain: 'podcasts.apple.com' },
  { id: 'youtube', name: 'YouTube', domain: 'youtube.com' },
  { id: 'spotify', name: 'Spotify', domain: 'open.spotify.com' },
  { id: 'nhk', name: 'NHK', domain: 'nhk.or.jp' },
  { id: 'ted', name: 'TED', domain: 'ted.com' },
  { id: 'bbc', name: 'BBC', domain: 'bbc.co.uk' },
  { id: 'audible', name: 'Audible', domain: 'audible.co.jp' },
  { id: 'other', name: 'Other', domain: null },
] as const;

export const CONTENT_CATEGORIES = [
  { id: 'podcast', labels: { en: 'Podcast', zh: '播客', 'zh-tw': '播客', ja: 'ポッドキャスト' } },
  { id: 'news_video', labels: { en: 'News / Video', zh: '新闻·视频', 'zh-tw': '新聞·影片', ja: 'ニュース・動画' } },
  { id: 'music', labels: { en: 'Music & Lyrics', zh: '音乐歌词', 'zh-tw': '音樂歌詞', ja: '音楽・歌詞' } },
  { id: 'book_companion', labels: { en: 'Book Companion', zh: '书籍配套', 'zh-tw': '書籍配套', ja: '書籍付属' } },
  { id: 'other', labels: { en: 'Other', zh: '其他', 'zh-tw': '其他', ja: 'その他' } },
] as const;

export const CONTENT_SORT_OPTIONS = [
  { id: 'newest', labels: { en: 'Newest', zh: '最新', 'zh-tw': '最新', ja: '新着順' } },
  { id: 'downloads', labels: { en: 'Most downloaded', zh: '下载最多', 'zh-tw': '下載最多', ja: 'ダウンロード順' } },
  { id: 'updated', labels: { en: 'Recently updated', zh: '最近更新', 'zh-tw': '最近更新', ja: '更新順' } },
] as const;

export type ContentCategoryId = typeof CONTENT_CATEGORIES[number]['id'];
export type ContentSortId = typeof CONTENT_SORT_OPTIONS[number]['id'];

export const CONTENT_LANGUAGES = [
  { id: 'ja', label: '日本語' },
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
  { id: 'ko', label: '한국어' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'es', label: 'Español' },
  { id: 'other', label: 'Other' },
] as const;

export const ALLOWED_MEDIA_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.mp4'] as const;

export const MAX_YOMI_FILE_SIZE = 10_485_760; // 10MB
export const MAX_AUDIO_FILE_SIZE = 157_286_400; // 150MB
export const MAX_ZIP_FILE_SIZE = 524_288_000; // 500MB

// Feature flag: controls visibility of the points feature overall — the
// community "How to earn points" rules card, the header points badge, the
// my-uploads PointsPanel, and the daily-login bonus. Set to false to remove
// the entire points UI; turn off ALLOW_PRO_REDEMPTION instead if you only
// want to close the Pro redemption channel while keeping points accumulation.
// Also exposed to the iOS app via /api/yomiplay/feature-flags.
export const SHOW_POINTS_FEATURE = true;

// Feature flag: controls whether users can redeem accumulated points for Pro
// membership. When false, the "Apply for Pro" form, the "Earn points, unlock
// Pro" CTA banner, and the launch-promotion notice are hidden, and the
// /api/yomi/pro/apply endpoint rejects new applications. Points are still
// earned/displayed (subject to SHOW_POINTS_FEATURE).
// Also exposed to the iOS app via /api/yomiplay/feature-flags.
export const ALLOW_PRO_REDEMPTION = true;

// Feature flag exposed via /api/yomiplay/feature-flags. Controls whether the
// YomiPlay iOS app surfaces the "download from community" entry point.
export const SHOW_COMMUNITY_DOWNLOAD = true;

export type SourcePlatformId = typeof SOURCE_PLATFORMS[number]['id'];
export type ContentLanguageId = typeof CONTENT_LANGUAGES[number]['id'];
