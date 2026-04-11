'use client';

import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

interface ConfigItem {
  key: string;
  value: number;
  label: string;
  description: string | null;
}

export default function PointsConfig() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/yomi/admin/points-config')
      .then(r => r.json())
      .then(data => {
        setConfigs(data);
        const vals: Record<string, string> = {};
        data.forEach((c: ConfigItem) => { vals[c.key] = String(c.value); });
        setEditValues(vals);
        setLoading(false);
      });
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    await fetch('/api/yomi/admin/points-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: editValues[key] }),
    });
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value: parseInt(editValues[key]) } : c));
    setSaving(null);
  };

  if (loading) return <div className="text-[var(--muted-foreground)] py-4">Loading config...</div>;

  return (
    <div className="space-y-3">
      {configs.map(config => (
        <div key={config.key} className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{config.label}</p>
            {config.description && <p className="text-xs text-[var(--muted-foreground)]">{config.description}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="number"
              value={editValues[config.key] || ''}
              onChange={e => setEditValues(prev => ({ ...prev, [config.key]: e.target.value }))}
              className="w-20 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-center"
            />
            {String(config.value) !== editValues[config.key] && (
              <button
                onClick={() => handleSave(config.key)}
                disabled={saving === config.key}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] text-xs font-bold hover:bg-[rgb(var(--accent))]/20 transition-colors disabled:opacity-50"
              >
                <Save size={12} />
                {saving === config.key ? '...' : 'Save'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
