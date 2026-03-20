import Link from "next/link";
import Image from "next/image";

const shipLinks = [
  { label: "Get a Quote", href: "/customer/shipments/new" },
  { label: "Book a Pickup", href: "/customer/shipments/new" },
  { label: "Track Shipment", href: "/track" },
  { label: "Pricing", href: "/pricing" },
  { label: "Packaging Guide", href: "/guides/packaging" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Corridors", href: "/about#corridors" },
  { label: "For Business", href: "/contact" },
  { label: "Careers", href: "/contact" },
  { label: "Blog", href: "/contact" },
];

const supportLinks = [
  { label: "Help Center", href: "/contact" },
  { label: "WhatsApp Support", href: "https://wa.me/14045551234", external: true },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
];

const currentYear = 2026;

export function Footer() {
  return (
    <footer className="bg-[#1A1208] border-t border-white/6 py-16 px-14">
      <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-12 mb-14">
        <div>
          <Image src="/images/transparent-logo.png" alt="DiasporaShip" width={140} height={35} className="h-8 w-auto mb-3" />
          <p className="text-[13px] text-white/35 leading-[1.8] max-w-[240px] mb-6">
            Premium door-to-door logistics connecting the African diaspora to home. US, UK, and Canada to Nigeria, Ghana, and Kenya.
          </p>
          <div className="flex gap-2.5">
            <a href="https://twitter.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[14px] text-white/50 hover:bg-white/12 transition-colors">𝕏</a>
            <a href="https://linkedin.com/company/diasporaship" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[14px] text-white/50 hover:bg-white/12 transition-colors">in</a>
            <a href="https://facebook.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[14px] text-white/50 hover:bg-white/12 transition-colors">f</a>
            <a href="https://instagram.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[14px] text-white/50 hover:bg-white/12 transition-colors">📷</a>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-5">Ship</div>
          <ul className="flex flex-col gap-2.75 list-none">
            {shipLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-5">Company</div>
          <ul className="flex flex-col gap-2.75 list-none">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-5">Support</div>
          <ul className="flex flex-col gap-2.75 list-none">
            {supportLinks.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center pt-7 border-t border-white/6">
        <span className="text-[12px] text-white/25">© {currentYear} DiasporaShip Inc. All rights reserved.</span>
        <div className="flex gap-1.5">
          <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/8 px-2.5 py-1 rounded">🇺🇸 US</span>
          <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/8 px-2.5 py-1 rounded">🇬🇧 UK</span>
          <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/8 px-2.5 py-1 rounded">🇳🇬 Nigeria</span>
          <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/8 px-2.5 py-1 rounded">🇬🇭 Ghana</span>
          <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/8 px-2.5 py-1 rounded">🇰🇪 Kenya</span>
        </div>
      </div>
    </footer>
  );
}
