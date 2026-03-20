'use client'

import {
  Package, Users, DollarSign, Truck, Clock,
  TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, ArrowRight, RefreshCw, Globe
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ── MOCK DATA ────────────────────────────────────────────────
const revenueData = [
  { day: 'Mon', revenue: 12400, shipments: 48 },
  { day: 'Tue', revenue: 15800, shipments: 62 },
  { day: 'Wed', revenue: 11200, shipments: 41 },
  { day: 'Thu', revenue: 18600, shipments: 74 },
  { day: 'Fri', revenue: 22100, shipments: 89 },
  { day: 'Sat', revenue: 19400, shipments: 76 },
  { day: 'Sun', revenue: 14700, shipments: 58 },
]

const corridorData = [
  { name: 'US→Nigeria',  value: 48, color: 'var(--terra)' },
  { name: 'US→Ghana',    value: 22, color: 'var(--gold)' },
  { name: 'US→Kenya',    value: 18, color: '#2563EB' },
  { name: 'UK→Nigeria',  value: 12, color: '#7C3AED' },
]

const recentShipments = [
  { id: 'DS-20240318-KW91', customer: 'Adaeze Okonkwo', from: 'Atlanta, US', to: 'Lagos, NG',    status: 'in-transit',   amount: '$89', courier: 'DHL',   updated: '2m ago'  },
  { id: 'DS-20240318-AB43', customer: 'Fiifi Korsah',   from: 'Houston, US', to: 'Accra, GH',   status: 'customs',      amount: '$62', courier: 'FedEx', updated: '8m ago'  },
  { id: 'DS-20240318-MN12', customer: 'Ngozi Chibuike', from: 'DC, US',      to: 'Enugu, NG',   status: 'delivered',    amount: '$74', courier: 'DHL',   updated: '14m ago' },
  { id: 'DS-20240317-PQ78', customer: 'Kwame Asante',   from: 'London, UK',  to: 'Kumasi, GH',  status: 'picked-up',    amount: '$55', courier: 'GIGL',  updated: '22m ago' },
  { id: 'DS-20240317-RT56', customer: 'Emeka Nwosu',    from: 'Atlanta, US', to: 'Abuja, NG',   status: 'pending',      amount: '$91', courier: 'UPS',   updated: '1h ago'  },
  { id: 'DS-20240317-ZX34', customer: 'Amara Diallo',   from: 'Toronto, CA', to: 'Nairobi, KE', status: 'at-warehouse', amount: '$108','courier': 'FedEx','updated': '2h ago' },
]

const activity = [
  { type: 'shipment', text: 'DS-KW91 cleared Lagos customs', time: '2 min ago' },
  { type: 'wallet',   text: 'Wallet funded $200 — Adaeze O.', time: '5 min ago' },
  { type: 'alert',    text: 'DS-AB43 customs hold — docs needed', time: '12 min ago' },
  { type: 'driver',   text: 'Driver Chidi went online · Lagos', time: '18 min ago' },
  { type: 'customs',  text: '3 shipments cleared Heathrow', time: '24 min ago' },
  { type: 'shipment', text: 'DS-MN12 delivered — POD confirmed', time: '31 min ago' },
  { type: 'alert',    text: 'KYC pending: 7 accounts awaiting review', time: '45 min ago' },
  { type: 'wallet',   text: 'COD payout processed — ₦240,000', time: '1 hr ago' },
]

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  'pending':      { label: 'Pending',       cls: 'badge-pending' },
  'picked-up':    { label: 'Picked Up',     cls: 'badge-picked-up' },
  'in-transit':   { label: 'In Transit',    cls: 'badge-in-transit' },
  'at-warehouse': { label: 'At Warehouse',  cls: 'badge-at-warehouse' },
  'customs':      { label: 'Customs',       cls: 'badge-customs' },
  'out-delivery': { label: 'Out Delivery',  cls: 'badge-out-delivery' },
  'delivered':    { label: 'Delivered',     cls: 'badge-delivered' },
  'cancelled':    { label: 'Cancelled',     cls: 'badge-cancelled' },
}

// ── KPI CARD ─────────────────────────────────────────────────
function KpiCard({ icon: Icon, iconClass, value, label, trend, trendUp }: {
  icon: any; iconClass: string; value: string; label: string
  trend: string; trendUp: boolean
}) {
  return (
    <div className="kpi-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div className={`kpi-icon-wrap ${iconClass}`}>
          <Icon size={17} />
        </div>
        <span className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  )
}

// ── CUSTOM TOOLTIP ────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--warm-white)',
      border: '1px solid var(--border-warm)',
      borderRadius: '8px',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-instrument)',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginBottom: '6px', fontWeight: 600 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontSize: '13px', color: 'var(--ink)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--muted-text)' }}>{p.name}:</span>
          <strong>{typeof p.value === 'number' && p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Live status bar */}
      <div style={{
        background: 'var(--ink)',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E' }}>Platform Live</span>
        </div>
        {[
          { label: 'Active shipments', value: '3,248' },
          { label: 'Drivers online', value: '142' },
          { label: 'Customs queue', value: '3' },
          { label: 'Revenue today', value: '$22,100' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,253,249,0.35)' }}>·</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,253,249,0.45)' }}>{item.label}:</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warm-white)' }}>{item.value}</span>
          </div>
        ))}
        <button style={{
          marginLeft: 'auto', background: 'none', border: 'none',
          cursor: 'pointer', color: 'rgba(255,253,249,0.3)',
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px',
        }}>
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard icon={DollarSign}  iconClass="terra"  value="$22,100" label="Revenue today"         trend="+18.4%"  trendUp={true}  />
        <KpiCard icon={Package}     iconClass="gold"   value="89"      label="Shipments today"       trend="+12.1%"  trendUp={true}  />
        <KpiCard icon={CheckCircle} iconClass="green"  value="98.2%"   label="On-time delivery rate" trend="+0.3%"   trendUp={true}  />
        <KpiCard icon={Clock}       iconClass="blue"   value="3.4 days" label="Avg delivery time"   trend="-0.2 days" trendUp={true} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <KpiCard icon={Users}         iconClass="purple" value="12,480"  label="Total customers"       trend="+324 this month" trendUp={true}  />
        <KpiCard icon={Truck}         iconClass="cyan"   value="142"     label="Drivers active now"    trend="+8 vs yesterday" trendUp={true}  />
        <KpiCard icon={AlertTriangle} iconClass="terra"  value="3"       label="Customs holds"         trend="-2 vs yesterday" trendUp={true}  />
        <KpiCard icon={Globe}         iconClass="gold"   value="4"       label="Active corridors"      trend="US, UK, CA → NG, GH, KE" trendUp={true} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>

        {/* Revenue chart */}
        <div className="card-brand" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                Revenue & Volume
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '3px' }}>
                Last 7 days
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--muted-text)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '3px', background: 'var(--terra)', display: 'inline-block', borderRadius: '2px' }} />
                Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '3px', background: 'var(--gold)', display: 'inline-block', borderRadius: '2px' }} />
                Shipments
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="var(--border-warm)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-text)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--muted-text)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted-text)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="var(--terra)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: 'var(--terra)' }} />
              <Line yAxisId="right" type="monotone" dataKey="shipments" name="shipments" stroke="var(--gold)" strokeWidth={2} dot={false} strokeDasharray="5 3" activeDot={{ r: 4, fill: 'var(--gold)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Corridor breakdown */}
        <div className="card-brand" style={{ padding: '22px' }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
            By Corridor
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginBottom: '20px' }}>
            Shipment distribution
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={corridorData} cx="50%" cy="50%" innerRadius={44} outerRadius={66}
                dataKey="value" strokeWidth={2} stroke="var(--warm-white)">
                {corridorData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{
                background: 'var(--warm-white)', border: '1px solid var(--border-warm)',
                borderRadius: '8px', fontSize: '12px',
              }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {corridorData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--ink)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: shipments table + activity feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

        {/* Recent shipments */}
        <div className="card-brand" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
              Recent Shipments
            </div>
            <button className="btn-ghost" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Courier</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map(s => {
                  const st = STATUS_MAP[s.status]
                  return (
                    <tr key={s.id} style={{ cursor: 'pointer' }}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--terra)', fontWeight: 600 }}>
                          {s.id.split('-').slice(-1)[0]}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{s.customer}</td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {s.from} → {s.to}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                          {s.courier}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${st?.cls}`}>{st?.label}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{s.amount}</td>
                      <td style={{ fontSize: '12px', color: 'var(--muted-text)' }}>{s.updated}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="card-brand" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
            Live Activity
          </div>
          <div>
            {activity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.type}`} />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
