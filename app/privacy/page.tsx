import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Party Barn",
  description:
    "Privacy policy for Party Barn. How we collect and use your information when you use our site and services in Murrieta, CA.",
};

export default function PrivacyPage() {
  return (
    <section className="section-spacing bg-brand-offwhite pb-20">
      <div className="container-narrow max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-ink">
          Privacy Policy
        </h1>
        <p className="mt-4 text-brand-ink/70">
          Last updated: March 2025
        </p>

        <div className="mt-10 space-y-10 text-brand-ink/90 leading-relaxed">
          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">1. Who we are</h2>
            <p>
              Party Barn (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is a party studio and shop in Old Town Murrieta, California. We offer premium balloons, curated party goods, event styling, and gifts. This policy describes how we collect, use, and protect your information when you use our website and services.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">2. Information we collect</h2>
            <p className="mb-3">
              We may collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account and order information:</strong> When you place an order through our site, checkout is handled by Shopify. We and Shopify collect name, email, shipping/pickup address, and payment information as needed to process your order.</li>
              <li><strong>Cart and browsing:</strong> We use a cookie to keep your shopping cart intact as you browse (e.g. cart ID). This does not identify you personally.</li>
              <li><strong>Chat (Nicole):</strong> If you use our party-planning chat, we store your name, optional email, and conversation history in a secure database so we can respond, send you a transcript if you request it, and follow up. We may use your contact details for remarketing (e.g. occasional updates about Party Barn) unless you opt out.</li>
              <li><strong>Communications:</strong> If you contact us (e.g. via our contact form or email), we keep the content of your message and your contact details to respond and provide service.</li>
              <li><strong>Usage and technical data:</strong> Our hosting and analytics may record general usage (e.g. pages visited, device type). We do not sell this data.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">3. How we use your information</h2>
            <p>
              We use the information above to: process and fulfill orders; provide store pickup; run the chat and send transcript emails; improve our site and services; send you relevant updates about Party Barn (you can opt out); and comply with law. We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">4. Cookies and similar technologies</h2>
            <p>
              We use cookies and similar technologies where necessary to operate the site, for example to keep your cart (cart ID cookie) and to remember your chat session. You can control cookies through your browser settings. Blocking certain cookies may affect cart or chat functionality.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">5. Third-party services</h2>
            <p className="mb-3">
              We rely on trusted third parties to run our business. Each has its own privacy practices. We use:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Shopify</strong> — for our online store and checkout</li>
              <li><strong>Neon</strong> — to store chat conversations and contact details</li>
              <li><strong>SendGrid</strong> — to send transcript and other emails</li>
              <li><strong>xAI (Grok)</strong> — to power the Nicole chat assistant</li>
              <li><strong>Vercel</strong> — to host the website</li>
            </ul>
            <p className="mt-3">
              Links to their privacy policies are available on their respective websites.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">6. Data retention and security</h2>
            <p>
              We retain your information for as long as needed to provide our services, fulfill orders, and comply with legal obligations. Chat and contact data may be kept for remarketing until you ask us to delete it. We use reasonable technical and organizational measures to protect your data; no system is completely secure.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">7. Your rights</h2>
            <p className="mb-3">
              Depending on where you live, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access or receive a copy of the personal data we hold about you</li>
              <li>Correct or update your information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing or promotional emails</li>
              <li>Object to or restrict certain processing</li>
            </ul>
            <p className="mt-3">
              To exercise these rights or ask questions about your data, contact us (see below).
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">8. Children</h2>
            <p>
              Our site and services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">9. Changes to this policy</h2>
            <p>
              We may update this privacy policy from time to time. We will post the revised version on this page and update the &ldquo;Last updated&rdquo; date. Continued use of the site after changes constitutes acceptance of the updated policy where permitted by law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-ink mb-2">10. Contact us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact Party Barn at our{" "}
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
