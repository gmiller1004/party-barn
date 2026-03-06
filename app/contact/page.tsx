import type { Metadata } from "next";

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
          <form
            action="#"
            method="post"
            className="mx-auto max-w-xl rounded-xl border border-brand-cream bg-white p-8 shadow-sm"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-ink">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-ink">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-ink">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                >
                  <option value="">Select…</option>
                  <option value="event-styling">Event styling inquiry</option>
                  <option value="balloons">Balloon order / question</option>
                  <option value="general">General question</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-1.5 block w-full rounded border border-brand-cream bg-brand-offwhite/50 px-4 py-2.5 text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper resize-y"
                  placeholder="How can we help?"
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full rounded px-5 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
