'use client';

import { useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';

export default function ShareButton({ lang, uploadId }: { lang: string; uploadId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/${lang}/yomiplay/community/${uploadId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-[rgb(var(--accent))] hover:underline inline-flex items-center gap-1"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <ExternalLink size={12} />}
    </button>
  );
}
