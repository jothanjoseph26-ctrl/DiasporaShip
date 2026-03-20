export function MarqueeBand() {
  const items = [
    "🇺🇸 US → 🇳🇬 Nigeria",
    "🇺🇸 US → 🇬🇭 Ghana",
    "🇺🇸 US → 🇰🇪 Kenya",
    "🇬🇧 UK → 🇳🇬 Nigeria",
    "🇨🇦 Canada → 🇬🇭 Ghana",
    "Door-to-door delivery",
    "Live GPS tracking",
    "Customs handled",
  ];

  const duplicatedItems = [...items, ...items];

  return (
    <div className="bg-[#C4622D] py-3.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedItems.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3.5 px-10 text-[13px] font-semibold text-white/90 tracking-[0.04em] uppercase">
            {item}
            {i < duplicatedItems.length - 1 && <span className="text-white/35 text-base">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
