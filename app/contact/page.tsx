'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />

      <section className="pt-32 pb-12 text-center px-6">
        <h1 className="font-playfair text-4xl font-bold text-[#1A1208] mb-5">
          Get in Touch
        </h1>
        <p className="text-[17px] text-[#8C7B6B] max-w-2xl mx-auto leading-relaxed">
          We&apos;d love to hear from you. Reach out anytime.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {submitted ? (
              <div className="bg-white border border-[#E8DDD0] rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#1A1208] mb-2">Message sent!</h3>
                <p className="text-[15px] text-[#8C7B6B]">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E8DDD0] rounded-2xl p-8">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-[13px] font-medium text-[#1A1208] mb-1.5 block">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1208] outline-none focus:border-[#C4622D] transition-colors bg-[#FFFDF9]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#1A1208] mb-1.5 block">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1208] outline-none focus:border-[#C4622D] transition-colors bg-[#FFFDF9]"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#1A1208] mb-1.5 block">Subject</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1208] outline-none focus:border-[#C4622D] transition-colors bg-[#FFFDF9]"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="shipping">Shipping Question</option>
                      <option value="complaint">Complaint</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#1A1208] mb-1.5 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-[14px] text-[#1A1208] outline-none focus:border-[#C4622D] transition-colors bg-[#FFFDF9] resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#1A1208] text-white font-semibold text-[14px] hover:bg-[#C4622D] transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-[#C4622D]" />
                <div>
                  <div className="text-[12px] text-[#8C7B6B]">Email</div>
                  <a href="mailto:support@diasporaship.com" className="text-[14px] font-medium text-[#1A1208] hover:text-[#C4622D] transition-colors">
                    support@diasporaship.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-[#C4622D]" />
                <div>
                  <div className="text-[12px] text-[#8C7B6B]">Phone</div>
                  <a href="tel:+14045551234" className="text-[14px] font-medium text-[#1A1208] hover:text-[#C4622D] transition-colors">
                    +1 (404) 555-1234
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-[#C4622D]" />
                <div>
                  <div className="text-[12px] text-[#8C7B6B]">WhatsApp</div>
                  <a href="https://wa.me/14045551234" target="_blank" rel="noopener noreferrer" className="text-[14px] font-medium text-[#1A1208] hover:text-[#C4622D] transition-colors">
                    +1 (404) 555-1234
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#C4622D]" />
                <div>
                  <div className="text-[12px] text-[#8C7B6B]">Address</div>
                  <div className="text-[14px] font-medium text-[#1A1208]">123 Commerce St, Suite 400<br />Atlanta, GA 30309</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C4622D]" />
                <div>
                  <div className="text-[12px] text-[#8C7B6B]">Hours</div>
                  <div className="text-[14px] font-medium text-[#1A1208]">Mon–Fri 8AM–8PM EST<br />Sat 9AM–5PM EST</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6">
              <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8C7B6B] mb-4">Follow us</div>
              <div className="flex gap-3">
                <a href="https://x.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FAF6EF] border border-[#E8DDD0] flex items-center justify-center text-[14px] text-[#8C7B6B] hover:text-[#1A1208] hover:border-[#C4622D] transition-colors">
                  𝕏
                </a>
                <a href="https://linkedin.com/company/diasporaship" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FAF6EF] border border-[#E8DDD0] flex items-center justify-center text-[14px] text-[#8C7B6B] hover:text-[#1A1208] hover:border-[#C4622D] transition-colors">
                  in
                </a>
                <a href="https://facebook.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FAF6EF] border border-[#E8DDD0] flex items-center justify-center text-[14px] text-[#8C7B6B] hover:text-[#1A1208] hover:border-[#C4622D] transition-colors">
                  f
                </a>
                <a href="https://instagram.com/diasporaship" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FAF6EF] border border-[#E8DDD0] flex items-center justify-center text-[14px] text-[#8C7B6B] hover:text-[#1A1208] hover:border-[#C4622D] transition-colors">
                  📷
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#E8DDD0] h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-[#8C7B6B] mx-auto mb-2" />
            <span className="text-[#8C7B6B] text-sm">Our Location</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
