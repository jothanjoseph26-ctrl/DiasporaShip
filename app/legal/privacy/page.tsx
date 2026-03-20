import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />
      <div className="max-w-3xl mx-auto pt-32 pb-16 px-6">
        <h1 className="font-playfair text-3xl font-bold text-[#1A1208] mb-2">Privacy Policy</h1>
        <p className="text-[14px] text-[#8C7B6B] mb-10">Last updated: March 2026</p>

        <div className="flex flex-col gap-8 text-[15px] text-[#8C7B6B] leading-relaxed">
          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">1. Information We Collect</h2>
            <p>We collect personal information you provide directly, including your name, email address, phone number, and shipping addresses. We also collect shipment data such as package contents, dimensions, weight, and destination details. Payment information is processed securely through our payment providers. We automatically collect device and usage data including IP address, browser type, and interaction logs when you use our platform.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">2. How We Use Your Information</h2>
            <p>We use your information to deliver and improve our shipping services, process payments, and communicate shipment updates. Your data helps us personalize your experience, provide customer support, and send relevant service notifications. We also use aggregated, anonymized data for analytics and platform improvement.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">3. Data Sharing</h2>
            <p>We share information with courier partners and local delivery agents as necessary to complete your shipments. Payment processors receive transaction data to process payments securely. We may disclose information to legal authorities when required by law or to protect our rights. We never sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">4. Data Security</h2>
            <p>We implement industry-standard encryption for data in transit and at rest. Access to personal information is restricted through role-based access controls and multi-factor authentication. We conduct regular security audits and vulnerability assessments. While we take reasonable measures to protect your data, no method of electronic transmission or storage is completely secure.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting us. You may request a portable copy of your data in a commonly used format. You can opt out of non-essential communications while continuing to receive transactional shipment updates. Depending on your jurisdiction, additional rights may apply under GDPR, CCPA, or other applicable privacy laws.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">6. Cookies</h2>
            <p>We use essential cookies required for platform functionality, including authentication and session management. Analytics cookies help us understand how users interact with our platform so we can improve it. Preference cookies remember your settings such as language and region. You can manage cookie preferences through your browser settings, though disabling essential cookies may affect platform functionality.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">7. International Transfers</h2>
            <p>Your data may be processed in the United States, United Kingdom, and destination countries where we operate (Nigeria, Ghana, Kenya). We ensure appropriate safeguards are in place for international data transfers, including standard contractual clauses and adherence to applicable data protection frameworks. By using our services, you consent to the transfer of your information to these jurisdictions.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">8. Children&apos;s Privacy</h2>
            <p>DiasporaShip is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we discover that we have inadvertently collected data from a user under 18, we will delete it promptly. Parents or guardians who believe their child has provided information to us should contact us immediately.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes via email or a prominent notice on our platform at least 30 days before they take effect. The updated policy will be posted on this page with a revised &quot;Last updated&quot; date.</p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#1A1208] mb-3">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or how we handle your data, please contact our privacy team at <a href="mailto:privacy@diasporaship.com" className="text-[#C4622D] hover:underline">privacy@diasporaship.com</a>. You may also reach us by mail at 123 Commerce St, Suite 400, Atlanta, GA 30309, or by phone at +1 (404) 555-1234.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
