"use client";

import { type ReactNode } from 'react';
import { MapPin, Clock, Package, CheckCircle2, AlertTriangle, Truck, Plane, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TrackingEvent } from '@/types';
import { formatDateTime, getCountryFlag } from '@/lib/utils';

interface TrackingTimelineProps {
  events: TrackingEvent[];
  mode?: 'full' | 'public';
}

function getEventIcon(eventType: string) {
  const icons: Record<string, ReactNode> = {
    booked: <Package size={14} />,
    pickup_assigned: <Truck size={14} />,
    picked_up: <CheckCircle2 size={14} />,
    at_warehouse: <Warehouse size={14} />,
    processing: <Package size={14} />,
    customs_pending: <AlertTriangle size={14} />,
    customs_cleared: <CheckCircle2 size={14} />,
    customs_held: <AlertTriangle size={14} />,
    in_transit_domestic: <Truck size={14} />,
    in_transit_international: <Plane size={14} />,
    out_for_delivery: <Truck size={14} />,
    delivered: <CheckCircle2 size={14} />,
    failed_delivery: <AlertTriangle size={14} />,
  };
  return icons[eventType] || <MapPin size={14} />;
}

function getEventColor(eventType: string) {
  if (eventType.includes('delivered') && !eventType.includes('failed')) return 'bg-green-100 text-green-700 border-green-200';
  if (eventType.includes('customs_held') || eventType.includes('failed')) return 'bg-red-100 text-red-700 border-red-200';
  if (eventType.includes('customs')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (eventType.includes('transit') || eventType.includes('out_for')) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-[var(--terra-pale)] text-[var(--terra)] border-[var(--border-warm)]';
}

export function TrackingTimeline({ events, mode = 'full' }: TrackingTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const latest = sorted[0];

  return (
    <div className="space-y-4">
      {mode === 'full' && latest && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] px-4 py-3">
          <Badge variant="secondary" className="bg-white">
            Latest checkpoint
          </Badge>
          <span className="text-sm font-medium text-[var(--ink)]">{latest.description}</span>
          {latest.team && <span className="text-xs text-[var(--muted-text)]">Handled by {latest.team}</span>}
        </div>
      )}

      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-warm)]" />
        <div className="flex flex-col gap-4">
          {sorted.map((event) => (
            <div key={event.id} className="relative flex gap-3">
              <div className={`absolute left-[-17px] w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getEventColor(event.eventType)}`}>
                {getEventIcon(event.eventType)}
              </div>
              <div className="ml-2 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium text-[var(--ink)]">{event.description}</div>
                  {mode === 'full' && (
                    <Badge variant="outline" className="h-6 rounded-full border-[var(--border-warm)] bg-white text-[11px]">
                      {event.eventType.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-text)]">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {event.locationName}
                  </span>
                  {event.country && (
                    <span className="flex items-center gap-1">
                      <span>{getCountryFlag(event.country)}</span>
                      <span>{event.country}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatDateTime(event.occurredAt)}
                  </span>
                </div>
                {(mode === 'full' && (event.team || event.note)) && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {event.team && <span className="rounded-full bg-[var(--terra-pale)] px-2.5 py-1 text-[var(--terra)]">Team: {event.team}</span>}
                    {event.note && <span className="rounded-full border border-[var(--border-warm)] bg-white px-2.5 py-1 text-[var(--muted-text)]">{event.note}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
