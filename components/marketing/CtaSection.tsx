"use client";

import { useEffect, useRef } from "react";

export function CtaSection() {
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
    <section ref={sectionRef} className="reveal bg-[#0F0A04] py-[100px] px-14 grid grid-cols-2 gap-20 items-center relative overflow-hidden">
      <div
        className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,98,45,0.25), transparent 60%)" }}
      />
      <div
        className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,151,43,0.15), transparent 60%)" }}
      />

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#D97B48] mb-6 flex items-center gap-3">
          <span className="block w-6 h-[1.5px] bg-[#D97B48]" />
          Ready to ship?
        </div>
        <h2 className="font-playfair text-[clamp(34px,4vw,52px)] font-black text-[#FFFDF9] tracking-[-2px] leading-[1.05] mb-5">
          Send something<br /><em className="italic text-[#E8B84B]">home today.</em>
        </h2>
        <p className="text-[16px] text-white/45 leading-[1.7] mb-10 max-w-[420px]">
          Get a free quote in 60 seconds. No account needed. Our team is available 7 days a week to help you ship anything, anywhere in Africa.
        </p>
        <div className="flex gap-3">
          <button className="bg-[#E8B84B] hover:bg-[#C9972B] text-[#1A1208] font-semibold px-8 py-4 rounded-md transition-all hover:-translate-y-0.5">
            Get a Free Quote
          </button>
          <button className="text-white/60 bg-transparent border border-white/15 hover:border-white/40 px-6 py-3.5 rounded-md transition-all text-[14px] font-medium">
            WhatsApp Support
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[18px] p-9 relative">
        <div className="font-playfair text-[18px] font-bold text-[#FFFDF9] mb-6">
          Get your instant quote
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">From</div>
            <select className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors">
              <option>United States 🇺🇸</option>
              <option>United Kingdom 🇬🇧</option>
              <option>Canada 🇨🇦</option>
            </select>
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">To</div>
            <select className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors">
              <option>Nigeria 🇳🇬</option>
              <option>Ghana 🇬🇭</option>
              <option>Kenya 🇰🇪</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">Weight (kg)</div>
            <input
              type="number"
              placeholder="e.g. 2.5"
              className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors placeholder:text-white/25"
            />
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">Service</div>
            <select className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors">
              <option>Express (3–5 days)</option>
              <option>Standard (5–10 days)</option>
              <option>Economy</option>
            </select>
          </div>
        </div>

        <button className="w-full py-3.5 mt-2 bg-[#C4622D] border-none rounded-lg text-[14px] font-semibold text-[#FFFDF9] cursor-pointer font-instrument hover:bg-[#D97B48] transition-colors">
          Calculate My Rate →
        </button>
      </div>
    </section>
  );
}
