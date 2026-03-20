"use client";

import { useEffect, useRef } from "react";

const plans = [
  {
    tier: "Standard",
    from: "From",
    price: "$29",
    unit: "per shipment · US → Nigeria",
    features: [
      "Door-to-door delivery",
      "5–10 day delivery",
      "Live tracking",
      "SMS to recipient",
      "Photo proof of delivery",
    ],
    featured: false,
    btnText: "Get a Quote",
  },
  {
    tier: "Express",
    from: "From",
    price: "$59",
    unit: "per shipment · US → Nigeria",
    features: [
      "Door-to-door delivery",
      "3–5 day delivery",
      "Live GPS tracking",
      "Customs handled",
      "Priority support",
    ],
    featured: true,
    btnText: "Get a Quote",
  },
  {
    tier: "Business",
    from: "Custom pricing",
    price: "Talk to us",
    unit: "Volume discounts available",
    features: [
      "Dedicated account manager",
      "Monthly invoicing",
      "Bulk booking API",
      "Warehouse fulfillment",
      "Corporate credit line",
    ],
    featured: false,
    btnText: "Contact Sales",
  },
];

export function Pricing() {
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
    <section ref={sectionRef} className="reveal bg-[#FBF3DC] py-[100px] px-14" id="pricing">
      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C4622D] mb-5 flex items-center gap-3">
        <span className="block w-6 h-[1.5px] bg-[#C4622D]" />
        Transparent Pricing
      </div>
      <h2 className="font-playfair text-[clamp(32px,3.8vw,52px)] font-bold tracking-[-1.5px] leading-[1.08] text-[#1A1208] mb-16">
        Pay for what<br /><em className="italic text-[#C4622D]">you need.</em>
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-2xl p-9 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(26,18,8,0.10)] ${
              plan.featured
                ? "bg-[#1A1208] border border-[#1A1208]"
                : "bg-[#FFFDF9] border border-[#E8DDD0]"
            }`}
          >
            <div
              className={`text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 ${
                plan.featured ? "text-[#E8B84B]" : "text-[#8C7B6B]"
              }`}
            >
              {plan.tier}
            </div>
            <div
              className={`text-[12px] mb-1 ${
                plan.featured ? "text-white/40" : "text-[#8C7B6B]"
              }`}
            >
              {plan.from}
            </div>
            <div
              className={`font-playfair font-bold leading-tight mb-1 ${
                plan.tier === "Business" ? "text-[32px] pt-1.5" : "text-[44px]"
              } ${plan.featured ? "text-[#FFFDF9]" : "text-[#1A1208]"}`}
            >
              {plan.price}
            </div>
            <div
              className={`text-[13px] mb-7 ${
                plan.featured ? "text-white/40" : "text-[#8C7B6B]"
              }`}
            >
              {plan.unit}
            </div>

            <div className={`h-px mb-6 ${plan.featured ? "bg-white/10" : "bg-[#E8DDD0]"}`} />

            <div className="flex flex-col gap-3 mb-8">
              {plan.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-[13.5px]">
                  <span className={plan.featured ? "text-[#E8B84B]" : "text-[#C4622D]"}>✓</span>
                  <span className={plan.featured ? "text-white/80" : "text-[#1A1208]"}>{feat}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-3.5 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
                plan.featured
                  ? "bg-[#C4622D] border border-[#C4622D] text-[#FFFDF9] hover:bg-[#D97B48]"
                  : "border-1.5 border-[#E8DDD0] bg-transparent text-[#1A1208] hover:border-[#C4622D] hover:text-[#C4622D]"
              }`}
            >
              {plan.btnText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
