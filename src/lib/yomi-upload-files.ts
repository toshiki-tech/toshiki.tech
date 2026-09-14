import {
  MAX_YOMI_FILE_SIZE,
  MAX_ZIP_FILE_SIZE,
  MAX_AUDIO_FILE_SIZE,
  MAX_YOMIBOOK_FILE_SIZE,
  ALLOWED_MEDIA_EXTENSIONS,
  YOMIBOOK_EXTENSION,
} from '@/lib/yomi-constants';

/** What a stored object is; it also names the R2 key prefix. */
export type StoredFileKind = 'yomi' | 'zip' | 'media' | 'yomibook';

const MEDIA_CONTENT_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  mp4: 'video/mp4',
};

export function fileExtension(fileName: string) {
  return (fileName.split('.').pop() || '').toLowerCase();
}

/** Returns an error message when the file does not fit its kind, otherwise null */
export function validateStoredFile(kind: StoredFileKind, fileName: string, fileSize: number): string | null {
  const ext = fileExtension(fileName);

  if (kind === 'media') {
    const dotted = `.${ext}` as typeof ALLOWED_MEDIA_EXTENSIONS[number];
    if (!ALLOWED_MEDIA_EXTENSIONS.includes(dotted)) {
      return `Unsupported media type. Allowed: ${ALLOWED_MEDIA_EXTENSIONS.join(', ')}`;
    }
    if (fileSize > MAX_AUDIO_FILE_SIZE) {
      return `Media file too large (max ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB)`;
    }
  } else if (kind === 'yomibook') {
    if (!fileName.toLowerCase().endsWith(YOMIBOOK_EXTENSION)) {
      return `Deck file must be a ${YOMIBOOK_EXTENSION}`;
    }
    if (fileSize > MAX_YOMIBOOK_FILE_SIZE) {
      return `.yomibook file too large (max ${MAX_YOMIBOOK_FILE_SIZE / 1024 / 1024}MB)`;
    }
  } else if (kind === 'zip') {
    if (fileSize > MAX_ZIP_FILE_SIZE) {
      return `ZIP file too large (max ${MAX_ZIP_FILE_SIZE / 1024 / 1024}MB)`;
    }
  } else {
    if (fileSize > MAX_YOMI_FILE_SIZE) {
      return `.yomi file too large (max ${MAX_YOMI_FILE_SIZE / 1024 / 1024}MB)`;
    }
  }
  return null;
}

/** Extension used for the R2 key when the file name carries none */
export function storedFileExtension(kind: StoredFileKind, fileName: string) {
  return fileExtension(fileName) || (kind === 'media' ? 'mp3' : kind);
}

/** Content-Type the presigned PUT is signed for; the browser must send the same */
export function storedFileContentType(kind: StoredFileKind, ext: string) {
  // A .yomibook is a zip underneath, so it is stored and served as one.
  if (kind === 'zip' || kind === 'yomibook') return 'application/zip';
  if (kind === 'media') return MEDIA_CONTENT_TYPES[ext] || 'application/octet-stream';
  return 'text/plain';
}

interface UploadFileState {
  status: string;
  content_type: string;
  file_kind: string | null;
  yomi_storage_path: string | null;
  audio_storage_path: string | null;
}

/**
 * Whether a new version of an approved upload has to wait for an admin. Mirrors
 * the rule applied to a first upload: decks and anything bundling media are
 * reviewed, plain subtitles and third-party material go live directly.
 */
export function fileUpdateNeedsReview(upload: Omit<UploadFileState, 'status'>) {
  if (upload.file_kind === 'yomibook') return true;
  const hasBundledMedia = !!upload.audio_storage_path || !!upload.yomi_storage_path?.startsWith('zip/');
  return upload.content_type !== 'third_party' && hasBundledMedia;
}

/**
 * How a newly submitted version is handled: staged for review, applied at once,
 * applied and sent back to the queue (a rejected upload), or applied by an admin.
 * The replace-file route follows the same rules.
 */
export type ReplaceOutcome = 'review' | 'immediate' | 'resubmit' | 'admin';

export function replaceOutcome(upload: UploadFileState, isAdmin: boolean): ReplaceOutcome {
  if (isAdmin) return 'admin';
  if (upload.status === 'rejected') return 'resubmit';
  if (upload.status === 'approved' && fileUpdateNeedsReview(upload)) return 'review';
  return 'immediate';
}

/** Kind of the primary (non-media) file of an existing upload */
export function primaryFileKind(upload: { file_kind: string | null; yomi_storage_path: string | null }): Exclude<StoredFileKind, 'media'> {
  if (upload.file_kind === 'yomibook' || upload.yomi_storage_path?.startsWith('yomibook/')) return 'yomibook';
  if (upload.yomi_storage_path?.startsWith('zip/')) return 'zip';
  return 'yomi';
}

/**
 * Key prefix for replacement files of one upload. Every new version gets its own
 * key under it, so a file being reviewed never overwrites the one being served,
 * and the server can check that a submitted path really belongs to this upload.
 */
export function replacementKeyPrefix(kind: StoredFileKind, uploadId: string) {
  return `${kind}/${uploadId}/r-`;
}

/** File name for a download, falling back for rows that never recorded one */
export function defaultDownloadName(storagePath: string | null) {
  if (storagePath?.startsWith('zip/')) return 'download.zip';
  if (storagePath?.startsWith('yomibook/')) return 'download.yomibook';
  return 'download.yomi';
}
