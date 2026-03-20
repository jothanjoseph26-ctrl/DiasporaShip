"use client";

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SkeletonRow } from './SkeletonRow';
import { EmptyState } from './EmptyState';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyState?: { icon?: React.ReactNode; title: string; description?: string };
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  loading,
  emptyState,
  pageSize = 20,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="border border-[var(--border-warm)] rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-warm)]">
              {columns.map(col => (
                <th key={col.key} className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} columns={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border border-[var(--border-warm)] rounded-[var(--radius-lg)] bg-[var(--warm-white)]">
        <EmptyState
          icon={emptyState?.icon}
          title={emptyState?.title || 'No data found'}
          description={emptyState?.description}
        />
      </div>
    );
  }

  return (
    <div className="border border-[var(--border-warm)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--warm-white)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-[1.5px] border-[var(--border-warm)]">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none hover:text-[var(--ink)]' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b border-[var(--border-warm)] last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--terra-pale)]' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className="p-3 text-[var(--ink)]">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-warm)]">
          <span className="text-xs text-[var(--muted-text)]">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              className="text-xs px-3 py-1.5 rounded border border-[var(--border-warm)] disabled:opacity-40 hover:bg-[var(--terra-pale)]"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded border border-[var(--border-warm)] disabled:opacity-40 hover:bg-[var(--terra-pale)]"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
