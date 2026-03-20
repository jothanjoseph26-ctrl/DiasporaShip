"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function RightDrawer({ open, onClose, title, children, width = 400 }: RightDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in"
        onClick={onClose}
      />
      <div
        className="absolute top-0 right-0 h-full bg-[var(--warm-white)] shadow-[var(--shadow-lg)] flex flex-col animate-in slide-in-from-right duration-300"
        style={{ width }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-warm)] flex-shrink-0">
          <h2 className="text-base font-semibold text-[var(--ink)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--terra-pale)] text-gray-600 hover:text-[var(--ink)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 text-[var(--ink)]">
          {children}
        </div>
      </div>
    </div>
  );
}
