'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ uploadId, label }: { uploadId: string; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const supabase = createClient();
    await supabase
      .from('toshiki_tech_yomi_uploads')
      .update({ is_removed: true, removed_reason: 'Deleted by user' })
      .eq('id', uploadId);
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 font-bold hover:underline"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[var(--muted-foreground)] hover:underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
      title={label}
    >
      <Trash2 size={14} />
    </button>
  );
}
