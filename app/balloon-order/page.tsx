import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Balloon Order | Party Barn",
  description:
    "Order custom balloons and garlands from Party Barn. Premium helium balloons and grab-n-go garlands in Old Town Murrieta.",
};

export default function BalloonOrderPage() {
  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Order
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Balloon Order
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
            Custom balloon arrangements and grab-n-go garlands, curated to match
            your celebration. Tell us what you have in mind and we&apos;ll help
            bring it to life.
          </p>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-cream/30 pb-20">
        <div className="container-narrow">
          <form
            action="#"
            method="post"
            className="mx-auto max-w-xl rounded-xl border border-brand-cream bg-white p-8 shadow-sm"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="balloon-name" className="block text-sm font-medium text-brand-ink">
                  Name
                </label>
                <input
                  type="text"
                  id="balloon-name"
                  name="name"
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="balloon-email" className="block text-sm font-medium text-brand-ink">
                  Email
                </label>
                <input
                  type="email"
                  id="balloon-email"
                  name="email"
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="balloon-date" className="block text-sm font-medium text-brand-ink">
                  Event or pickup date
                </label>
                <input
                  type="text"
                  id="balloon-date"
                  name="event_date"
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                  placeholder="e.g. March 15 or TBD"
                />
              </div>
              <div>
                <label htmlFor="balloon-details" className="block text-sm font-medium text-brand-ink">
                  What you&apos;re looking for
                </label>
                <textarea
                  id="balloon-details"
                  name="details"
                  rows={5}
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper resize-y"
                  placeholder="Colors, style (organic garland, bouquets, etc.), quantity, and any theme or occasion…"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full rounded px-5 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2"
              >
                Submit balloon request
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-brand-ink/80">
            When our shop is open, you&apos;ll also be able to{" "}
            <Link href="/shop" className="text-brand-copper hover:underline font-medium">
              shop balloons online
            </Link>{" "}
            for store pickup.
          </p>
        </div>
      </section>
    </>
  );
}
