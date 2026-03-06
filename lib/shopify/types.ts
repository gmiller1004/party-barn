/** Shopify Storefront API – product and pickup types */

export interface StorefrontProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  /** Set when loading single product (product by handle). */
  descriptionHtml?: string;
  featuredImage?: { url: string; altText: string | null };
  /** Set when loading single product (product by handle). */
  images?: Array<{ url: string; altText: string | null }>;
  availableForSale: boolean;
  variants: {
    nodes: StorefrontVariant[];
  };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
}

export interface StorefrontVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  storeAvailability?: {
    edges: Array<{
      node: {
        available: boolean;
        pickUpTime?: string | null;
        location: { name: string };
      };
    }>;
  };
}

export interface StoreAvailability {
  available: boolean;
  pickUpTime: string | null;
  locationName: string;
}
