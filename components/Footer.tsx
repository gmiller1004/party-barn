import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brand-cream bg-brand-cream/30">
      <div className="mx-auto max-w-9xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="space-y-3">
            <p className="font-serif text-lg font-semibold text-brand-ink">
              Party Barn
            </p>
            <p className="text-sm text-brand-ink/80 max-w-sm">
              <span className="font-script text-brand-copper text-base">Rooted in Celebration.</span>{" "}
              Premium balloons, curated party goods, and thoughtful event styling in Old Town Murrieta.
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div>
              <p className="font-serif text-sm font-semibold text-brand-ink mb-2">
                Visit
              </p>
              <p className="text-sm text-brand-ink/80">
                Opening Spring 26&apos;
              </p>
              <p className="text-sm text-brand-ink/80 mt-1">
                24977 Washington Ave, Suite E
                <br />
                Murrieta, CA 92562
              </p>
              <p className="text-sm text-brand-ink/70 mt-1 italic">
                Entrance faces Ivy Street
              </p>
              <Link
                href="/visit"
                className="mt-2 inline-block text-sm font-medium text-brand-copper hover:underline"
              >
                Hours &amp; directions →
              </Link>
            </div>
            <div>
              <p className="font-serif text-sm font-semibold text-brand-ink mb-2">
                Connect
              </p>
              <ul className="space-y-1 text-sm text-brand-ink/80">
                <li>
                  <Link href="/contact" className="hover:text-brand-copper transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/balloon-order" className="hover:text-brand-copper transition-colors">
                    Balloon order
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-brand-cream flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-ink/60">
            © {new Date().getFullYear()} Party Barn. All rights reserved.
          </p>
          <nav className="flex gap-6 text-xs text-brand-ink/60" aria-label="Legal">
            <Link href="/privacy" className="hover:text-brand-ink/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-ink/80 transition-colors">
              Terms and Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
