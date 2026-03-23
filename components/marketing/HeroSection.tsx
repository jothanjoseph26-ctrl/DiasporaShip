"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const steps = [
  {
    label: "Step 1 of 4 — Atlanta, US",
    title: "Package collected from your door",
    desc: "Our driver picked up your shipment from your Atlanta address. Label printed, customs docs generated. Heading to our hub.",
  },
  {
    label: "Step 2 of 4 — In Flight",
    title: "Cleared customs · Now in the air",
    desc: "Export cleared at JFK. Your package is on a direct flight to Lagos. Live updates every hour. ETA: tomorrow morning.",
  },
  {
    label: "Step 3 of 4 — Lagos, Nigeria",
    title: "Arrived at our Lagos warehouse",
    desc: "Package scanned in at our Ikeja hub. Import clearance complete. Our Lagos driver is loading up for delivery today.",
  },
  {
    label: "Step 4 of 4 — Delivered ✓",
    title: "Successfully delivered to Lekki",
    desc: "Delivered in 3 days, 4 hours. Photo proof taken. Recipient signed. Your family received it safely — right at their door.",
  },
];

const cellImages = [
  "/images/cell-1-atlanta-collected.jpg",
  "/images/cell-2-inflight-atlantic.jpg",
  "/images/cell-3-lagos-hub.jpg",
  "/images/cell-4-lagos-delivered.jpg",
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cell4Ref = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % 4);
    }, 3200);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (active === 3) {
      if (cell4Ref.current && heroRef.current) {
        const cellRect = cell4Ref.current.getBoundingClientRect();
        const heroRect = heroRef.current.getBoundingClientRect();
        setBurstOrigin({
          x: cellRect.left - heroRect.left + cellRect.width / 2,
          y: cellRect.top - heroRect.top + cellRect.height / 2,
        });
      }
      setConfettiKey((prev) => prev + 1);
    }
  }, [active]);

  const handleClick = (i: number) => {
    setActive(i);
    startTimer();
  };

  const step = steps[active];

  return (
    <div ref={heroRef} className="hero min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
      {/* LEFT: INTERACTIVE 4-PHOTO GRID */}
      <div className="photo-grid grid grid-cols-2 gap-[3px] bg-stone-950 relative overflow-hidden">
        {[0, 1, 2, 3].map((i) => {
          const isActive = active === i;
          const isHovered = hovered === i;
          const cellColors = [
            "ring-amber-400",
            "ring-orange-400",
            "ring-blue-400",
            "ring-green-400",
          ];
          const dotColors = ["bg-amber-400", "bg-orange-400", "bg-blue-400", "bg-green-400"];
          const statusTexts = [
            "Package Collected",
            "Customs Cleared · In Transit",
            "At Lagos Warehouse",
            "Delivered — Photo Confirmed",
          ];
          const subTexts = [
            "Driver picked up from your door · Atlanta Hub",
            "JFK → LOS · Estimated arrival tomorrow",
            "Import cleared · Out for delivery today",
            "Signed by recipient · 3 days, 4 hrs total",
          ];
          const flags = ["🇺🇸", "✈️", "🇳🇬", "🏠"];
          const cities = ["Atlanta, US", "In Flight", "Lagos Hub", "Lekki, Lagos"];
          const times = ["9:42 AM", "6h 20m", "8:15 AM", "2:38 PM"];

          return (
            <div
              key={i}
              ref={i === 3 ? cell4Ref : undefined}
              role="button"
              tabIndex={0}
              aria-label={`View ${statusTexts[i]} step`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(i); }}}
              className={`
                relative cursor-pointer group
                transition-all duration-500
                ${isActive ? `ring-2 ${cellColors[i]} ring-inset` : ""}
              `}
              style={{ minHeight: "50vh" }}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Photo background with real image — this div clips the photo */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={cellImages[i]}
                  alt={statusTexts[i]}
                  fill
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    !imagesLoaded ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImagesLoaded(true)}
                  priority={i === 0}
                />
                {/* Fallback gradient while/if image not loaded */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    imagesLoaded ? "opacity-0" : "opacity-100"
                  }
                    ${i === 0 ? "bg-gradient-to-br from-amber-900 to-orange-950" : ""}
                    ${i === 1 ? "bg-gradient-to-br from-blue-950 to-slate-900" : ""}
                    ${i === 2 ? "bg-gradient-to-br from-stone-900 to-orange-950" : ""}
                    ${i === 3 ? "bg-gradient-to-br from-slate-900 to-green-950" : ""}
                  `}
                />
              </div>

              {/* Dark overlay */}
              <div
                className={`
                  absolute inset-0 transition-all duration-400
                  ${isActive || isHovered ? "bg-black/20" : "bg-black/50"}
                `}
              />

              {/* Step tag — top right */}
              <div
                className={`
                  absolute top-3 right-3 z-10
                  text-[10px] font-bold tracking-widest uppercase
                  px-2.5 py-1 rounded-full border
                  transition-all duration-300
                  ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                  ${
                    i === 0
                      ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                      : i === 1
                      ? "text-orange-400 border-orange-400/30 bg-orange-400/10"
                      : i === 2
                      ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                      : "text-green-400 border-green-400/30 bg-green-400/10"
                  }
                `}
              >
                {i === 3 ? "Delivered ✓" : `Step ${i + 1}`}
              </div>

              {/* City label — top left */}
              <div
                className={`
                  absolute top-4 left-4 z-10
                  flex items-center gap-2
                  transition-all duration-300
                  ${isActive || isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                `}
              >
                <span className="text-sm">{flags[i]}</span>
                <span className="text-xs font-bold tracking-widest uppercase text-white/90">
                  {cities[i]}
                </span>
                <span className="text-[10px] text-white/40 ml-auto">{times[i]}</span>
              </div>

              {/* Info card — bottom */}
              <div
                className={`
                  absolute bottom-4 left-4 right-4 z-10
                  bg-black/75 border border-white/10
                  rounded-xl p-3 backdrop-blur-xl
                  transition-all duration-350
                  ${isActive || isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
                `}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      dotColors[i]
                    } ${i === 3 ? "animate-pulse" : ""}`}
                  />
                  <span className="text-[12px] font-semibold text-white/88">
                    {statusTexts[i]}
                  </span>
                </div>
                <p className="text-[10.5px] text-white/40 leading-relaxed">
                  {subTexts[i]}
                </p>
              </div>

              {/* Confetti removed — hero-level burst handles this */}
            </div>
          );
        })}

        {/* Progress dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Go to step ${i + 1}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(i); }}}
              onClick={() => handleClick(i)}
              className={`
                h-1.5 rounded-full cursor-pointer transition-all duration-300
                ${active === i ? "w-4 bg-amber-400" : "w-1.5 bg-white/25"}
              `}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: TEXT PANEL */}
      <div className="text-panel bg-[#FAF6EF] flex flex-col justify-center px-12 py-20 relative">
        <div className="relative">
          <div className="text-[10.5px] font-semibold tracking-widest uppercase text-[#C4622D] mb-6 flex items-center gap-3">
            <span className="block w-6 h-[1.5px] bg-[#C4622D]"></span>
            US · UK · Canada to Africa
          </div>

          <h1 className="font-playfair text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-[#1A1208] mb-6">
            Every package
            <br />
            carries a piece
            <br />
            of <em className="italic text-[#C4622D]">home.</em>
          </h1>
        </div>

        {/* Journey steps indicator */}
        <div className="flex items-center gap-0 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                role="button"
                tabIndex={0}
                aria-label={`View step ${i + 1}: ${i === 0 ? "Collected" : i === 1 ? "In Flight" : i === 2 ? "At Hub" : "Delivered"}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(i); }}}
                onClick={() => handleClick(i)}
                className={`flex flex-col items-center gap-1 cursor-pointer ${
                  i < active ? "opacity-100" : i === active ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`
                    w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center text-xs
                    transition-all duration-300 relative z-10
                    ${
                      i < active
                        ? "bg-[#C4622D] border-[#C4622D] text-white"
                        : i === active
                        ? "bg-[#FAF6EF] border-[#C4622D] text-[#C4622D] shadow-[0_0_0_4px_rgba(196,98,45,0.15)]"
                        : "bg-[#FAF6EF] border-[#E8DDD0] text-[#8C7B6B]"
                    }
                  `}
                >
                  {i < active ? "✓" : i + 1}
                </div>
                <span
                  className={`text-[10px] text-center whitespace-nowrap ${
                    i === active ? "text-[#C4622D] font-semibold" : "text-[#8C7B6B]"
                  }`}
                >
                  {i === 0 ? "Collected" : i === 1 ? "In Flight" : i === 2 ? "At Hub" : "Delivered"}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`h-[1.5px] flex-1 mx-2 transition-all duration-500 ${
                    i < active ? "bg-[#C4622D]" : "bg-[#E8DDD0]"
                  }`}
                  style={{ minWidth: "20px" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Journey caption */}
        <div className="bg-[#FFFDF9] border border-[#E8DDD0] rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#C4622D] mb-1">
            <span className="w-1 h-1 rounded-full bg-[#C4622D]" />
            {step.label}
          </div>
          <h3 className="font-playfair text-base font-bold text-[#1A1208] mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-[#8C7B6B] leading-relaxed">{step.desc}</p>
        </div>

        <div className="flex gap-3 mb-12">
          <button
            onClick={() => router.push("/customer/ship")}
            className="bg-[#C4622D] hover:bg-[#D97B48] text-[#FFFDF9] font-semibold px-6 py-3 rounded-md transition-all hover:-translate-y-0.5"
          >
            Send a Package
          </button>
          <button
            onClick={() => router.push("/track")}
            className="border border-[#E8DDD0] hover:border-[#1A1208] text-[#1A1208] font-medium px-5 py-3 rounded-md transition-all"
          >
            Track a Shipment
          </button>
        </div>

        <div className="flex gap-8 pt-8 border-t border-[#E8DDD0]">
          <div>
            <div className="font-playfair text-2xl font-bold text-[#1A1208]">98.2%</div>
            <div className="text-[11px] text-[#8C7B6B]">On-time delivery</div>
          </div>
          <div>
            <div className="font-playfair text-2xl font-bold text-[#1A1208]">12K+</div>
            <div className="text-[11px] text-[#8C7B6B]">Families served</div>
          </div>
          <div>
            <div className="font-playfair text-2xl font-bold text-[#1A1208]">3 days</div>
            <div className="text-[11px] text-[#8C7B6B]">US → Lagos express</div>
          </div>
        </div>
      </div>

      {/* Confetti bursts from cell 4's center across the full hero */}
      {active === 3 && (
        <div
          key={confettiKey}
          className="absolute inset-0 pointer-events-none z-50"
          style={{ overflow: 'visible' }}
        >
          {Array.from({ length: 80 }).map((_, ci) => {
            const angle = (ci / 80) * 360;
            const distance = 150 + Math.random() * 400;
            const dx = Math.cos((angle * Math.PI) / 180) * distance;
            const dy = Math.sin((angle * Math.PI) / 180) * distance;
            const colors = ['#E8B84B','#C4622D','#4ADE80','#FFFDF9','#F59E0B','#D97B48','#86EFAC'];
            const size = 4 + Math.floor(Math.random() * 10);
            return (
              <div
                key={ci}
                style={{
                  position: 'absolute',
                  top: burstOrigin.y,
                  left: burstOrigin.x,
                  width: size,
                  height: size,
                  borderRadius: ci % 3 === 0 ? '50%' : '3px',
                  background: colors[ci % colors.length],
                  '--dx': `${dx}px`,
                  '--dy': `${dy}px`,
                  '--rot': `${(ci * 53) % 720 - 360}deg`,
                  animation: `confettiBurst 1.2s ease-out ${(ci * 0.01)}s forwards`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
