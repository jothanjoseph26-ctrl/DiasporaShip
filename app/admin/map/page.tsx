'use client';

import { useState } from 'react';
import { MapPin, Plane, Ship, Truck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const corridors = [
  { id: 'us-ng', from: 'US', to: 'NG', label: 'US → NG', active: true, count: 42 },
  { id: 'us-gh', from: 'US', to: 'GH', label: 'US → GH', active: true, count: 18 },
  { id: 'us-ke', from: 'US', to: 'KE', label: 'US → KE', active: true, count: 12 },
  { id: 'uk-ng', from: 'UK', to: 'NG', label: 'UK → NG', active: true, count: 24 },
];

export default function AdminMapPage() {
  const [activeCorridors, setActiveCorridors] = useState<Set<string>>(new Set(corridors.map(c => c.id)));

  const toggleCorridor = (id: string) => {
    setActiveCorridors(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const stats = {
    inTransit: 74,
    delayed: 5,
    onTime: 69,
  };

  const dots = [
    { x: 25, y: 35, status: 'transit', corridor: 'US→NG' },
    { x: 28, y: 40, status: 'transit', corridor: 'US→NG' },
    { x: 32, y: 45, status: 'delayed', corridor: 'US→NG' },
    { x: 48, y: 38, status: 'transit', corridor: 'UK→NG' },
    { x: 24, y: 50, status: 'transit', corridor: 'US→GH' },
    { x: 22, y: 55, status: 'transit', corridor: 'US→KE' },
    { x: 30, y: 52, status: 'on_time', corridor: 'US→KE' },
    { x: 50, y: 42, status: 'transit', corridor: 'UK→NG' },
  ];

  return (
    <div className="relative h-[calc(100vh-140px)] rounded-xl border border-[var(--border-warm)] overflow-hidden bg-gradient-to-br from-[#E8F4FD] via-[#F0F7FF] to-[#E2ECF5]">
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <path d="M15,18 Q20,15 25,18 L28,22 Q22,28 18,25 Z" fill="#8B7355" opacity="0.3" />
          <path d="M20,30 Q25,25 35,30 L38,35 Q30,42 22,38 Z" fill="#8B7355" opacity="0.3" />
          <path d="M45,12 Q50,8 58,12 L62,18 Q55,22 48,18 Z" fill="#8B7355" opacity="0.3" />
          <path d="M55,30 Q60,28 65,32 L68,38 Q62,45 56,40 Z" fill="#8B7355" opacity="0.3" />
          <path d="M42,35 Q48,32 55,38 L52,45 Q46,42 42,38 Z" fill="#8B7355" opacity="0.3" />
        </svg>
      </div>

      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
        <line x1="22" y1="32" x2="48" y2="38" stroke="#C4622D" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.4" />
        <line x1="22" y1="32" x2="48" y2="36" stroke="#C9972B" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.4" />
        <line x1="22" y1="32" x2="55" y2="35" stroke="#2563EB" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.3" />
        <line x1="48" y1="18" x2="48" y2="38" stroke="#15803D" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.4" />
      </svg>

      {dots.map((dot, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full shadow-lg ${dot.status === 'delayed' ? 'bg-red-500' : dot.status === 'on_time' ? 'bg-green-500' : 'bg-[var(--terra)]'} animate-pulse`}
          style={{ left: `${dot.x}%`, top: `${dot.y}%`, animationDelay: `${i * 0.3}s` }}
          title={`${dot.corridor} - ${dot.status}`}
        />
      ))}

      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {corridors.map(c => (
          <button
            key={c.id}
            onClick={() => toggleCorridor(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCorridors.has(c.id) ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white/80 text-[var(--muted-text)] border-[var(--border-warm)]'}`}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur border border-[var(--border-warm)] rounded-xl p-4 shadow-lg w-56">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)] mb-3">Live Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--ink)]"><Truck size={14} className="text-blue-500" /> In Transit</span>
            <span className="text-sm font-bold text-[var(--ink)]">{stats.inTransit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--ink)]"><CheckCircle2 size={14} className="text-green-500" /> On Time</span>
            <span className="text-sm font-bold text-green-700">{stats.onTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--ink)]"><AlertTriangle size={14} className="text-red-500" /> Delayed</span>
            <span className="text-sm font-bold text-red-600">{stats.delayed}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-[var(--border-warm)] rounded-xl p-3 shadow-lg">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink)] mb-2">Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[var(--ink)]"><span className="w-2.5 h-2.5 rounded-full bg-[var(--terra)]" /> In Transit</div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink)]"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> On Schedule</div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink)]"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Delayed</div>
        </div>
      </div>
    </div>
  );
}
