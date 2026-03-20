"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: "🤖",
    title: "AI pricing engine",
    desc: "Instant, accurate rates calculated from weight, route, customs complexity, fuel surcharges, and seasonal demand. No phone calls. No waiting.",
    variant: "terra" as const,
  },
  {
    icon: "📍",
    title: "Live GPS tracking",
    desc: "Watch your driver move on a live map. Know the moment it's collected, when it clears customs, and when the driver is 10 minutes from the door.",
    variant: "gold" as const,
  },
  {
    icon: "📋",
    title: "Customs, done for you",
    desc: "We generate commercial invoices, packing lists, airway bills, and submit export and import declarations. You do nothing.",
    variant: "warm" as const,
  },
  {
    icon: "🏠",
    title: "True door-to-door",
    desc: "Pickup from your home or office in the US. Delivered to any residential address in Nigeria, Ghana, or Kenya. Not a depot. Not an agent office.",
    variant: "gold" as const,
  },
  {
    icon: "💳",
    title: "Multi-currency wallet",
    desc: "Fund in USD, NGN, GHS, or KES. Pay for shipments, receive COD collections, and manage your entire logistics budget from one account.",
    variant: "terra" as const,
  },
  {
    icon: "🏢",
    title: "Business accounts",
    desc: "Corporate credit, monthly invoicing, bulk booking, warehouse-to-door fulfillment, and a dedicated account manager for high-volume shippers.",
    variant: "warm" as const,
  },
];

export function Features() {
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

  const iconBgClass = {
    terra: "bg-[#C4622D]/15",
    gold: "bg-[#C9972B]/15",
    warm: "bg-white/6",
  };

  return (
    <section ref={sectionRef} className="reveal bg-[#1A1208] py-[100px] px-14" id="business">
      <div className="flex justify-between items-end mb-16">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#D97B48] mb-5 flex items-center gap-3">
            <span className="block w-6 h-[1.5px] bg-[#D97B48]" />
            Why DiasporaShip
          </div>
          <h2 className="font-playfair text-[clamp(32px,3.8vw,52px)] font-bold tracking-[-1.5px] leading-[1.08] text-[#FFFDF9]">
            Built for <em className="italic text-[#E8B84B]">us.</em><br />By people who<br />understand.
          </h2>
        </div>
        <p className="text-[15px] text-white/45 leading-[1.7] max-w-[320px]">
          Every feature was designed around the real experience of the African diaspora — not a generic courier platform that treats Africa as an afterthought.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-9 bg-[#1A1208] transition-colors duration-250 hover:bg-[#1F1409] cursor-default"
          >
            <div className={`w-11.5 h-11.5 flex items-center justify-center rounded-[10px] text-[22px] mb-5.5 ${iconBgClass[feature.variant]}`}>
              {feature.icon}
            </div>
            <h3 className="font-playfair text-[18px] font-bold text-[#FFFDF9] mb-2.5">{feature.title}</h3>
            <p className="text-[13.5px] text-white/45 leading-[1.7]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
