import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Party Barn",
  description:
    "Get in touch with Party Barn for event styling, balloon orders, and party supplies in Old Town Murrieta.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Get in touch
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Contact
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
            Have a question about event styling, balloons, or our shop? Send us
            a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-cream/30 pb-20">
        <div className="container-narrow">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
