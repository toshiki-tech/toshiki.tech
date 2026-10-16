'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

/** How a column compares: text (locale), number, or version ("1.10.2" > "1.9"). */
export type SortKind = 'text' | 'number' | 'version';

export interface SortableColumn {
  label: string;
  kind?: SortKind;
}

export type Cell = string | number;

export interface SortState {
  col: number;
  dir: 'asc' | 'desc';
}

function compareVersions(a: string, b: string) {
  const pa = a.replace(/^v/i, '').split(/[.\-+]/);
  const pb = b.replace(/^v/i, '').split(/[.\-+]/);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? '';
    const y = pb[i] ?? '';
    const nx = Number(x);
    const ny = Number(y);
    const diff = !isNaN(nx) && !isNaN(ny) && x !== '' && y !== '' ? nx - ny : x.localeCompare(y);
    if (diff !== 0) return diff;
  }
  return 0;
}

function toNumber(c: Cell) {
  if (typeof c === 'number') return c;
  const n = parseFloat(c.replace(/[,%\s]/g, ''));
  return isNaN(n) ? -Infinity : n;
}

function compare(a: Cell, b: Cell, kind: SortKind) {
  if (kind === 'number') return toNumber(a) - toNumber(b);
  if (kind === 'version') return compareVersions(String(a), String(b));
  return String(a).localeCompare(String(b));
}

/**
 * Ranking table whose headers sort it (click again to flip). `defaultSort` null keeps the
 * given row order (e.g. funnel steps) until a header is clicked. `ranked` adds a # column
 * numbered in the current order.
 */
export default function SortableTable({
  title,
  columns,
  rows,
  defaultSort = null,
  ranked = false,
  empty = 'No data.',
  formatters,
}: {
  title?: string;
  columns: SortableColumn[];
  rows: Cell[][];
  defaultSort?: SortState | null;
  ranked?: boolean;
  empty?: string;
  /** Display text per column (sorting still uses the raw cell). */
  formatters?: Partial<Record<number, (c: Cell) => string>>;
}) {
  const [sort, setSort] = useState<SortState | null>(defaultSort);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const kind = columns[sort.col]?.kind ?? 'text';
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => sign * compare(a[sort.col], b[sort.col], kind));
  }, [rows, sort, columns]);

  function toggle(col: number) {
    setSort((prev) => {
      if (prev?.col === col) return { col, dir: prev.dir === 'desc' ? 'asc' : 'desc' };
      // numbers / versions start biggest first, text A→Z
      return { col, dir: (columns[col]?.kind ?? 'text') === 'text' ? 'asc' : 'desc' };
    });
  }

  return (
    <div className="border border-[var(--border)] rounded-2xl p-4 overflow-x-auto">
      {title && <h3 className="font-semibold mb-3 text-sm">{title}</h3>}
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">{empty}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted-foreground)]">
              {ranked && <th className="pb-2 font-medium w-8">#</th>}
              {columns.map((c, i) => {
                const active = sort?.col === i;
                const Icon = !active ? ArrowUpDown : sort.dir === 'desc' ? ArrowDown : ArrowUp;
                return (
                  <th key={c.label} className={`pb-2 font-medium ${i > 0 ? 'text-right' : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className={`inline-flex items-center gap-1 hover:text-[var(--foreground)] ${active ? 'text-[var(--foreground)]' : ''}`}
                    >
                      {c.label}
                      <Icon size={12} className={active ? '' : 'opacity-40'} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                {ranked && <td className="py-1.5 text-xs text-[var(--muted-foreground)] tabular-nums">{i + 1}</td>}
                {r.map((c, j) => {
                  const text = formatters?.[j]?.(c) ?? (typeof c === 'number' ? c.toLocaleString() : c);
                  return (
                    <td key={j} className={`py-1.5 ${j > 0 ? 'text-right tabular-nums' : columns[0]?.kind === 'text' ? 'font-medium' : ''}`}>
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
