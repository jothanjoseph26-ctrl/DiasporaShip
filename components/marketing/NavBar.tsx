"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "How it works", href: "/about" },
  { label: "Corridors", href: "/about#corridors" },
  { label: "Track", href: "/track" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 h-[68px] bg-[#FAF6EF]/92 backdrop-blur-xl border-b border-[#E8DDD0]">
      <Link href="/" className="flex items-center">
        <Image src="/images/transparent-logo.png" alt="DiasporaShip" width={160} height={40} className="h-10 w-auto" />
      </Link>
      <ul className="flex gap-9 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[13.5px] font-medium text-[#8C7B6B] hover:text-[#1A1208] transition-colors duration-200 tracking-[0.01em]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2.5">
        <Link
          href="/customer/auth/login"
          className="text-[13.5px] font-medium text-[#1A1208] bg-transparent border-none cursor-pointer px-3.5 py-2 hover:text-[#C4622D] transition-colors duration-200"
        >
          Sign in
        </Link>
        <Link
          href="/customer/shipments/new"
          className="text-[13.5px] font-semibold text-[#FFFDF9] bg-[#1A1208] border-none cursor-pointer px-5 py-2.5 rounded-md hover:bg-[#C4622D] transition-colors duration-200 tracking-[0.01em]"
        >
          Get a Quote
        </Link>
      </div>
    </nav>
  );
}
