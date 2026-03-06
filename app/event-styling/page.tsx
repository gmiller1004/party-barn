import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Event Styling + Rentals | Party Barn Mercantile",
  description:
    "Thoughtful event styling with a clean, elevated aesthetic. Delivery and on-site setup for a seamless celebration in Old Town Murrieta.",
};

export default function EventStylingPage() {
  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Service
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Event Styling + Rentals
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
            We bring a calm, elevated experience to every celebration—from
            intimate gatherings to larger events. Our styling includes delivery
            and on-site setup so you can enjoy the day without the stress.
          </p>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-cream/30">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/gallery/gallery-dinosaur-safari-bounce-house-table.webp"
                alt="Dinosaur safari party with bounce house and styled table"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-2xl font-semibold text-brand-ink">
                Full-Service Styling
              </h2>
              <p className="mt-4 text-brand-ink/85 leading-relaxed">
                Balloon garlands, backdrops, table settings, and rentals
                coordinated to match your vision. We work with you on theme,
                palette, and layout so the result feels effortless and refined.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-brand-ink/85">
                <li>· Balloon arches and garlands</li>
                <li>· Backdrops and photo moments</li>
                <li>· Table styling and place settings</li>
                <li>· Rentals (tables, bounce houses, etc.)</li>
                <li>· Delivery and on-site setup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl font-semibold text-brand-ink">
            Ready to plan your celebration?
          </h2>
          <p className="mt-3 text-brand-ink/80">
            Tell us about your event and we&apos;ll help bring it to life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
            >
              Get in touch
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium border border-brand-ink/30 text-brand-ink hover:bg-brand-ink/5 transition-colors"
            >
              View gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
