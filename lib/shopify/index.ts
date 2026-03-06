import { storefrontQuery } from "./client";
import { PRODUCTS_WITH_PICKUP, PRODUCT_BY_HANDLE_WITH_PICKUP } from "./queries";
import type { StorefrontProduct, StoreAvailability } from "./types";

/** Raw GraphQL product node (shared by products + product(handle)) */
interface ProductNodeRaw {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      storeAvailability?: {
        edges: Array<{
          node: {
            available: boolean;
            pickUpTime: string | null;
            location: { name: string };
          };
        }>;
      };
    }>;
  };
}

interface ProductsResponse {
  products: { edges: Array<{ node: ProductNodeRaw }> };
}

interface ProductByHandleResponse {
  product: (ProductNodeRaw & {
    descriptionHtml?: string;
    images?: { nodes: Array<{ url: string; altText: string | null }> };
  }) | null;
}

function parseStoreAvailability(
  edges: Array<{ node: { available: boolean; pickUpTime?: string | null; location: { name: string } } }> | undefined
): StoreAvailability | null {
  if (!edges?.length) return null;
  const first = edges[0].node;
  return {
    available: first.available,
    pickUpTime: first.pickUpTime ?? null,
    locationName: first.location.name,
  };
}

function toStorefrontProduct(
  node: ProductNodeRaw & { descriptionHtml?: string; images?: { nodes: Array<{ url: string; altText: string | null }> } }
): StorefrontProduct {
  const firstVariant = node.variants.nodes[0];
  const images = node.images?.nodes?.length ? node.images.nodes : undefined;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    featuredImage: node.featuredImage ?? undefined,
    images,
    availableForSale: node.availableForSale,
    variants: {
      nodes: node.variants.nodes.map((v) => ({
        id: v.id,
        title: "",
        availableForSale: v.availableForSale,
        price: v.price,
        storeAvailability: v.storeAvailability,
      })),
    },
    priceRange: node.priceRange,
  };
}

export async function getProducts(): Promise<StorefrontProduct[]> {
  const data = await storefrontQuery<ProductsResponse>(PRODUCTS_WITH_PICKUP, { first: 100 });
  return data.products.edges.map((e) => toStorefrontProduct(e.node));
}

export async function getProductByHandle(handle: string): Promise<StorefrontProduct | null> {
  const data = await storefrontQuery<ProductByHandleResponse>(PRODUCT_BY_HANDLE_WITH_PICKUP, {
    handle,
  });
  if (!data.product) return null;
  return toStorefrontProduct(data.product);
}

export function getFirstVariantPickup(product: StorefrontProduct): StoreAvailability | null {
  const first = product.variants.nodes[0];
  if (!first?.storeAvailability?.edges?.length) return null;
  return parseStoreAvailability(first.storeAvailability.edges);
}

export type { StorefrontProduct, StoreAvailability } from "./types";
