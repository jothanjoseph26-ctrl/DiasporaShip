'use client';

import { useState } from 'react';
import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import { Pricing } from '@/components/marketing/Pricing';
import { ClipboardList, Calculator, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const steps = [
  { num: '1', title: 'Enter details', desc: 'Tell us what you\'re shipping, from where, and to where. Takes 30 seconds.' },
  { num: '2', title: 'Get instant quote', desc: 'See your exact price with no hidden fees. Compare Standard, Express, and Business options.' },
  { num: '3', title: 'Book & pay', desc: 'Confirm your shipment, choose pickup, and pay securely. We handle the rest.' },
];

const faqs = [
  {
    q: 'How are shipping costs calculated?',
    a: 'Costs are based on package weight, dimensions, origin-destination corridor, and service type (Standard, Express, or Business). Heavier and bulkier packages cost more, and Express service is priced higher for faster delivery.',
  },
  {
    q: 'Are there any hidden fees?',
    a: 'No. All costs are shown upfront at checkout, including estimated customs duties and taxes. What you see is what you pay.',
  },
  {
    q: 'Do you offer bulk or corporate rates?',
    a: 'Yes. Our Business tier offers volume discounts, dedicated account management, and monthly invoicing. Contact our sales team for a custom quote.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept DiasporaShip Wallet, credit/debit cards, bank transfer, and cash on delivery (COD) in select corridors.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E8DDD0] rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-medium text-[#1A1208] text-[15px]">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#8C7B6B] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#8C7B6B] shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-[14px] text-[#8C7B6B] leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />

      <section className="pt-32 pb-12 text-center px-6">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1208] mb-5">
          Simple, Transparent Pricing
        </h1>
        <p className="text-[17px] text-[#8C7B6B] max-w-2xl mx-auto leading-relaxed">
          No hidden fees. No surprises. Just honest rates for shipping home.
        </p>
      </section>

      <Pricing />

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-playfair text-3xl font-bold text-[#1A1208] text-center mb-12">How Pricing Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#C4622D] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step.num}
              </div>
              <div className="font-playfair font-bold text-[#1A1208] mb-2">{step.title}</div>
              <p className="text-[14px] text-[#8C7B6B] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="font-playfair text-3xl font-bold text-[#1A1208] text-center mb-10">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <CtaSection />
      <Footer />
    </div>
  );
}
