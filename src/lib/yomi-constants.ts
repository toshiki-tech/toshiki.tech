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

export type SourcePlatformId = typeof SOURCE_PLATFORMS[number]['id'];
export type ContentLanguageId = typeof CONTENT_LANGUAGES[number]['id'];
