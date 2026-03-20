"use client";

import { useEffect, useRef } from "react";

const corridors = [
  {
    from: "🇺🇸",
    to: "🇳🇬",
    name: "US → Nigeria",
    cities: "Atlanta · Houston · New York · DC · Dallas",
    days: "3–7 days",
    label: "Express",
  },
  {
    from: "🇺🇸",
    to: "🇬🇭",
    name: "US → Ghana",
    cities: "All major US cities · Accra · Kumasi",
    days: "4–8 days",
    label: "Express",
  },
  {
    from: "🇺🇸",
    to: "🇰🇪",
    name: "US → Kenya",
    cities: "Nairobi · Mombasa · Kisumu",
    days: "5–9 days",
    label: "Express",
  },
  {
    from: "🇬🇧",
    to: "🇳🇬",
    name: "UK → Nigeria",
    cities: "London · Manchester · Birmingham",
    days: "2–5 days",
    label: "Express",
  },
  {
    from: "🇨🇦",
    to: "🌍",
    name: "Canada → Africa",
    cities: "Coming Q3 2025",
    days: "Soon",
    label: "",
    disabled: true,
  },
];

const facts = [
  "Pickup from your home or office",
  "Delivery to residential addresses",
  "Full customs clearance included",
  "SMS updates to your recipient",
  "Photo proof of delivery every time",
];

export function Corridors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="reveal bg-[#F5EBE0] py-[100px] px-14" id="corridors">
      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C4622D] mb-5 flex items-center gap-3">
        <span className="block w-6 h-[1.5px] bg-[#C4622D]" />
        Active Routes
      </div>
      <h2 className="font-playfair text-[clamp(32px,3.8vw,52px)] font-bold tracking-[-1.5px] leading-[1.08] text-[#1A1208] mb-16">
        Where we deliver.
      </h2>

      <div className="grid grid-cols-[1fr_1.4fr] gap-20 items-start">
        <div className="flex flex-col gap-2">
          {corridors.map((corridor) => (
            <div
              key={corridor.name}
              className={`flex items-center justify-between p-[18px] bg-[#FFFDF9] rounded-[10px] cursor-pointer transition-all duration-200 border border-transparent ${
                corridor.disabled ? "opacity-50 pointer-events-none" : "hover:border-[#C4622D] hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[20px]">
                  <span>{corridor.from}</span>
                  <span className="text-[12px] text-[#C4622D]">→</span>
                  <span>{corridor.to}</span>
                </div>
                <div>
                  <div className="font-playfair text-[16px] font-bold text-[#1A1208]">{corridor.name}</div>
                  <div className="text-[12px] text-[#8C7B6B]">{corridor.cities}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-playfair text-[18px] font-bold ${corridor.disabled ? "text-[#8C7B6B]" : "text-[#C4622D]"}`}>
                  {corridor.days}
                </div>
                {corridor.label && <div className="text-[11px] text-[#8C7B6B]">{corridor.label}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0F0A04] rounded-[20px] p-12 relative overflow-hidden">
          <div
            className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px]"
            style={{ background: "radial-gradient(circle, rgba(196,98,45,0.3), transparent 70%)" }}
          />

          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#D97B48] mb-10">
            Our network
          </div>
          <div className="font-playfair text-[72px] font-black text-[#FFFDF9] leading-tight mb-2">
            40+
          </div>
          <div className="text-[16px] text-white/50 mb-12">
            Countries in delivery network
          </div>

          <div className="h-px bg-white/8 mb-8" />

          <div className="flex flex-col gap-4">
            {facts.map((fact) => (
              <div key={fact} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9972B] flex-shrink-0" />
                <span className="text-[14px] text-white/60">{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
