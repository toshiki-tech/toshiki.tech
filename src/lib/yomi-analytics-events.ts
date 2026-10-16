// YomiPlay anonymous usage analytics — event whitelist.
// Spec: docs/yomiplay-analytics-api.md (§3). Adding an event = update this file AND the doc.
// Anything not listed here is dropped: unknown events entirely, unknown props / values per key.

type PropSpec =
  | { kind: 'enum'; values: readonly string[] }
  | { kind: 'int' }
  | { kind: 'bool' }
  | { kind: 'id' };   // opaque server-issued id (e.g. a push campaign), [A-Za-z0-9_-]{1,64}

const e = (...values: string[]): PropSpec => ({ kind: 'enum', values });
const INT: PropSpec = { kind: 'int' };
const BOOL: PropSpec = { kind: 'bool' };
const ID: PropSpec = { kind: 'id' };

const IMPORT_SOURCE = e('podcast_search', 'url', 'local_file', 'zip', 'photos', 'tts', 'community', 'share_sheet', 'yomi_replace');
const WHISPER_MODEL = e('tiny', 'base', 'small', 'medium', 'large');
const VOCAB_FROM = e('player', 'manual', 'ocr', 'quick_lookup', 'how_to_say', 'yomicard', 'promote');
const PAYWALL_TRIGGER = e('local_import', 'zip', 'photos', 'tts', 'share_sheet', 'community', 'recognition_quota', 'vocab_quota',
  'album_limit', 'video_export', 'ai_deck', 'book_import_full', 'settings',
  // app 2.3+: monthly free imports used up / a file to recognize over the free length limit
  'import_quota', 'import_too_long');

export const ANALYTICS_EVENTS: Record<string, Record<string, PropSpec>> = {
  // lifecycle
  // existing_user: data from an older version / a restore was already on the device (an upgrade, not a new user)
  app_first_launch: { existing_user: BOOL },
  app_open: {},
  sample_opened: {},
  // import & recognition
  // free_used: free imports already used this month (free users only, app 2.3+)
  import_started: { source: IMPORT_SOURCE, free_used: INT },
  import_failed: { source: IMPORT_SOURCE, reason: e('disk_space', 'icloud', 'unsupported', 'network', 'other') },
  recognition_completed: {
    model: WHISPER_MODEL,
    language: e('ja', 'en', 'zh', 'auto'),
    duration_bucket: e('lt5m', '5_20m', '20_60m', 'gt60m'),
  },
  recognition_failed: { model: WHISPER_MODEL, reason: e('cancelled', 'memory', 'error') },
  // playback & study
  player_opened: { media: e('audio', 'video'), has_translation: BOOL, orientation: e('portrait', 'landscape') },
  playback_preset_selected: { preset: e('intensive', 'normal') },
  translation_run: { engine: e('system', 'ai'), segments_bucket: e('lt50', '50_200', 'gt200') },
  shadowing_completed: {
    engine: e('speech_analyzer', 'sf_speech', 'whisper'),
    score_bucket: e('lt60', '60_79', 'gte80'),
  },
  annotation_saved: { has_text: BOOL, has_image: BOOL, has_video: BOOL },
  boundary_check_run: {
    scope: e('document', 'line', 'batch'),
    result: e('changed', 'nothing', 'no_silence', 'unreadable'),
  },
  // vocab
  vocab_item_added: { type: e('word', 'sentence', 'passage', 'note'), from: VOCAB_FROM },
  vocab_quota_hit: { from: VOCAB_FROM },
  vocab_session_completed: { new_count: INT, review_count: INT },
  vocab_book_exported: {},
  vocab_book_imported: { partial: BOOL },
  vocab_ai_deck_generated: {},
  // export
  video_export_completed: {
    layout: e('landscape', 'portrait'),
    range: e('all', 'partial'),
    marked_only: BOOL,
    badge: BOOL,
    end_card: BOOL,
    duration_bucket: e('lt1m', '1_5m', '5_20m'),
  },
  file_exported: { format: e('yomi', 'srt', 'zip') },
  // monetization
  paywall_shown: { trigger: PAYWALL_TRIGGER },
  purchase_completed: { product: e('monthly', 'yearly', 'lifetime'), trigger: PAYWALL_TRIGGER },
  review_prompt_requested: { moment: e('vocab_session', 'video_export') },
  // data
  backup_completed: { kind: e('auto', 'manual') },
  restore_completed: {},
  // re-engagement (phase 2)
  push_opened: { campaign_id: ID },
};

const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Keeps only whitelisted props with valid values. Returns null for an unknown event. */
export function sanitizeEvent(name: unknown, props: unknown): { name: string; props: Record<string, string | number | boolean> } | null {
  if (typeof name !== 'string' || !Object.prototype.hasOwnProperty.call(ANALYTICS_EVENTS, name)) return null;
  const spec = ANALYTICS_EVENTS[name];
  const clean: Record<string, string | number | boolean> = {};
  if (props && typeof props === 'object' && !Array.isArray(props)) {
    for (const [key, value] of Object.entries(props as Record<string, unknown>)) {
      const s = spec[key];
      if (!s) continue;
      switch (s.kind) {
        case 'enum':
          if (typeof value === 'string' && s.values.includes(value)) clean[key] = value;
          break;
        case 'int':
          if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100_000) clean[key] = value;
          break;
        case 'bool':
          if (typeof value === 'boolean') clean[key] = value;
          break;
        case 'id':
          if (typeof value === 'string' && ID_RE.test(value)) clean[key] = value;
          break;
      }
    }
  }
  return { name, props: clean };
}
