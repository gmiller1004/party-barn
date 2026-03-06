import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Party Barn",
  description:
    "Terms and conditions for using Party Barn's website, shop, and services. Party supplies and event styling in Murrieta, CA.",
};

export default function TermsPage() {
  return (
    <section className="section-spacing bg-brand-offwhite pb-20">
      <div className="container-narrow max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-ink">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-brand-ink/70">
          Last updated: March 2025
        </p>

        <div className="mt-10 space-y-10 text-brand-ink/90 leading-relaxed">
          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">1. Agreement to terms</h2>
            <p>
              By accessing or using the Party Barn website and related services (the &ldquo;Site&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Site. Party Barn (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is a party studio and shop located in Old Town Murrieta, California.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">2. Use of the site</h2>
            <p>
              You may use the Site for lawful purposes only. You may not use the Site to transmit harmful, offensive, or illegal content, or to interfere with the Site&apos;s operation or other users. We reserve the right to suspend or terminate access if we believe you have violated these terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">3. Orders and payment</h2>
            <p className="mb-3">
              Orders placed through the Site are processed via Shopify. By placing an order, you represent that you are authorized to use the payment method provided. All prices are in U.S. dollars. We reserve the right to correct pricing errors, limit quantities, or refuse or cancel orders (e.g. for suspected fraud or if a product is unavailable). If your order is cancelled after payment, we will refund the amount paid.
            </p>
            <p>
              Checkout and payment are handled by Shopify and its payment partners. Your payment and billing information are subject to Shopify&apos;s terms and privacy policy.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">4. Pickup and fulfillment</h2>
            <p>
              When you choose local pickup, you agree to collect your order at Party Barn&apos;s location (24977 Washington Ave, Suite E, Murrieta, CA 92562; entrance faces Ivy Street) during our business hours. We will communicate pickup details and any timing after your order is ready. You are responsible for picking up your order within the timeframe we specify. Unclaimed orders may be subject to restocking or other fees as communicated at the time of order.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">5. Event styling and balloon orders</h2>
            <p>
              Custom balloon orders, event styling, and rental services may be subject to separate agreements, deposits, and policies. Details will be provided when you request or book those services. By booking, you agree to those additional terms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">6. Nicole chat assistant</h2>
            <p>
              Our in-site chat assistant (&ldquo;Nicole&rdquo;) is for party-planning ideas and general help only. It does not constitute professional advice or a binding offer. Recommendations (e.g. themes, products) are informational. Any decisions you make based on the chat are your own. We may store and use chat content as described in our{" "}
              <Link href="/privacy" className="text-brand-copper font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">7. Intellectual property</h2>
            <p>
              The Site and its content (including text, images, logos, and design) are owned by Party Barn or our licensors and are protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or use our content for commercial purposes without our prior written permission.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">8. Disclaimers</h2>
            <p>
              The Site and our products and services are provided &ldquo;as is.&rdquo; We do not warrant that the Site will be error-free or uninterrupted. Product images and descriptions are for illustration; we strive for accuracy but do not guarantee that colors or details match exactly. To the fullest extent permitted by law, we disclaim all warranties, express or implied.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Party Barn and its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Site or our products or services. Our total liability for any claim related to the Site or a purchase shall not exceed the amount you paid for the relevant product or service.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Party Barn and its owners, employees, and affiliates from any claims, damages, or expenses (including reasonable attorneys&apos; fees) arising from your use of the Site, your violation of these terms, or your violation of any third party&apos;s rights.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">11. Governing law</h2>
            <p>
              These Terms and Conditions are governed by the laws of the State of California, without regard to its conflict-of-laws principles. Any dispute arising from these terms or the Site shall be brought in the state or federal courts located in Riverside County, California.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">12. Severability</h2>
            <p>
              If any part of these terms is held to be invalid or unenforceable, the remaining provisions will remain in effect.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">13. Changes</h2>
            <p>
              We may update these Terms and Conditions from time to time. We will post the revised version on this page and update the &ldquo;Last updated&rdquo; date. Your continued use of the Site after changes constitutes acceptance of the updated terms. If you do not agree, please stop using the Site.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">14. Contact</h2>
            <p>
              For questions about these terms, contact Party Barn via our{" "}
              <Link href="/contact" className="text-brand-copper font-medium hover:underline">
                contact page
              </Link>
              , or visit us at 24977 Washington Ave, Suite E, Murrieta, CA 92562.
            </p>
          </div>
        </div>

        <p className="mt-14 pt-6 border-t border-brand-cream text-sm text-brand-ink/60">
          <Link href="/" className="text-brand-copper hover:underline">← Back to home</Link>
        </p>
      </div>
    </section>
  );
}
