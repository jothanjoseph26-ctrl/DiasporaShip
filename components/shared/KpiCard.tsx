import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: string;
  variant?: 'terra' | 'gold' | 'ink';
}

const variantStyles = {
  terra: { iconBg: 'bg-[var(--terra-pale)]', iconColor: 'text-[var(--terra)]' },
  gold: { iconBg: 'bg-[var(--gold-pale)]', iconColor: 'text-[var(--gold-dark)]' },
  ink: { iconBg: 'bg-[var(--cream-dark)]', iconColor: 'text-[var(--ink)]' },
};

export function KpiCard({ icon, label, value, trend, variant = 'terra' }: KpiCardProps) {
  const styles = variantStyles[variant];
  const trendValue = trend ? parseFloat(trend) : null;
  const trendUp = trendValue !== null && trendValue > 0;
  const trendDown = trendValue !== null && trendValue < 0;

  return (
    <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-md)]">
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3.5 ${styles.iconBg} ${styles.iconColor}`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-bold text-[var(--ink)] leading-none mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
        {value}
      </div>
      <div className="text-xs text-[var(--muted-text)] font-medium">{label}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-[11px] font-semibold mt-2 ${trendUp ? 'text-green-700' : trendDown ? 'text-red-600' : 'text-[var(--muted-text)]'}`}>
          {trendUp ? <TrendingUp size={12} /> : trendDown ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend}
        </div>
      )}
    </div>
  );
}
