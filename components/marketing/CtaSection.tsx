'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const baseRates: Record<string, Record<string, number>> = {
  'United States 🇺🇸': { 'Nigeria 🇳🇬': 8.50, 'Ghana 🇬🇭': 9.00, 'Kenya 🇰🇪': 10.00 },
  'United Kingdom 🇬🇧': { 'Nigeria 🇳🇬': 7.50, 'Ghana 🇬🇭': 8.00, 'Kenya 🇰🇪': 9.50 },
  'Canada 🇨🇦': { 'Nigeria 🇳🇬': 9.00, 'Ghana 🇬🇭': 9.50, 'Kenya 🇰🇪': 11.00 },
};

const serviceMultipliers: Record<string, number> = {
  'Express (3–5 days)': 1.5,
  'Standard (5–10 days)': 1.0,
  'Economy': 0.75,
};

const deliveryDays: Record<string, string> = {
  'Express (3–5 days)': '3–5 business days',
  'Standard (5–10 days)': '5–10 business days',
  'Economy': '14–21 business days',
};

export function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [from, setFrom] = useState('United States 🇺🇸');
  const [to, setTo] = useState('Nigeria 🇳🇬');
  const [weight, setWeight] = useState('');
  const [service, setService] = useState('Express (3–5 days)');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ price: number; days: string } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!from) errs.from = 'Please select origin country';
    if (!to) errs.to = 'Please select destination country';
    if (from && to && from === to) errs.to = 'Origin and destination must be different';
    const w = parseFloat(weight);
    if (!weight) errs.weight = 'Weight is required';
    else if (isNaN(w) || w <= 0) errs.weight = 'Weight must be greater than 0';
    else if (w > 10000) errs.weight = 'Maximum weight is 10,000 kg';
    return errs;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const base = baseRates[from]?.[to] ?? 8.50;
      const mult = serviceMultipliers[service] ?? 1.0;
      const estimatedPrice = base * (parseFloat(weight) || 1) * mult;
      setResult({ price: estimatedPrice, days: deliveryDays[service] ?? '5–10 business days' });
      setIsLoading(false);
    }, 900);
  };

  const handleBook = () => {
    router.push('/customer/shipments/new');
  };

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section ref={sectionRef} className="reveal bg-[#0F0A04] py-[100px] px-14 grid grid-cols-2 gap-20 items-start relative overflow-hidden">
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
          <button
            onClick={scrollToCalculator}
            className="bg-[#E8B84B] hover:bg-[#C9972B] text-[#1A1208] font-semibold px-8 py-4 rounded-md transition-all hover:-translate-y-0.5"
          >
            Get a Free Quote
          </button>
          <a
            href="https://wa.me/14045551234"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 bg-transparent border border-white/15 hover:border-white/40 px-6 py-3.5 rounded-md transition-all text-[14px] font-medium flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Support
          </a>
        </div>
      </div>

      <div ref={calculatorRef} className="bg-white/5 border border-white/10 rounded-[18px] p-9 relative">
        <div className="font-playfair text-[18px] font-bold text-[#FFFDF9] mb-6">
          Get your instant quote
        </div>

        <form onSubmit={handleCalculate} noValidate>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">From</div>
              <select
                value={from}
                onChange={(e) => { setFrom(e.target.value); setResult(null); }}
                className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors"
              >
                <option>United States 🇺🇸</option>
                <option>United Kingdom 🇬🇧</option>
                <option>Canada 🇨🇦</option>
              </select>
              {errors.from && <p className="text-[11px] text-red-400 mt-1">{errors.from}</p>}
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">To</div>
              <select
                value={to}
                onChange={(e) => { setTo(e.target.value); setResult(null); }}
                className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors"
              >
                <option>Nigeria 🇳🇬</option>
                <option>Ghana 🇬🇭</option>
                <option>Kenya 🇰🇪</option>
              </select>
              {errors.to && <p className="text-[11px] text-red-400 mt-1">{errors.to}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">Weight (kg)</div>
              <input
                type="number"
                placeholder="e.g. 2.5"
                min="0.1"
                max="10000"
                step="0.1"
                value={weight}
                onChange={(e) => { setWeight(e.target.value); setResult(null); }}
                className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors placeholder:text-white/25"
              />
              {errors.weight && <p className="text-[11px] text-red-400 mt-1">{errors.weight}</p>}
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/40 mb-1.5">Service</div>
              <select
                value={service}
                onChange={(e) => { setService(e.target.value); setResult(null); }}
                className="w-full bg-white/7 border border-white/12 rounded-lg py-2.5 px-3.5 text-[14px] text-[#FFFDF9] font-instrument outline-none focus:border-[#C9972B]/50 transition-colors"
              >
                <option>Express (3–5 days)</option>
                <option>Standard (5–10 days)</option>
                <option>Economy</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-[#C4622D] border-none rounded-lg text-[14px] font-semibold text-[#FFFDF9] cursor-pointer font-instrument hover:bg-[#D97B48] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Calculating...' : 'Calculate My Rate →'}
          </button>
        </form>

        {result && (
          <div className="mt-4 bg-[#C4622D]/15 border border-[#C4622D]/30 rounded-xl p-5">
            <div className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#E8B84B] mb-2">Estimated Rate</div>
            <div className="font-playfair text-3xl font-bold text-[#FFFDF9] mb-1">
              ${result.price.toFixed(2)}
            </div>
            <div className="text-[12px] text-white/45 mb-4">
              {result.days} · {from.split(' ')[0]} → {to.split(' ')[0]}
            </div>
            <button
              onClick={handleBook}
              className="w-full py-3 bg-[#C4622D] hover:bg-[#D97B48] text-[#FFFDF9] font-semibold text-[14px] rounded-lg transition-colors"
            >
              Book This Shipment →
            </button>
            <p className="text-[10px] text-white/25 mt-2 text-center">
              Prices are estimates. Final rate confirmed at booking.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
