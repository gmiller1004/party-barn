"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getFirstVariantPickup } from "@/lib/shopify";
import { useCart } from "@/components/cart/CartContext";

type Props = {
  handle: string | null;
  onClose: () => void;
};

export function ProductModal({ handle, onClose }: Props) {
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!handle) {
      setProduct(null);
      setQuantity(1);
      return;
    }
    setLoading(true);
    fetch(`/api/product/${encodeURIComponent(handle)}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Not found"))))
      .then((data) => {
        setProduct(data);
        setQuantity(1);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [handle]);

  const firstVariant = product?.variants.nodes[0];
  const pickup = product ? getFirstVariantPickup(product) : null;
  const price = product?.priceRange.minVariantPrice;
  const images = product?.images?.length ? product.images : product?.featuredImage ? [product.featuredImage] : [];
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (!firstVariant) return;
    setAdding(true);
    try {
      await addToCart(firstVariant.id, quantity);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const open = !!handle;

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-brand-ink/50 transition-opacity"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg border border-brand-cream bg-brand-offwhite shadow-xl overflow-hidden"
        role="dialog"
        aria-modal
        aria-labelledby="product-modal-title"
      >
        <div className="flex items-center justify-between border-b border-brand-cream px-6 py-3">
          <h2 id="product-modal-title" className="font-serif text-lg font-semibold text-brand-ink">
            {product?.title ?? "Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-brand-ink/80 hover:bg-brand-cream/50 hover:text-brand-ink"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <p className="text-brand-ink/70">Loading…</p>
          )}
          {!loading && !product && (
            <p className="text-brand-ink/70">Product not found.</p>
          )}
          {!loading && product && (
            <div className="space-y-6">
              {images.length > 0 && (
                <div className="space-y-2">
                  <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg bg-brand-cream/30">
                    <Image
                      src={images[imageIndex].url}
                      alt={images[imageIndex].altText ?? product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 95vw, 512px"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 flex-wrap">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImageIndex(i)}
                          className={`block h-12 w-12 shrink-0 rounded overflow-hidden border-2 transition-colors ${
                            i === imageIndex ? "border-brand-copper" : "border-transparent hover:border-brand-cream"
                          }`}
                        >
                          <span className="relative block h-full w-full">
                            <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {price && (
                <p className="text-lg font-medium text-brand-ink">
                  ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                </p>
              )}
              {(product.descriptionHtml ?? product.description) && (
                <div
                  className="text-brand-ink/85 prose prose-sm max-w-none prose-p:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml ?? product.description,
                  }}
                />
              )}
              {pickup && (
                <div className="rounded-lg border border-brand-cream bg-brand-cream/40 p-4">
                  <p className="font-serif text-sm font-semibold text-brand-ink">Store pickup</p>
                  <p className="mt-1 text-sm text-brand-ink/85">
                    {pickup.available
                      ? pickup.pickUpTime
                        ? `Available — ${pickup.pickUpTime}`
                        : "Available for pickup at Party Barn, Murrieta."
                      : "Check back for availability."}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <label className="sr-only" htmlFor="modal-qty">Quantity</label>
                <input
                  id="modal-qty"
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                  className="w-16 rounded border border-brand-cream bg-white px-2 py-2 text-center text-brand-ink focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                />
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || !firstVariant}
                  className="rounded bg-brand-ink px-5 py-2 text-sm font-medium text-brand-offwhite hover:bg-brand-ink/90 disabled:opacity-50 transition-colors"
                >
                  {adding ? "Adding…" : "Add to cart"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
