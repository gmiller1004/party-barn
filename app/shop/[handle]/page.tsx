import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductByHandle, getFirstVariantPickup } from "@/lib/shopify";
import type { StoreAvailability } from "@/lib/shopify/types";

export const revalidate = 60;

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product | Party Barn Mercantile" };
  return {
    title: `${product.title} | Party Barn Mercantile`,
    description: product.description?.slice(0, 160) ?? undefined,
  };
}

function PickupBlock({ pickup }: { pickup: StoreAvailability }) {
  return (
    <div className="rounded-lg border border-brand-cream bg-brand-cream/40 p-4">
      <p className="font-serif text-sm font-semibold text-brand-ink">
        Store pickup at Party Barn
      </p>
      <p className="mt-1 text-sm text-brand-ink/85">
        {pickup.available
          ? pickup.pickUpTime
            ? `Available for pickup — ${pickup.pickUpTime}`
            : "Available for pickup at our Murrieta location."
          : "Check back for availability."}
      </p>
      <p className="mt-2 text-xs text-brand-ink/70">
        24977 Washington Ave, Suite E · Murrieta, CA 92562
      </p>
      <p className="mt-0.5 text-xs text-brand-ink/60 italic">Entrance faces Ivy Street</p>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const firstVariant = product.variants.nodes[0];
  const pickup = getFirstVariantPickup(product);
  const price = product.priceRange.minVariantPrice;

  return (
    <>
      <section className="section-spacing bg-brand-offwhite">
        <div className="container-narrow">
          <Link
            href="/shop"
            className="text-sm font-medium text-brand-copper hover:underline"
          >
            ← Back to shop
          </Link>
        </div>
      </section>

      <section className="section-spacing-tight bg-brand-offwhite pb-20">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-square max-w-lg overflow-hidden rounded-lg bg-brand-cream/30">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-brand-ink/40">
                  No image
                </span>
              )}
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-ink">
                {product.title}
              </h1>
              <p className="mt-3 text-lg font-medium text-brand-ink">
                ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
              </p>
              {product.description && (
                <div
                  className="mt-6 text-brand-ink/85 prose prose-sm max-w-none prose-p:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml ?? product.description,
                  }}
                />
              )}
              {pickup && <div className="mt-8"><PickupBlock pickup={pickup} /></div>}
              <p className="mt-6 text-sm text-brand-ink/70">
                At checkout, choose &ldquo;Local pickup&rdquo; to pick up at Party Barn in Murrieta.
              </p>
              {firstVariant && (() => {
                const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
                const variantId = firstVariant.id.replace(/^gid:\/\/shopify\/ProductVariant\//, "");
                const cartUrl = domain ? `https://${domain}/cart/${variantId}:1` : "#";
                return (
                  <a
                    href={cartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center rounded px-6 py-3.5 text-sm font-medium bg-brand-ink text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
                  >
                    Add to cart (Shopify checkout)
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
