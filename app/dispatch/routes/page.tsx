'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GripVertical,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockRouteDrivers = [
  {
    id: 'd1',
    name: 'Adebayo Ogundimu',
    jobs: [
      { id: 'j1', address: '123 Commerce St, Atlanta, GA', order: 1 },
      { id: 'j2', address: '456 Oak Ave, Marietta, GA', order: 2 },
      { id: 'j3', address: '789 Peachtree St, Atlanta, GA', order: 3 },
      { id: 'j4', address: '321 Main St, Decatur, GA', order: 4 },
      { id: 'j5', address: '654 Elm St, Sandy Springs, GA', order: 5 },
    ],
  },
  {
    id: 'd2',
    name: 'Kwame Asante',
    jobs: [
      { id: 'j6', address: '111 Market St, Accra', order: 1 },
      { id: 'j7', address: '222 Ring Rd, Accra', order: 2 },
      { id: 'j8', address: '333 Oxford St, Accra', order: 3 },
    ],
  },
];

const waypointColors = [
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#EA580C',
  '#16A34A',
  '#0891B2',
  '#D97706',
  '#4F46E5',
];

export default function DispatchRoutesPage() {
  const [selectedDriverId, setSelectedDriverId] = useState(mockRouteDrivers[0].id);

  const selectedDriver = mockRouteDrivers.find((d) => d.id === selectedDriverId)!;

  const stopCount = selectedDriver.jobs.length;
  const totalKm = selectedDriverId === 'd1' ? '47.3' : '18.6';
  const totalTime = selectedDriverId === 'd1' ? '2.5' : '1.2';

  return (
    <div className="flex gap-0 h-full" style={{ minHeight: 'calc(100vh - 56px - 40px)' }}>
      {/* Left panel */}
      <div className="w-[420px] flex-shrink-0 bg-[var(--warm-white)] border-r border-[var(--border-warm)] flex flex-col overflow-hidden">
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Driver selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-1.5 block">
              Driver
            </label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
              <SelectTrigger className="h-10 bg-white border-[var(--border-warm)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockRouteDrivers.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job list */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-2 block">
              Stops ({stopCount})
            </label>
            <div className="space-y-2">
              {selectedDriver.jobs.map((job, i) => (
                <div
                  key={job.id}
                  className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[var(--border-warm)] hover:border-[#2563EB]/30 transition-colors group"
                >
                  <div className="flex-shrink-0 cursor-grab text-gray-300 group-hover:text-gray-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: waypointColors[i % waypointColors.length] }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1A1208] font-medium truncate">{job.address}</p>
                    <p className="text-[10px] text-[var(--muted-text)] mt-0.5">Stop {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-[var(--border-warm)] space-y-3 flex-shrink-0">
          {/* Summary */}
          <div className="flex items-center justify-between text-xs text-[var(--muted-text)] px-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {stopCount} stops
            </span>
            <span className="flex items-center gap-1">
              <RouteIcon className="h-3.5 w-3.5" />
              {totalKm} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              ~{totalTime} hours
            </span>
          </div>

          {/* Optimize button */}
          <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white gap-2">
            <Zap className="h-4 w-4" />
            Optimize Route
          </Button>
        </div>
      </div>

      {/* Right panel - Map placeholder */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
        <div className="text-center">
          <Navigation className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-semibold text-gray-400">Route Map</p>
          <p className="text-sm text-gray-400 mt-1">{stopCount} waypoints</p>
        </div>

        {/* Simulated numbered waypoints */}
        {selectedDriver.jobs.map((job, i) => (
          <div
            key={job.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${15 + (i * 17) + (i % 2 === 0 ? 0 : 5)}%`,
              top: `${20 + Math.sin(i * 1.2) * 25 + 20}%`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: waypointColors[i % waypointColors.length] }}
            >
              {i + 1}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] mt-[-2px]"
              style={{ borderTopColor: waypointColors[i % waypointColors.length] }}
            />
          </div>
        ))}

        {/* Simulated route lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {selectedDriver.jobs.map((_, i) => {
            if (i === selectedDriver.jobs.length - 1) return null;
            const x1 = 15 + (i * 17) + (i % 2 === 0 ? 0 : 5) + 2;
            const y1 = 20 + Math.sin(i * 1.2) * 25 + 20 + 1.5;
            const x2 = 15 + ((i + 1) * 17) + ((i + 1) % 2 === 0 ? 0 : 5) + 2;
            const y2 = 20 + Math.sin((i + 1) * 1.2) * 25 + 20 + 1.5;
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#2563EB"
                strokeWidth="2"
                strokeDasharray="8,4"
                strokeLinecap="round"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
