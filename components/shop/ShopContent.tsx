"use client";

import { useState } from "react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

type Props = {
  products: StorefrontProduct[];
};

export function ShopContent({ products }: Props) {
  const [modalHandle, setModalHandle] = useState<string | null>(null);

  return (
    <CartProvider>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onMoreInfo={() => setModalHandle(product.handle)}
          />
        ))}
      </div>
      <CartDrawer />
      <ProductModal handle={modalHandle} onClose={() => setModalHandle(null)} />
    </CartProvider>
  );
}
