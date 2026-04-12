import { Star, Crown, Upload, Download, Calendar } from 'lucide-react';

interface Props {
  config: Record<string, number>;
  title: string;
  subtitle: string;
  rules: {
    upload_yomi: string;
    upload_zip: string;
    download_received: string;
    daily_login: string;
    pro_threshold: string;
  };
  unit: string;
}

export default function PointsRules({ config, title, subtitle, rules, unit }: Props) {
  const items = [
    { key: 'upload_yomi', label: rules.upload_yomi, icon: Upload },
    { key: 'upload_zip', label: rules.upload_zip, icon: Upload },
    { key: 'download_received', label: rules.download_received, icon: Download },
    { key: 'daily_login', label: rules.daily_login, icon: Calendar },
  ];
  const threshold = config.pro_threshold;

  return (
    <div className="mb-8 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-start gap-3 mb-4">
        <Star size={20} className="text-yellow-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm mb-1">{title}</h2>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{subtitle}</p>
        </div>
      </div>

      <ul className="space-y-2 mb-4">
        {items.map(({ key, label, icon: Icon }) => {
          const value = config[key];
          if (value === undefined) return null;
          return (
            <li key={key} className="flex items-center justify-between gap-3 py-1.5 text-sm">
              <span className="flex items-center gap-2 text-[var(--muted-foreground)] min-w-0">
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{label}</span>
              </span>
              <span className="font-bold text-green-500 shrink-0">+{value} {unit}</span>
            </li>
          );
        })}
      </ul>

      {threshold !== undefined && (
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Crown size={14} className="text-purple-500" />
            {rules.pro_threshold}
          </span>
          <span className="font-bold text-purple-500">{threshold} {unit}</span>
        </div>
      )}
    </div>
  );
}
