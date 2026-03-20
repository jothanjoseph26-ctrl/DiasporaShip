# DiasporaShip — Brand Integration Guide

## Files Generated

### 1. `src/styles/globals.css`
The single source of truth for the entire design system.
- All CSS variables (--terra, --gold, --ink, --cream, etc.)
- shadcn/ui overrides (--primary, --secondary, --muted, etc.)
- All component utility classes (.kpi-card, .badge-*, .btn-*, .data-table, etc.)
- Portal-specific accent variables
- Recharts overrides for brand colors
- Scrollbar styling

**How to use in Next.js:**
```tsx
// src/app/layout.tsx
import '@/styles/globals.css'
```

---

### 2. `src/app/admin/layout.tsx`
Full admin portal layout with:
- Brand ink (#1A1208) sidebar
- Terra (#C4622D) active nav items
- Warm-white topbar
- All 4 nav sections: Overview, Operations, People, System
- Badge counts on nav items
- User footer with initials avatar

---

### 3. `src/app/admin/page.tsx`
Complete admin dashboard with:
- Live status bar (dark, real-time feel)
- 8 KPI cards with brand icon colors
- Revenue + shipments line chart (Recharts, brand colors)
- Corridor pie chart
- Recent shipments table with brand status badges
- Live activity feed with color-coded dots

---

### 4. `src/components/shared/PortalShell.tsx`
Reusable sidebar + topbar for all 8 portals.
Each portal passes its own `PortalConfig`:
- Portal name
- Accent color (unique per portal)
- Active nav background
- User info
- Nav structure

**Portal accent colors:**
| Portal    | Color   | Hex       |
|-----------|---------|-----------|
| Customer  | Terra   | #C4622D   |
| Driver    | Emerald | #059669   |
| Dispatch  | Blue    | #2563EB   |
| Admin     | Terra   | #C4622D   |
| Warehouse | Violet  | #7C3AED   |
| Agent     | Gold    | #C9972B   |
| Customs   | Cyan    | #0891B2   |
| Analytics | Pink    | #DB2777   |

---

### 5. `src/components/shared/AllPortalLayouts.tsx`
Layout components for all remaining portals:
- AgentLayout
- CustomsLayout
- CustomerLayout
- DriverLayout
- AnalyticsLayout

Copy each into its own `layout.tsx` file:
```
src/app/agent/layout.tsx      ← AgentLayout
src/app/customs/layout.tsx    ← CustomsLayout
src/app/customer/layout.tsx   ← CustomerLayout
src/app/driver/layout.tsx     ← DriverLayout
src/app/analytics/layout.tsx  ← AnalyticsLayout
```

---

### 6. `tailwind.config.ts`
Brand tokens as Tailwind classes:
- `text-terra`, `bg-terra`, `bg-terra-pale`
- `text-gold`, `bg-gold-pale`
- `bg-ink`, `text-warm-white`
- `font-playfair`, `font-instrument`
- `shadow-card`, `shadow-terra`
- `animate-live-pulse`, `animate-marquee`
- `portal-customer`, `portal-driver`, etc.

---

## How to Apply to Existing Components

### Replace generic colors:
```tsx
// BEFORE (generic shadcn)
<Button className="bg-blue-600">Ship Now</Button>

// AFTER (brand)
<button className="btn-terra">Ship Now</button>
// or with Tailwind:
<Button className="bg-terra text-warm-white hover:bg-terra-light">Ship Now</Button>
```

### Replace status badges:
```tsx
// BEFORE
<Badge variant="default">In Transit</Badge>

// AFTER
<span className="badge badge-in-transit">In Transit</span>
```

### Replace KPI cards:
```tsx
// BEFORE
<Card className="bg-white">
  <CardContent>...</CardContent>
</Card>

// AFTER
<div className="kpi-card">
  <div className="kpi-icon-wrap terra"><Package size={17} /></div>
  <div className="kpi-value">89</div>
  <div className="kpi-label">Shipments today</div>
</div>
```

### Replace table rows hover:
```tsx
// BEFORE
<tr className="hover:bg-gray-50">

// AFTER — already handled in globals.css .data-table tbody tr:hover
<tr>  {/* hover:bg-terra-pale applied automatically */}
```

---

## Connecting to Existing Store

The admin page uses mock data inline.
To connect to your existing `store/index.ts`:

```tsx
// In admin/page.tsx
import { useStore } from '@/store'

export default function AdminDashboard() {
  const { shipments, drivers, kpis } = useStore()
  // Replace mock data arrays with store data
}
```

---

## Font Setup (layout.tsx)

```tsx
import { Playfair_Display, Instrument_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```
