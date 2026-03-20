"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Get your instant quote",
    desc: "Enter package details and destination. Our AI calculates the best rate in seconds — weight, route, customs, all included. No surprises.",
  },
  {
    num: "02",
    title: "Book and pay securely",
    desc: "Choose your service — standard, express, or freight. Pay with card, bank transfer, or your DiasporaShip wallet in USD, NGN, or GHS.",
  },
  {
    num: "03",
    title: "We come to your door",
    desc: "Our driver collects from your address. We handle customs documents, export clearance, and all the paperwork you'd otherwise spend hours on.",
  },
  {
    num: "04",
    title: "Track every step live",
    desc: "Follow your package on a live map from pickup to your recipient's door. They get SMS updates. You get peace of mind.",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
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
    <section ref={sectionRef} className="reveal bg-[#FFFDF9] py-[100px] px-14" id="how-it-works">
      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C4622D] mb-5 flex items-center gap-3">
        <span className="block w-6 h-[1.5px] bg-[#C4622D]" />
        Simple Process
      </div>
      <h2 className="font-playfair text-[clamp(32px,3.8vw,52px)] font-bold tracking-[-1.5px] leading-[1.08] text-[#1A1208] mb-16">
        Ship home in<br /><em className="italic text-[#C4622D]">four steps.</em>
      </h2>

      <div className="grid grid-cols-2 gap-20 items-center">
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`flex gap-6 py-7 cursor-pointer transition-all duration-200 border-b border-[#E8DDD0] ${
                i === 0 ? "pt-0" : ""
              } ${i === steps.length - 1 ? "border-b-0" : ""} ${activeStep === i ? "pl-2" : ""}`}
              onClick={() => setActiveStep(i)}
              onMouseEnter={() => setActiveStep(i)}
            >
              <div className={`font-playfair text-[38px] font-bold text-[#E8DDD0] leading-tight w-11 flex-shrink-0 transition-colors ${activeStep === i ? "text-[#C4622D]" : ""}`}>
                {step.num}
              </div>
              <div>
                <h3 className="font-playfair text-[19px] font-bold text-[#1A1208] mb-1.5">{step.title}</h3>
                <p className="text-[14px] text-[#8C7B6B] leading-[1.65]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0F0A04] rounded-[20px] p-10 relative overflow-hidden min-h-[480px] flex flex-col justify-end">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 40%, rgba(196,98,45,0.3) 0%, transparent 60%)",
            }}
          />

          <div className="absolute top-10 left-10 right-10 flex justify-between items-center">
            <div className="text-center">
              <div className="text-[28px] mb-1">🇺🇸</div>
              <div className="text-[11px] font-medium text-white/50">Atlanta</div>
            </div>
            <div className="text-[#E8B84B] animate-slide">——→</div>
            <div className="text-center">
              <div className="text-[28px] mb-1">✈️</div>
              <div className="text-[11px] font-medium text-white/50">In flight</div>
            </div>
            <div className="text-[#E8B84B] animate-slide">——→</div>
            <div className="text-center">
              <div className="text-[28px] mb-1">🇳🇬</div>
              <div className="text-[11px] font-medium text-white/50">Lagos</div>
            </div>
          </div>

          <div className="bg-white/7 border border-white/12 rounded-xl p-5 relative">
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/40 mb-3">
              Live tracking — DS-20240318-AK72
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#E8B84B]" />
                <span className="text-[13px] text-white/70">Package collected · Atlanta Hub</span>
                <span className="text-[11px] text-white/30 ml-auto">Mar 15</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#E8B84B]" />
                <span className="text-[13px] text-white/70">Export cleared · JFK New York</span>
                <span className="text-[11px] text-white/30 ml-auto">Mar 16</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D97B48] animate-blink" />
                <span className="text-[13px] text-[#D97B48] font-medium">In flight — arrives Lagos tomorrow</span>
                <span className="text-[11px] text-[#D97B48] ml-auto">Now</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <span className="text-[13px] text-white/70">Out for delivery · Lagos</span>
                <span className="text-[11px] text-white/30 ml-auto">Mar 18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
