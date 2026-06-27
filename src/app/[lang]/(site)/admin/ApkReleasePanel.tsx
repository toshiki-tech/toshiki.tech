'use client';

import { useState } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [r2Path, setR2Path]             = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [sha256, setSha256]             = useState('');
  const [fileSize, setFileSize]         = useState('');
  const [minVersion, setMinVersion]     = useState('1');
  const [forceUpdate, setForceUpdate]   = useState(false);
  const [status, setStatus]             = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [errMsg, setErrMsg]             = useState('');

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))] transition-colors';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrMsg('');

    const res = await fetch('/api/yomiplay/apk/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        versionCode:             parseInt(versionCode),
        versionName,
        r2Path,
        releaseNotes,
        apkSha256:               sha256   || undefined,
        fileSize:                fileSize  ? parseInt(fileSize)  : undefined,
        minSupportedVersionCode: minVersion ? parseInt(minVersion) : 1,
        forceUpdate,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErrMsg(data.error || 'Failed');
      setStatus('error');
      return;
    }

    setStatus('ok');
    // Reset form
    setVersionCode(''); setVersionName(''); setR2Path('');
    setReleaseNotes(''); setSha256(''); setFileSize('');
    setMinVersion('1'); setForceUpdate(false);
    setOpen(false);
    // Reload to show new release in list
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Smartphone size={18} />
        Android APK Releases
      </h2>

      {/* Current latest */}
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

      {/* Release history */}
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

      {/* Publish new release */}
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

          <div className="p-3 rounded-lg bg-[var(--muted)]/40 text-xs text-[var(--muted-foreground)] leading-relaxed">
            <strong>Before publishing:</strong> upload the APK to R2 first (via Cloudflare Dashboard or CLI),
            then fill in the path below. Format: <code className="font-mono">apk/yomiplay-x.x.x.apk</code>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Version Code *</label>
              <input
                type="number" required min={1}
                value={versionCode} onChange={e => setVersionCode(e.target.value)}
                placeholder={latest ? String(latest.version_code + 1) : '1'}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Version Name *</label>
              <input
                type="text" required
                value={versionName} onChange={e => setVersionName(e.target.value)}
                placeholder="e.g. 1.2.0"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>R2 Path *</label>
            <input
              type="text" required
              value={r2Path} onChange={e => setR2Path(e.target.value)}
              placeholder="apk/yomiplay-1.2.0.apk"
              className={inputClass}
            />
          </div>

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
              <label className={labelClass}>APK SHA-256 (optional)</label>
              <input
                type="text"
                value={sha256} onChange={e => setSha256(e.target.value)}
                placeholder="abc123..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>File Size in bytes (optional)</label>
              <input
                type="number" min={0}
                value={fileSize} onChange={e => setFileSize(e.target.value)}
                placeholder="e.g. 48234567"
                className={inputClass}
              />
            </div>
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
            disabled={status === 'submitting'}
            className="btn-primary px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {status === 'submitting' ? 'Publishing…' : 'Publish Release'}
          </button>
        </form>
      )}
    </section>
  );
}
