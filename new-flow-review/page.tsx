'use client'

import { useRouter } from 'next/navigation'
import { Globe2, Truck, Building2, ArrowRight, Clock, MapPin } from 'lucide-react'

// ── ENTRY POINT ───────────────────────────────────────────────
// /customer/ship
// Replaces the confusing "Add Shipment" button.
// Three clear choices: International | Domestic | Visit Office

export default function ShipEntryPage() {
  const router = useRouter()

  const choices = [
    {
      icon: Globe2,
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      accentColor: '#185FA5',
      title: 'International shipping',
      subtitle: 'Cross-border delivery',
      description: 'Send packages from the US or UK to Nigeria, Ghana, Kenya and more. Includes customs clearance and air freight.',
      bullets: ['US → Nigeria · Ghana · Kenya', 'UK → Nigeria · Ghana', 'China → Nigeria'],
      ctaLabel: 'Start international booking',
      href: '/customer/shipments/new?type=international',
      badge: 'Air freight',
      badgeBg: '#E6F1FB',
      badgeColor: '#0C447C',
    },
    {
      icon: Truck,
      iconBg: '#E1F5EE',
      iconColor: '#0F6E56',
      accentColor: '#0F6E56',
      title: 'Domestic delivery',
      subtitle: 'Within Nigeria, Ghana or Kenya',
      description: 'Send parcels between cities within the same country. Road freight, fast turnaround, pay in local currency.',
      bullets: ['Lagos → Abuja · Port Harcourt · Kano', 'Accra → Kumasi · Tamale', 'Nairobi → Mombasa · Kisumu'],
      ctaLabel: 'Start domestic booking',
      href: '/customer/shipments/new?type=domestic',
      badge: 'Road freight',
      badgeBg: '#E1F5EE',
      badgeColor: '#085041',
    },
    {
      icon: Building2,
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
      accentColor: '#854F0B',
      title: 'Visit our office',
      subtitle: 'Bring your package in person',
      description: 'Walk into any of our offices. Our staff will weigh your package, register your shipment, and issue a receipt on the spot.',
      bullets: ['Atlanta, GA — 123 Commerce St', 'Lagos — 15 Admiralty Way, Lekki', 'London — 100 Liverpool St'],
      ctaLabel: 'Find nearest office',
      href: '/customer/offices',
      badge: 'Walk-in',
      badgeBg: '#FAEEDA',
      badgeColor: '#633806',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[var(--ink)] mb-2"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Send something
        </h1>
        <p className="text-[var(--muted-text)] text-base">
          Choose how you want to ship. We handle the rest.
        </p>
      </div>

      {/* Three choice cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {choices.map((choice) => {
          const Icon = choice.icon
          return (
            <button
              key={choice.href}
              onClick={() => router.push(choice.href)}
              className="group text-left rounded-2xl border border-[var(--border-warm)]
                bg-[var(--warm-white)] p-6
                hover:border-[var(--terra)] hover:shadow-sm
                transition-all duration-200
                flex flex-col"
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: choice.iconBg }}
                >
                  <Icon size={20} color={choice.iconColor} />
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: choice.badgeBg, color: choice.badgeColor }}
                >
                  {choice.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-semibold text-[var(--ink)] mb-1">
                {choice.title}
              </h2>
              <p className="text-[12px] text-[var(--muted-text)] mb-3">
                {choice.subtitle}
              </p>

              {/* Description */}
              <p className="text-[13px] text-[var(--muted-text)] leading-relaxed mb-4 flex-1">
                {choice.description}
              </p>

              {/* Bullet routes */}
              <div className="space-y-1.5 mb-5">
                {choice.bullets.map((b, bi) => (
                  <div key={bi} className="flex items-start gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: choice.accentColor }}
                    />
                    <span className="text-[12px] text-[var(--muted-text)]">{b}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="flex items-center gap-2 text-[13px] font-semibold
                  group-hover:gap-3 transition-all duration-200"
                style={{ color: choice.accentColor }}
              >
                {choice.ctaLabel}
                <ArrowRight size={14} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Quick info strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Clock, text: 'Same-day domestic available' },
          { icon: MapPin, text: '3 countries covered' },
          { icon: Globe2, text: 'Customs handled for you' },
          { icon: Building2, text: 'Walk-in at any office' },
        ].map(({ icon: Ic, text }) => (
          <div
            key={text}
            className="flex items-center gap-2.5 rounded-xl
              bg-[var(--cream)] border border-[var(--border-warm)]
              px-3 py-2.5"
          >
            <Ic size={14} className="text-[var(--terra)] flex-shrink-0" />
            <span className="text-[12px] text-[var(--muted-text)]">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
