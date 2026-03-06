import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop | Party Barn Mercantile",
  description:
    "Shop premium party supplies, balloons, and curated goods. Order online for store pickup in Murrieta.",
};

export const revalidate = 60;

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products.";
  }

  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-brand-copper mb-2">
            Store
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-ink leading-tight">
            Shop
          </h1>
          <p className="mt-6 text-lg text-brand-ink/85 leading-relaxed max-w-2xl">
            Curated party goods, balloons, and gifts. Order online and pick up at
            the shop in Murrieta.
          </p>
        </div>
      </section>

      {error && (
        <section className="container-narrow pb-12">
          <div className="rounded-lg border border-brand-sand/50 bg-brand-cream/40 p-6 text-brand-ink/80">
            <p className="font-medium text-brand-ink">Couldn’t load products</p>
            <p className="mt-1 text-sm">{error}</p>
            <p className="mt-2 text-sm">Check your Shopify env vars and Headless channel.</p>
          </div>
        </section>
      )}

      {!error && products.length === 0 && (
        <section className="section-spacing-tight bg-brand-cream/30">
          <div className="container-narrow text-center">
            <p className="text-brand-ink/80">No products yet. Check back soon.</p>
            <Link href="/visit" className="mt-4 inline-block text-sm font-medium text-brand-copper hover:underline">
              Visit &amp; directions →
            </Link>
          </div>
        </section>
      )}

      {!error && products.length > 0 && (
        <section className="section-spacing-tight bg-brand-cream/30 pb-20">
          <div className="container-wide">
            <ShopContent products={products} />
          </div>
        </section>
      )}

      <section className="container-narrow pb-16">
        <div className="rounded-lg border border-brand-cream bg-brand-cream/30 p-6 max-w-xl">
          <p className="font-serif text-lg font-semibold text-brand-ink">
            Pick up at Party Barn
          </p>
          <p className="mt-1 text-sm text-brand-ink/80">
            24977 Washington Ave, Suite E, Murrieta, CA 92562. Entrance faces Ivy Street.
          </p>
          <Link
            href="/visit"
            className="mt-4 inline-block text-sm font-medium text-brand-copper hover:underline"
          >
            Hours &amp; directions →
          </Link>
        </div>
      </section>
    </>
  );
}
