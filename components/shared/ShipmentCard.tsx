"use client";

import { Package, Calendar, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Shipment } from '@/types';

const countryFlags: Record<string, string> = {
  US: '\u{1F1FA}\u{1F1F8}', NG: '\u{1F1F3}\u{1F1EC}', GB: '\u{1F1EC}\u{1F1E7}',
  CA: '\u{1F1E8}\u{1F1E6}', GH: '\u{1F1EC}\u{1F1ED}', KE: '\u{1F1F0}\u{1F1EA}',
  CN: '\u{1F1E8}\u{1F1F3}', DE: '\u{1F1E9}\u{1F1EA}', FR: '\u{1F1EB}\u{1F1F7}',
  ZA: '\u{1F1FF}\u{1F1E6}',
};

interface ShipmentCardProps {
  shipment: Shipment;
  onClick?: () => void;
}

export function ShipmentCard({ shipment, onClick }: ShipmentCardProps) {
  const originFlag = countryFlags[shipment.originCountry] || '';
  const destFlag = countryFlags[shipment.destinationCountry] || '';

  return (
    <div
      onClick={onClick}
      className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-all cursor-pointer hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-mono)' }}>
            {shipment.trackingNumber}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--muted-text)]">
            <Package size={11} />
            {shipment.packageDescription.slice(0, 40)}{shipment.packageDescription.length > 40 ? '...' : ''}
          </div>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{originFlag}</span>
          <span className="text-xs text-[var(--muted-text)]">{shipment.originCountry}</span>
        </div>
        <div className="flex-1 h-px bg-[var(--border-warm)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{destFlag}</span>
          <span className="text-xs text-[var(--muted-text)]">{shipment.destinationCountry}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-[var(--muted-text)]">
          <Calendar size={11} />
          {formatDate(shipment.estimatedDeliveryDate)}
        </span>
        <span className="font-semibold text-[var(--ink)]">
          {formatCurrency(shipment.totalCost, shipment.currency)}
        </span>
      </div>
    </div>
  );
}
