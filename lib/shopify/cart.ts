import { storefrontQuery } from "./client";

export interface CartLine {
  id: string;
  quantity: number;
  title: string;
  variantId: string;
  price: string;
  currencyCode: string;
  imageUrl?: string;
}

export interface CartData {
  id: string;
  lines: CartLine[];
  note: string | null;
  checkoutUrl: string | null;
}

const CART_FRAGMENT = `
  id
  note
  checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
            }
            product {
              title
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE = `
  mutation cartCreate {
    cartCreate(input: {}) {
      cart { ${CART_FRAGMENT} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FRAGMENT} }
      userErrors { field message }
    }
  }
`;

const CART_NOTE_UPDATE = `
  mutation cartNoteUpdate($cartId: ID!, $note: String) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart { id note }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FRAGMENT}
    }
  }
`;

function parseCart(raw: RawCart | null): CartData | null {
  if (!raw) return null;
  const lines: CartLine[] = (raw.lines?.edges ?? []).map(({ node }) => {
    const m = node.merchandise as {
      id: string;
      title: string;
      price: { amount: string; currencyCode: string };
      image?: { url: string };
      product: { title: string };
    };
    return {
      id: node.id,
      quantity: node.quantity,
      title: m?.product?.title ?? m?.title ?? "Item",
      variantId: m?.id ?? "",
      price: m?.price?.amount ?? "0",
      currencyCode: m?.price?.currencyCode ?? "USD",
      imageUrl: m?.image?.url,
    };
  });
  return {
    id: raw.id,
    lines,
    note: raw.note ?? null,
    checkoutUrl: raw.checkoutUrl ?? null,
  };
}

interface RawCart {
  id: string;
  note?: string | null;
  checkoutUrl?: string | null;
  lines?: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: unknown;
      };
    }>;
  };
}

export async function cartCreate(): Promise<CartData> {
  const data = await storefrontQuery<{ cartCreate: { cart: RawCart; userErrors: Array<{ message: string }> } }>(CART_CREATE);
  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "));
  }
  const cart = parseCart(data.cartCreate.cart);
  if (!cart) throw new Error("Cart create returned no cart");
  return cart;
}

export async function cartLinesAdd(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<CartData> {
  const data = await storefrontQuery<{
    cartLinesAdd: { cart: RawCart; userErrors: Array<{ message: string }> };
  }>(CART_LINES_ADD, {
    cartId,
    lines: lines.map((l) => ({ merchandiseId: l.merchandiseId, quantity: l.quantity })),
  });
  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join("; "));
  }
  const cart = parseCart(data.cartLinesAdd.cart);
  if (!cart) throw new Error("Cart add returned no cart");
  return cart;
}

export async function cartNoteUpdate(cartId: string, note: string | null): Promise<{ note: string | null }> {
  const data = await storefrontQuery<{
    cartNoteUpdate: { cart: { id: string; note: string | null }; userErrors: Array<{ message: string }> };
  }>(CART_NOTE_UPDATE, { cartId, note });
  if (data.cartNoteUpdate.userErrors?.length) {
    throw new Error(data.cartNoteUpdate.userErrors.map((e) => e.message).join("; "));
  }
  return { note: data.cartNoteUpdate.cart.note };
}

export async function getCart(cartId: string): Promise<CartData | null> {
  const data = await storefrontQuery<{ cart: RawCart | null }>(CART_QUERY, { cartId });
  return parseCart(data.cart);
}
