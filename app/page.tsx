import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero – full-bleed background image (no people) + overlay, text on top */}
      <section className="relative min-h-[min(88vh,720px)] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/gallery/gallery-pink-balloon-bow-archway-entry.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-brand-offwhite/75 backdrop-blur-[1px]"
          aria-hidden
        />
        <div className="container-narrow section-spacing text-center relative z-10">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-4">
            Old Town Murrieta
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-brand-ink md:text-5xl lg:text-6xl max-w-3xl mx-auto">
            Evoking a Sense of Magic
          </h1>
          <p className="mt-3 font-script text-2xl md:text-3xl text-brand-copper">
            Rooted in Celebration
          </p>
          <p className="mt-6 text-lg text-brand-ink/90 max-w-2xl mx-auto leading-relaxed">
            A modern party studio offering premium balloons, curated party goods,
            and stylish gifts in Old Town Murrieta.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/visit"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
            >
              Visit Us — Opening Spring 26&apos;
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium border border-brand-ink/30 text-brand-ink hover:bg-brand-ink/5 transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Services – three columns with images */}
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-wide">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-ink text-center mb-4">
            Our Services
          </h2>
          <p className="text-center text-brand-ink/80 max-w-2xl mx-auto mb-14">
            Thoughtful event styling with a clean, elevated aesthetic—delivery
            and on-site setup for a seamless experience.
          </p>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            <div className="rounded-lg overflow-hidden border border-brand-cream bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gallery/gallery-pink-balloon-bow-archway-entry.webp"
                  alt="Balloon decor in an entryway"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-brand-ink">
                  Helium Balloons + Grab n Go Garlands
                </h3>
                <p className="mt-3 text-sm text-brand-ink/80 leading-relaxed">
                  Premium high-quality balloons curated to match your celebration.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-brand-cream bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gallery/gallery-pastel-kids-tables-florals-desserts.webp"
                  alt="Pastel table setup with florals and desserts"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-brand-ink">
                  Modern Party Supplies
                </h3>
                <p className="mt-3 text-sm text-brand-ink/80 leading-relaxed">
                  A refined edit of premium party essentials for effortless,
                  stylish hosting.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-brand-cream bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gallery/gallery-dinosaur-safari-bounce-house-table.webp"
                  alt="Styled event with bounce house and table"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-brand-ink">
                  Event Styling + Rentals
                </h3>
                <p className="mt-3 text-sm text-brand-ink/80 leading-relaxed">
                  Thoughtful event styling with a clean, elevated aesthetic,
                  including delivery and on-site setup.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-12 text-center">
            <Link
              href="/event-styling"
              className="text-sm font-medium text-brand-copper hover:underline"
            >
              Learn more about event styling →
            </Link>
          </p>
        </div>
      </section>

      {/* Why Party Barn – single column with optional image */}
      <section className="section-spacing bg-brand-cream/40">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/images/gallery/gallery-slumber-party-teepees-balloon-arch.webp"
                  alt="Thoughtfully styled celebration with balloon arch and teepees"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-ink">
                Why Party Barn?
              </h2>
              <p className="font-serif text-xl text-brand-copper mt-2">
                Celebrating beautifully. Always.
              </p>
              <p className="mt-8 text-brand-ink/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                At Party Barn, we believe every moment—big or small—deserves
                thoughtful design and a sense of magic. From premium balloons to
                curated party goods and elevated event styling, everything we create
                is designed to feel effortless, refined, and unforgettable.
              </p>
              <ul className="mt-10 space-y-3 text-left max-w-md mx-auto lg:mx-0 text-sm text-brand-ink/85">
                <li className="flex items-start gap-3">
                  <span className="text-brand-copper shrink-0">·</span>
                  Premium balloons + modern party details
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-copper shrink-0">·</span>
                  Thoughtfully styled celebrations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-copper shrink-0">·</span>
                  A calm, elevated experience from start to finish
                </li>
              </ul>
              <p className="mt-10 text-brand-ink/80 max-w-xl mx-auto lg:mx-0">
                We&apos;re here to make your celebrations feel just as special as the
                moments you&apos;re honoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA – Visit + opening (softer strip, flows into footer) */}
      <section className="section-spacing-tight border-t border-brand-sand/40 bg-gradient-to-b from-brand-sand/50 to-brand-cream/60 text-brand-ink">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">
            Opening Spring 26&apos;
          </h2>
          <p className="mt-3 text-brand-ink/80">
            24977 Washington Ave, Suite E · Murrieta, CA 92562
          </p>
          <p className="mt-1 text-brand-ink/70 text-sm italic">
            Entrance faces Ivy Street
          </p>
          <Link
            href="/visit"
            className="mt-8 inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
          >
            Visit &amp; directions
          </Link>
        </div>
      </section>
    </>
  );
}
