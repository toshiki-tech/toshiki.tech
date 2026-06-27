'use client';

import { useRef, useState } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';

interface Release {
  id: string;
  version_code: number;
  version_name: string;
  release_notes: string;
  force_update: boolean;
  is_active: boolean;
  file_size: number | null;
  created_at: string;
}

export default function ApkReleasePanel({ releases }: { releases: Release[] }) {
  const latest = releases[0] ?? null;

  const [open, setOpen] = useState(false);
  const [versionCode, setVersionCode]   = useState('');
  const [versionName, setVersionName]   = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [minVersion, setMinVersion]     = useState('1');
  const [forceUpdate, setForceUpdate]   = useState(false);

  const [apkFile, setApkFile]               = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'ok' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-colors';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1';

  function clearFile() {
    setApkFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function computeSha256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg('');

    if (!apkFile) {
      setErrMsg('Please select an APK file.');
      setStatus('error');
      return;
    }

    // 1. Compute SHA-256 and get presigned upload URL
    setStatus('uploading');
    setUploadProgress(0);

    let sha256: string;
    let r2Path: string;
    let presignedUrl: string;

    try {
      sha256 = await computeSha256(apkFile);

      const urlRes = await fetch('/api/admin/apk/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionName }),
      });
      if (!urlRes.ok) {
        const d = await urlRes.json();
        throw new Error(d.error || 'Failed to get upload URL');
      }
      ({ r2Path, presignedUrl } = await urlRes.json());
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload init failed');
      setStatus('error');
      return;
    }

    // 2. PUT file directly to R2 with progress
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`R2 upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', 'application/vnd.android.package-archive');
        xhr.send(apkFile);
      });
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
      return;
    }

    // 3. Publish release record
    setStatus('submitting');
    const res = await fetch('/api/yomiplay/apk/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        versionCode:             parseInt(versionCode),
        versionName,
        r2Path,
        releaseNotes,
        apkSha256:               sha256,
        fileSize:                apkFile.size,
        minSupportedVersionCode: minVersion ? parseInt(minVersion) : 1,
        forceUpdate,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErrMsg(data.error || 'Failed to publish release');
      setStatus('error');
      return;
    }

    setStatus('ok');
    setVersionCode(''); setVersionName(''); setReleaseNotes('');
    setMinVersion('1'); setForceUpdate(false);
    clearFile();
    setOpen(false);
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Smartphone size={18} />
        Android APK Releases
      </h2>

      {latest ? (
        <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold">
              Latest: v{latest.version_name}
              <span className="ml-2 text-xs font-normal text-[var(--muted-foreground)]">
                (code {latest.version_code})
              </span>
              {latest.force_update && (
                <span className="ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                  Force Update
                </span>
              )}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {new Date(latest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {latest.file_size && ` · ${(latest.file_size / 1024 / 1024).toFixed(1)} MB`}
            </p>
          </div>
          <a
            href="/api/yomiplay/apk/latest"
            target="_blank"
            className="text-xs text-[rgb(var(--accent))] hover:underline shrink-0"
          >
            View JSON ↗
          </a>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)] mb-4">No releases yet.</p>
      )}

      {releases.length > 1 && (
        <div className="mb-4 space-y-2">
          {releases.slice(1).map((r) => (
            <div key={r.id} className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between text-sm">
              <span className="font-medium">v{r.version_name} <span className="text-[var(--muted-foreground)] font-normal text-xs">(code {r.version_code})</span></span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold text-[rgb(var(--accent))] hover:opacity-80 transition-opacity"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Publish new release
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Version Code *</label>
              <input
                type="number" required min={1}
                value={versionCode} onChange={e => setVersionCode(e.target.value)}
                placeholder={latest ? String(latest.version_code + 1) : '1'}
                className={inputClass}
              />
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">build.gradle → versionCode</p>
            </div>
            <div>
              <label className={labelClass}>Version Name *</label>
              <input
                type="text" required
                value={versionName} onChange={e => setVersionName(e.target.value)}
                placeholder="e.g. 0.1.2"
                className={inputClass}
              />
              <p className="text-[10px] text-[var(--muted-foreground)] mt-1">build.gradle → versionName</p>
            </div>
          </div>

          {/* APK file picker */}
          <div>
            <label className={labelClass}>APK File *</label>
            {apkFile ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/5">
                <Smartphone size={14} className="text-[rgb(var(--accent))] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{apkFile.name}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">{(apkFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={clearFile} className="shrink-0 text-[var(--muted-foreground)] hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-lg border-2 border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:border-[rgb(var(--accent))]/50 hover:text-[rgb(var(--accent))] transition-colors"
              >
                <Upload size={16} />
                Click to select APK file
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk,application/vnd.android.package-archive"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0] ?? null;
                setApkFile(f);
                setUploadProgress(0);
              }}
            />
          </div>

          {/* Upload progress bar */}
          {status === 'uploading' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>Uploading to R2…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className="h-full bg-[rgb(var(--accent))] rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Release Notes *</label>
            <textarea
              required rows={4}
              value={releaseNotes} onChange={e => setReleaseNotes(e.target.value)}
              placeholder={'• New feature\n• Bug fixes'}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Min Supported Version Code</label>
              <input
                type="number" required min={1}
                value={minVersion} onChange={e => setMinVersion(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={forceUpdate}
                  onChange={e => setForceUpdate(e.target.checked)}
                  className="w-4 h-4 accent-[rgb(var(--accent))]"
                />
                Force update (block old versions)
              </label>
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={14} /> {errMsg}
            </div>
          )}
          {status === 'ok' && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle2 size={14} /> Release published successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'uploading' || status === 'submitting'}
            className="btn-primary px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {status === 'uploading' ? `Uploading… ${uploadProgress}%`
              : status === 'submitting' ? 'Publishing…'
              : 'Publish Release'}
          </button>
        </form>
      )}
    </section>
  );
}
