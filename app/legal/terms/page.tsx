import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />
      <div className="max-w-3xl mx-auto pt-32 pb-16 px-6">
        <h1 className="font-playfair text-3xl font-bold text-[#1A1208] mb-2">Terms of Service</h1>
        <p className="text-[14px] text-[#8C7B6B] mb-10">Last updated: March 2026</p>

        <div className="flex flex-col gap-8 text-[15px] text-[#8C7B6B] leading-relaxed">
          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using DiasporaShip, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use our platform. These terms constitute a legally binding agreement between you and DiasporaShip Inc.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">2. Services Description</h2>
            <p>DiasporaShip provides door-to-door logistics services between the United States, United Kingdom, Canada and Nigeria, Ghana, and Kenya. Our services include package pickup, customs facilitation, international shipping, and last-mile delivery. Service availability varies by corridor and is subject to applicable laws and regulations in both origin and destination countries.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">3. User Accounts</h2>
            <p>To use certain features of our platform, you must register for an account and provide accurate, complete information. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized access or use of your account.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">4. Shipping</h2>
            <p>All shipments must comply with our packaging guidelines and applicable customs regulations. Prohibited items include but are not limited to hazardous materials, perishable goods without proper documentation, and items restricted by destination country laws. DiasporaShip reserves the right to refuse or delay shipments that do not meet these requirements. Customs duties and taxes may apply and are the responsibility of the sender or recipient as specified at booking.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">5. Payment</h2>
            <p>All prices are quoted in US dollars unless otherwise specified and are due at the time of booking unless you have an approved credit arrangement. We accept credit cards, debit cards, bank transfers, and DiasporaShip Wallet. Refunds are issued in accordance with our refund policy, which varies by service tier and circumstances of cancellation.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">6. Liability</h2>
            <p>DiasporaShip liability for lost or damaged shipments is limited to the declared value of the shipment or $100, whichever is greater, unless additional insurance is purchased at the time of booking. Claims must be filed within 30 days of the expected delivery date. We are not liable for delays caused by customs, force majeure, or circumstances beyond our reasonable control.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">7. Intellectual Property</h2>
            <p>All content, trademarks, logos, and technology on the DiasporaShip platform are the exclusive property of DiasporaShip Inc. You may not copy, modify, distribute, or create derivative works from any part of our platform without our prior written consent.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">8. Termination</h2>
            <p>We may suspend or terminate your account at any time if you violate these terms, engage in fraudulent activity, or for any reason with reasonable notice. Upon termination, your right to use the platform ceases immediately, though provisions regarding liability, indemnification, and dispute resolution survive.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">9. Governing Law</h2>
            <p>These terms are governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the state or federal courts located in Fulton County, Georgia.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify registered users of material changes via email or platform notification at least 30 days before changes take effect. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
