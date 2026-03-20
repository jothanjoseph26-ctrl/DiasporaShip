"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Globe,
  MapPin,
  Package,
  RefreshCw,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useAdminStore, useDriverStore, useShipmentStore } from "@/store";
import { cn, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

function KpiCard({
  icon: Icon,
  iconClass,
  value,
  label,
  trend,
}: {
  icon: React.ComponentType<{ size?: number }>;
  iconClass: string;
  value: string;
  label: string;
  trend: string;
}) {
  return (
    <div className="kpi-card">
      <div className="mb-4 flex items-start justify-between">
        <div className={cn("kpi-icon-wrap", iconClass)}>
          <Icon size={17} />
        </div>
        <span className="kpi-trend up">
          <TrendingUp size={12} />
          {trend}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { kpis, activity } = useAdminStore();
  const { drivers } = useDriverStore();
  const { shipments } = useShipmentStore();

  const onlineDrivers = drivers.filter((driver) => driver.isOnline);
  const offlineDrivers = drivers.filter((driver) => !driver.isOnline);

  const corridors = Object.entries(
    shipments.reduce<Record<string, number>>((acc, shipment) => {
      const key = `${shipment.originCountry}→${shipment.destinationCountry}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const liveRevenue = shipments
    .slice(0, 6)
    .reduce((total, shipment) => total + shipment.totalCost, 0);

  return (
    <div className="flex flex-col gap-6">
      <div
        style={{
          background: "var(--ink)",
          borderRadius: "10px",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span className="live-dot" />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#22C55E" }}>Platform Live</span>
        </div>
        {[
          { label: "Active shipments", value: String(kpis.activeToday) },
          { label: "Drivers online", value: String(onlineDrivers.length) },
          { label: "Customs queue", value: String(kpis.customsHolds) },
          { label: "Revenue sample", value: formatCurrency(liveRevenue, shipments[0]?.currency ?? "USD") },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "rgba(255,253,249,0.35)" }}>·</span>
            <span style={{ fontSize: "12px", color: "rgba(255,253,249,0.45)" }}>{item.label}:</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--warm-white)" }}>{item.value}</span>
          </div>
        ))}
        <button
          type="button"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,253,249,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
          }}
        >
          <RefreshCw size={11} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard icon={DollarSign} iconClass="terra" value={kpis.revenue} label="Revenue today" trend={kpis.revenueChange} />
        <KpiCard icon={Package} iconClass="gold" value={String(kpis.activeToday)} label="Shipments today" trend="+12.1%" />
        <KpiCard icon={CheckCircle2} iconClass="green" value={`${kpis.onTimeRate}%`} label="On-time rate" trend="+0.3%" />
        <KpiCard icon={Clock} iconClass="blue" value={kpis.avgDeliveryTime} label="Avg delivery time" trend="-0.2 days" />
        <KpiCard icon={Users} iconClass="purple" value={String(kpis.totalDrivers)} label="Total drivers" trend={`+${onlineDrivers.length} online`} />
        <KpiCard icon={Truck} iconClass="cyan" value={`${kpis.fleetUtilization}%`} label="Fleet utilization" trend="+8 vs yesterday" />
        <KpiCard icon={AlertTriangle} iconClass="terra" value={String(kpis.customsHolds)} label="Customs holds" trend="-2 vs yesterday" />
        <KpiCard icon={Globe} iconClass="gold" value={String(corridors.length)} label="Active corridors" trend="US, UK, NG, GH" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr,0.8fr]">
        <div className="card-brand p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="heading-lg text-[24px]">Live Fleet Snapshot</div>
              <div className="text-sm text-[#8C7B6B]">Driver coverage and branch activity</div>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-delivered">{onlineDrivers.length} online</span>
              <span className="badge badge-cancelled">{offlineDrivers.length} offline</span>
            </div>
          </div>
          <div className="relative h-[320px] overflow-hidden rounded-xl border border-[#E8DDD0] bg-gradient-to-br from-[#F5EBE0] via-[#FFFDF9] to-[#FBF3DC]">
            {drivers.slice(0, 6).map((driver, index) => (
              <div
                key={driver.id}
                className={cn(
                  "absolute flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg",
                  driver.isOnline
                    ? driver.status === "available"
                      ? "bg-[#C4622D]"
                      : "bg-[#C9972B]"
                    : "bg-[#8C7B6B]",
                )}
                style={{
                  left: `${12 + (index % 3) * 28}%`,
                  top: `${18 + Math.floor(index / 3) * 34}%`,
                }}
                title={`${driver.name} - ${driver.status}`}
              >
                {driver.avatar}
              </div>
            ))}
            <div className="absolute bottom-4 left-4 right-4 rounded-full border border-[#E8DDD0] bg-white/90 px-6 py-3 text-center shadow-lg backdrop-blur">
              <MapPin className="mx-auto mb-1 h-7 w-7 text-[#C4622D]" />
              <p className="text-sm font-semibold text-[#1A1208]">Nigeria, Ghana, UK and US corridor view</p>
              <p className="text-xs text-[#8C7B6B]">Operational marker preview until live map is wired in</p>
            </div>
          </div>
        </div>

        <div className="card-brand p-5">
          <div className="mb-4 font-playfair text-lg font-bold text-[#1A1208]">Live Activity</div>
          <div>
            {activity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className={cn("activity-dot", item.type === "payment" ? "wallet" : item.type)} />
                <div className="min-w-0 flex-1">
                  <div className="activity-text">{item.message}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr,0.75fr]">
        <div className="card-brand overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E8DDD0] px-5 py-4">
            <div className="font-playfair text-lg font-bold text-[#1A1208]">Recent Shipments</div>
            <Link href="/admin/shipments" className="btn-ghost inline-flex items-center gap-1 text-sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Amount</th>
                  <th>ETA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {shipments.slice(0, 6).map((shipment) => (
                  <tr key={shipment.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", fontWeight: 600 }}>
                      {shipment.trackingNumber}
                    </td>
                    <td>
                      <span className="text-sm text-[#8C7B6B]">
                        {shipment.originCountry} → {shipment.destinationCountry}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(shipment.status))} />
                        <span>{getStatusLabel(shipment.status)}</span>
                      </span>
                    </td>
                    <td>{shipment.assignedDriverName ?? "Unassigned"}</td>
                    <td>{formatCurrency(shipment.totalCost, shipment.currency)}</td>
                    <td className="text-[#8C7B6B]">{shipment.estimatedDeliveryDate}</td>
                    <td>
                      <button type="button" className="btn-ghost inline-flex items-center gap-1 !px-2 !py-1">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-brand p-5">
          <div className="mb-4 font-playfair text-lg font-bold text-[#1A1208]">Top Corridors</div>
          <div className="space-y-3">
            {corridors.map(([corridor, count]) => {
              const percentage = Math.round((count / Math.max(shipments.length, 1)) * 100);
              return (
                <div key={corridor} className="rounded-xl border border-[#E8DDD0] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#1A1208]">{corridor}</span>
                    <span className="text-sm font-semibold text-[#C4622D]">{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F5EBE0]">
                    <div
                      className="h-2 rounded-full bg-[#C4622D]"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 border-t border-[#E8DDD0] pt-4">
            <div className="mb-3 font-playfair text-lg font-bold text-[#1A1208]">Driver Pulse</div>
            <div className="grid grid-cols-2 gap-3">
              {drivers.slice(0, 4).map((driver) => (
                <div key={driver.id} className="rounded-xl border border-[#E8DDD0] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EBE0] text-xs font-semibold text-[#C4622D]">
                      {driver.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#1A1208]">{driver.name}</div>
                      <div className="truncate text-xs text-[#8C7B6B]">{driver.vehicleType}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8C7B6B]">{driver.completedToday} today</span>
                    <span className="font-semibold text-[#C9972B]">{driver.rating}★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
