import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--terra-pale)] flex items-center justify-center text-[var(--terra)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--ink)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted-text)] max-w-sm mb-5">{description}</p>
      )}
      {ctaLabel && onCta && (
        <Button onClick={onCta} className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
