"use client";

import { MapPin, Clock, Package, CheckCircle2, AlertTriangle, Truck, Plane, Ship, Warehouse } from 'lucide-react';
import type { TrackingEvent } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface TrackingTimelineProps {
  events: TrackingEvent[];
  mode?: 'full' | 'public';
}

function getEventIcon(eventType: string) {
  const icons: Record<string, React.ReactNode> = {
    booked: <Package size={14} />,
    pickup_assigned: <Truck size={14} />,
    picked_up: <CheckCircle2 size={14} />,
    at_warehouse: <Warehouse size={14} />,
    processing: <Package size={14} />,
    customs_pending: <AlertTriangle size={14} />,
    customs_cleared: <CheckCircle2 size={14} />,
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

  return (
    <div className="relative pl-6">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-warm)]" />
      <div className="flex flex-col gap-4">
        {sorted.map((event, idx) => (
          <div key={event.id} className="relative flex gap-3">
            <div className={`absolute left-[-17px] w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getEventColor(event.eventType)}`}>
              {getEventIcon(event.eventType)}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium text-[var(--ink)]">{event.description}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-text)]">
                <span className="flex items-center gap-1">
                  <MapPin size={10} />
                  {event.locationName}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {formatDateTime(event.occurredAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
