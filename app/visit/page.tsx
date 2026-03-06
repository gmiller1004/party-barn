import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Visit Us | Party Barn",
  description:
    "Party Barn in Old Town Murrieta. Address, hours, and directions. Opening Spring 26'. Entrance faces Ivy Street.",
};

export default function VisitPage() {
  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Location
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Visit Us
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed">
            We&apos;re in Old Town Murrieta. Stop by for balloons, party goods,
            and gifts—or to say hello.
          </p>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-cream/40">
        <div className="container-narrow">
          <div className="rounded-xl border border-brand-cream bg-white p-8 md:p-10 shadow-sm max-w-2xl">
            <p className="font-serif text-sm font-semibold uppercase tracking-wider text-brand-copper">
              Opening Spring 26&apos;
            </p>
            <p className="mt-2 text-brand-ink/70 text-sm">
              Hours to be announced
            </p>
            <address className="mt-8 not-italic">
              <p className="font-serif text-xl font-semibold text-brand-ink">
                Party Barn
              </p>
              <p className="mt-2 text-brand-ink/85">
                24977 Washington Ave, Suite E
                <br />
                Murrieta, CA 92562
              </p>
              <p className="mt-3 text-brand-ink/70 text-sm italic">
                Entrance faces Ivy Street
              </p>
            </address>
            <div className="mt-8 pt-8 border-t border-brand-cream">
              <a
                href="https://www.google.com/maps/search/?api=1&query=24977+Washington+Ave+Suite+E+Murrieta+CA+92562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded px-5 py-2.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
              >
                Get directions
              </a>
            </div>
          </div>
          <p className="mt-10 text-brand-ink/80">
            Questions?{" "}
            <Link href="/contact" className="text-brand-copper hover:underline font-medium">
              Send us a message
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
