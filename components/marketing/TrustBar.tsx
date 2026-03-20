export function TrustBar() {
  const logos = ["Zenith Bank", "Access Bank", "MTN Group", "Jumia", "Flutterwave"];

  return (
    <div className="bg-[#FFFDF9] py-7 px-14 flex items-center justify-between border-b border-[#E8DDD0]">
      <span className="text-[12px] font-medium text-[#8C7B6B] tracking-[0.06em] uppercase whitespace-nowrap mr-10">
        Trusted by businesses across
      </span>
      <div className="flex items-center gap-10 flex-1">
        {logos.map((logo) => (
          <span
            key={logo}
            className="font-playfair text-[14px] font-bold text-[#E8DDD0] tracking-[-0.5px] hover:text-[#8C7B6B] transition-colors cursor-default"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
