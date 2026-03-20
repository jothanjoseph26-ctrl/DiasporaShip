'use client';

import { useState } from 'react';
import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';
import { CtaSection } from '@/components/marketing/CtaSection';
import { Globe, Truck, Users, Star } from 'lucide-react';

const stats = [
  { label: '4 corridors', icon: Globe },
  { label: '10,000+ shipments', icon: Truck },
  { label: '98% on-time', icon: Star },
  { label: '4.9★ rating', icon: Star },
];

const timeline = [
  { year: '2023', title: 'Founded in Atlanta', desc: 'Started with US→NG corridor, serving families sending packages home to Nigeria.' },
  { year: '2024', title: 'Expanded to Ghana & Kenya', desc: 'Added US→GH and US→KE corridors, tripling our reach across West and East Africa.' },
  { year: '2025', title: 'UK Launch', desc: 'Added UK→NG corridor, connecting British-Nigerian families with reliable shipping.' },
  { year: '2026', title: '10,000 Shipments', desc: 'Milestone reached — a testament to the trust our community places in us every day.' },
];

const team = [
  { name: 'Ade Okonkwo', role: 'CEO & Co-founder', bio: 'Former logistics exec at DHL. Born in Lagos, built DiasporaShip to solve a problem he lived.', initials: 'AO' },
  { name: 'Chioma Eze', role: 'COO', bio: '10 years in supply chain management. Passionate about operational excellence and customer delight.', initials: 'CE' },
  { name: 'James Mensah', role: 'CTO', bio: 'Full-stack engineer from MIT. Obsessed with building technology that makes shipping effortless.', initials: 'JM' },
  { name: 'Fatima Bello', role: 'Head of Operations', bio: 'Expert in cross-border logistics. Ensures every package arrives on time, every time.', initials: 'FB' },
];

const values = [
  { title: 'Trust', desc: 'Every package is someone\'s hope. We never forget that.' },
  { title: 'Reliability', desc: 'On-time delivery isn\'t a goal — it\'s our standard.' },
  { title: 'Community', desc: 'We serve the diaspora because we are the diaspora.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />

      <section className="pt-32 pb-16 text-center px-6">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1208] mb-5">
          Connecting Families Across Oceans
        </h1>
        <p className="text-[17px] text-[#8C7B6B] max-w-2xl mx-auto leading-relaxed">
          We&apos;re building the most trusted logistics bridge between the African diaspora and home.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1208] mb-5">Our Mission</h2>
            <p className="text-[15px] text-[#8C7B6B] leading-relaxed mb-4">
              Millions of families across the African diaspora send packages home every year — gifts for loved ones, essential supplies, business inventory. Yet the process has always been fragmented, opaque, and stressful.
            </p>
            <p className="text-[15px] text-[#8C7B6B] leading-relaxed">
              DiasporaShip exists to change that. We combine technology with local expertise to offer door-to-door shipping you can actually trust. From pickup in Atlanta to delivery in Lagos, every step is tracked, every price is transparent, and every package matters.
            </p>
          </div>
          <div className="rounded-2xl bg-[#E8DDD0] h-80 flex items-center justify-center">
            <span className="text-[#8C7B6B] text-sm">Company Photo</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E8DDD0] rounded-2xl p-6 text-center">
              <stat.icon className="w-5 h-5 text-[#C4622D] mx-auto mb-3" />
              <div className="text-[15px] font-semibold text-[#1A1208]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="font-playfair text-3xl font-bold text-[#1A1208] text-center mb-14">Our Story</h2>
        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-[2px] bg-[#E8DDD0]" />
          <div className="flex flex-col gap-10">
            {timeline.map((item) => (
              <div key={item.year} className="flex gap-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-[38px] h-[38px] rounded-full bg-[#C4622D] flex items-center justify-center text-white text-[13px] font-semibold z-10 shrink-0">
                    {item.year.slice(2)}
                  </div>
                </div>
                <div className="pb-2">
                  <div className="text-[12px] font-semibold text-[#C4622D] mb-1">{item.year}</div>
                  <div className="font-playfair text-lg font-bold text-[#1A1208] mb-1">{item.title}</div>
                  <p className="text-[14px] text-[#8C7B6B] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-playfair text-3xl font-bold text-[#1A1208] text-center mb-12">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white border border-[#E8DDD0] rounded-2xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#E8DDD0] mx-auto mb-4 flex items-center justify-center text-[#8C7B6B] font-semibold text-lg">
                {member.initials}
              </div>
              <div className="font-playfair font-bold text-[#1A1208] mb-0.5">{member.name}</div>
              <div className="text-[13px] text-[#C4622D] font-medium mb-2">{member.role}</div>
              <p className="text-[13px] text-[#8C7B6B] leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-playfair text-3xl font-bold text-[#1A1208] text-center mb-12">What Drives Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.title} className="bg-white border border-[#E8DDD0] rounded-2xl p-8">
              <div className="font-playfair text-xl font-bold text-[#1A1208] mb-3">{value.title}</div>
              <p className="text-[15px] text-[#8C7B6B] leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
      <Footer />
    </div>
  );
}
