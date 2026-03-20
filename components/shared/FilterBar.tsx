"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  type: 'select' | 'search' | 'dateRange' | 'date';
  label: string;
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  values?: Record<string, string>;
}

export function FilterBar({ filters, onFilterChange, onClear, values = {} }: FilterBarProps) {
  const hasActiveFilters = Object.values(values).some(v => v && v.length > 0);

  return (
    <div className="flex flex-wrap items-end gap-3">
      {filters.map(filter => (
        <div key={filter.key} className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            {filter.label}
          </label>
          {filter.type === 'search' ? (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
                value={values[filter.key] || ''}
                onChange={e => onFilterChange(filter.key, e.target.value)}
                className="pl-9 h-9 w-48 bg-[var(--warm-white)] border-[var(--border-warm)] text-sm text-[var(--ink)] placeholder:text-gray-500"
              />
            </div>
          ) : filter.type === 'select' ? (
            <Select
              value={values[filter.key] || 'all'}
              onValueChange={val => onFilterChange(filter.key, val === 'all' ? '' : val)}
            >
              <SelectTrigger className="h-9 w-44 bg-[var(--warm-white)] border-[var(--border-warm)] text-sm text-[var(--ink)] [&_span]:text-[var(--ink)]">
                <SelectValue placeholder={filter.placeholder || `All ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filter.placeholder || `All ${filter.label}`}</SelectItem>
                {filter.options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="date"
              value={values[filter.key] || ''}
              onChange={e => onFilterChange(filter.key, e.target.value)}
              className="h-9 w-44 bg-[var(--warm-white)] border-[var(--border-warm)] text-sm text-[var(--ink)]"
            />
          )}
        </div>
      ))}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--terra)] hover:text-[var(--terra-dark)] pb-0.5"
        >
          <X size={12} />
          Clear filters
        </button>
      )}
    </div>
  );
}
