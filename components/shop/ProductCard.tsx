"use client";

import { useState } from "react";
import Image from "next/image";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getFirstVariantPickup } from "@/lib/shopify";
import { useCart } from "@/components/cart/CartContext";

type Props = {
  product: StorefrontProduct;
  onMoreInfo: () => void;
};

export function ProductCard({ product, onMoreInfo }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const price = product.priceRange.minVariantPrice;
  const firstVariant = product.variants.nodes[0];
  const pickup = getFirstVariantPickup(product);

  const handleAddToCart = async () => {
    if (!firstVariant) return;
    setAdding(true);
    try {
      await addToCart(firstVariant.id, quantity);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="flex flex-col rounded-lg overflow-hidden border border-brand-cream bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-brand-cream/30">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-brand-ink/40 text-sm">
            No image
          </span>
        )}
        {pickup?.available && (
          <span className="absolute bottom-2 left-2 right-2 rounded bg-brand-ink/90 px-2 py-1 text-center text-xs font-medium text-brand-offwhite">
            Available for store pickup
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-serif text-lg font-semibold text-brand-ink line-clamp-2">
          {product.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-brand-ink">
          ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
        </p>
        {pickup?.available && pickup.pickUpTime && (
          <p className="mt-1 text-xs text-brand-ink/70">{pickup.pickUpTime}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`qty-${product.id}`}>
            Quantity
          </label>
          <input
            id={`qty-${product.id}`}
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
            className="w-16 rounded border border-brand-cream bg-white px-2 py-1.5 text-center text-sm text-brand-ink focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || !firstVariant}
            className="rounded bg-brand-ink px-4 py-2 text-sm font-medium text-brand-offwhite hover:bg-brand-ink/90 disabled:opacity-50 transition-colors"
          >
            {adding ? "Adding…" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={onMoreInfo}
            className="rounded border border-brand-cream bg-white px-4 py-2 text-sm font-medium text-brand-ink hover:bg-brand-cream/50 transition-colors"
          >
            More info
          </button>
        </div>
      </div>
    </article>
  );
}
