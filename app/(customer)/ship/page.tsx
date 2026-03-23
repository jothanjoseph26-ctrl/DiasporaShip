'use client'

import { useRouter } from 'next/navigation'
import { Globe2, Truck, Building2, ArrowRight, Clock, MapPin, Plane, MapPinned } from 'lucide-react'

export default function ShipEntryPage() {
  const router = useRouter()

  const choices = [
    {
      icon: Plane,
      iconBg: 'var(--terra-pale)',
      iconColor: 'var(--terra)',
      accentColor: 'var(--terra)',
      title: 'International shipping',
      subtitle: 'Cross-border delivery',
      description: 'Send packages from the US or UK to Nigeria, Ghana, Kenya and more. Includes customs clearance and air freight.',
      bullets: ['US → Nigeria · Ghana · Kenya', 'UK → Nigeria · Ghana', 'China → Nigeria'],
      ctaLabel: 'Start international booking',
      href: '/customer/shipments/new?type=international',
      badge: 'Air freight',
    },
    {
      icon: Truck,
      iconBg: 'var(--gold-pale)',
      iconColor: 'var(--gold-dark)',
      accentColor: 'var(--gold)',
      title: 'Domestic delivery',
      subtitle: 'Within Nigeria, Ghana or Kenya',
      description: 'Send parcels between cities within the same country. Road freight, fast turnaround, pay in local currency.',
      bullets: ['Lagos → Abuja · Port Harcourt · Kano', 'Accra → Kumasi · Tamale', 'Nairobi → Mombasa · Kisumu'],
      ctaLabel: 'Start domestic booking',
      href: '/customer/shipments/new?type=domestic',
      badge: 'Road freight',
    },
    {
      icon: Building2,
      iconBg: 'var(--cream-dark)',
      iconColor: 'var(--ink-muted)',
      accentColor: 'var(--ink)',
      title: 'Visit our office',
      subtitle: 'Bring your package in person',
      description: 'Walk into any of our offices. Our staff will weigh your package, register your shipment, and issue a receipt on the spot.',
      bullets: ['Atlanta, GA — 123 Commerce St', 'Lagos — 15 Admiralty Way, Lekki', 'London — 100 Liverpool St'],
      ctaLabel: 'Find nearest office',
      href: '/customer/offices',
      badge: 'Walk-in',
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
              className="group text-left rounded-2xl border-2 border-[var(--border-warm)]
                bg-[var(--warm-white)] p-6
                hover:border-[var(--terra)] hover:shadow-md
                transition-all duration-200
                flex flex-col"
              style={{}}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: choice.iconBg }}
                >
                  <Icon size={22} style={{ color: choice.iconColor }} />
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ 
                    backgroundColor: choice.iconBg, 
                    color: choice.iconColor 
                  }}
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
                      style={{ backgroundColor: choice.accentColor }}
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
