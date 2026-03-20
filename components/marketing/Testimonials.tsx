"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "I send food, clothes, and medicine home to my mother in Lagos every two months. DiasporaShip picks up from my apartment in Atlanta. She calls me when the driver arrives. It feels like I'm there.",
    name: "Adaeze Okonkwo",
    location: "Atlanta, GA → Lagos, Nigeria",
    initials: "AO",
    variant: "main" as const,
    bg: "rgba(255,253,249,0.2)",
    color: "#FFFDF9",
  },
  {
    quote: "I import electronics for my shop in Accra. Their business account gives me monthly invoicing, customs docs handled, and I see everything live. No stress at all.",
    name: "Fiifi Korsah",
    location: "Houston, TX → Accra, Ghana",
    initials: "FK",
    variant: "secondary" as const,
    bg: "#FBF3DC",
    color: "#5C3A1E",
  },
  {
    quote: "The tracking is incredible. I watched it go from my house in DC to JFK, on the flight, through Lagos customs, and to my sister's door in Enugu. I've never had this with any other courier.",
    name: "Ngozi Chibuike",
    location: "Washington DC → Enugu, Nigeria",
    initials: "NC",
    variant: "secondary" as const,
    bg: "#F5EBE0",
    color: "#C4622D",
  },
];

export function Testimonials() {
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
    <section ref={sectionRef} className="reveal bg-[#FFFDF9] py-[100px] px-14">
      <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C4622D] mb-5 flex items-center gap-3">
        <span className="block w-6 h-[1.5px] bg-[#C4622D]" />
        Real Customers
      </div>
      <h2 className="font-playfair text-[clamp(32px,3.8vw,52px)] font-bold tracking-[-1.5px] leading-[1.08] text-[#1A1208] mb-16">
        The diaspora<br /><em className="italic text-[#C4622D]">trusts us.</em>
      </h2>

      <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-6">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className={`rounded-[18px] p-10 flex flex-col justify-between ${
              t.variant === "main"
                ? "bg-[#C4622D] min-h-[360px]"
                : "bg-[#FAF6EF] border border-[#E8DDD0]"
            }`}
          >
            <div>
              <div
                className={`text-[13px] tracking-[3px] mb-5 ${
                  t.variant === "main" ? "text-white/60" : "text-[#C9972B]"
                }`}
              >
                ★★★★★
              </div>
              <blockquote
                className={`leading-[1.55] mb-8 flex-1 ${
                  t.variant === "main"
                    ? "font-playfair text-[20px] italic font-bold text-[#FFFDF9]"
                    : "text-[15px] font-normal text-[#1A1208] leading-[1.7]"
                }`}
              >
                &quot;{t.quote}&quot;
              </blockquote>
            </div>
            <div className="flex items-center gap-3.5 pt-6 border-t border-white/20">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
                style={{ background: t.bg, color: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <div
                  className={`text-[14px] font-semibold ${
                    t.variant === "main" ? "text-[#FFFDF9]" : "text-[#1A1208]"
                  }`}
                >
                  {t.name}
                </div>
                <div
                  className={`text-[12px] ${
                    t.variant === "main" ? "text-white/55" : "text-[#8C7B6B]"
                  }`}
                >
                  {t.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
